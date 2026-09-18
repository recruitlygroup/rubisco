// Thin wrapper around the GitHub Contents API
// (https://docs.github.com/en/rest/repos/contents), used to read and write
// blog post markdown files directly in the site's repo. Every write is a
// real commit, authored by the token owner, on env.GITHUB_BRANCH.

function apiBase(env) {
  return `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents`
}

function headers(env) {
  return {
    Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'rubisco-admin-dashboard',
  }
}

function toBase64(str) {
  // btoa expects Latin1; encode UTF-8 bytes first so non-ASCII content
  // (e.g. Nepali text in a post body) round-trips correctly.
  const bytes = new TextEncoder().encode(str)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

function fromBase64(b64) {
  const binary = atob(b64.replace(/\n/g, ''))
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

/** Fetch a single file's content + sha, or null if it doesn't exist. */
export async function ghGetFile(env, path) {
  const url = `${apiBase(env)}/${path}?ref=${env.GITHUB_BRANCH}`
  const res = await fetch(url, { headers: headers(env) })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`GitHub GET ${path} failed: ${res.status} ${await res.text()}`)
  const json = await res.json()
  return { sha: json.sha, content: fromBase64(json.content) }
}

/** List files in a directory (non-recursive). Returns [] if the dir doesn't exist yet. */
export async function ghListDir(env, path) {
  const url = `${apiBase(env)}/${path}?ref=${env.GITHUB_BRANCH}`
  const res = await fetch(url, { headers: headers(env) })
  if (res.status === 404) return []
  if (!res.ok) throw new Error(`GitHub LIST ${path} failed: ${res.status} ${await res.text()}`)
  const json = await res.json()
  return Array.isArray(json) ? json.filter((entry) => entry.type === 'file') : []
}

/**
 * List every file in a directory AND fetch its content, in a single GitHub
 * API call, via the GraphQL API.
 *
 * Why this exists: the REST Contents API (ghListDir + ghGetFile) needs one
 * HTTP request per file to read content, because a directory listing does
 * not include file bodies. For N posts that's N+1 requests fired from a
 * single Cloudflare Pages Function invocation (see ghListDir call sites) --
 * which (a) eats into the per-invocation subrequest limit Cloudflare
 * enforces on every Workers/Pages Functions request (a low fixed number on
 * the free plan, a higher but still fixed number on paid plans) and
 * (b) is needlessly chatty against GitHub's own rate limits. Once a post
 * collection has a few dozen entries, N+1 REST calls in parallel is exactly
 * the kind of thing that trips the subrequest ceiling and aborts the whole
 * Function invocation -- which surfaces to the browser as a bare 502 with
 * no usable JSON body, since the abort happens below the app's own
 * try/catch.
 *
 * GraphQL sidesteps this: one query fetches the whole tree (name + blob
 * text for every file in the directory) in a single HTTP round trip,
 * regardless of how many posts there are.
 */
export async function ghListDirWithContent(env, path) {
  const query = `
    query($owner: String!, $repo: String!, $expression: String!) {
      repository(owner: $owner, name: $repo) {
        object(expression: $expression) {
          ... on Tree {
            entries {
              name
              type
              object {
                ... on Blob { text }
              }
            }
          }
        }
      }
    }
  `
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { ...headers(env), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      variables: {
        owner: env.GITHUB_OWNER,
        repo: env.GITHUB_REPO,
        expression: `${env.GITHUB_BRANCH}:${path}`,
      },
    }),
  })

  if (!res.ok) throw new Error(`GitHub GraphQL LIST ${path} failed: ${res.status} ${await res.text()}`)

  const json = await res.json()
  if (json.errors?.length) {
    throw new Error(`GitHub GraphQL LIST ${path} failed: ${json.errors.map((e) => e.message).join('; ')}`)
  }

  const entries = json.data?.repository?.object?.entries || []
  return entries
    .filter((entry) => entry.type === 'blob' && entry.object?.text != null)
    .map((entry) => ({ name: entry.name, path: `${path}/${entry.name}`, content: entry.object.text }))
}

/** Create or update a file. Pass `sha` when updating an existing file. */
export async function ghPutFile(env, path, content, message, sha) {
  const res = await fetch(`${apiBase(env)}/${path}`, {
    method: 'PUT',
    headers: { ...headers(env), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      content: toBase64(content),
      branch: env.GITHUB_BRANCH,
      ...(sha ? { sha } : {}),
    }),
  })
  if (!res.ok) throw new Error(`GitHub PUT ${path} failed: ${res.status} ${await res.text()}`)
  return res.json()
}

export async function ghDeleteFile(env, path, message, sha) {
  const res = await fetch(`${apiBase(env)}/${path}`, {
    method: 'DELETE',
    headers: { ...headers(env), 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sha, branch: env.GITHUB_BRANCH }),
  })
  if (!res.ok) throw new Error(`GitHub DELETE ${path} failed: ${res.status} ${await res.text()}`)
  return res.json()
}
