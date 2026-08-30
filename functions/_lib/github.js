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
