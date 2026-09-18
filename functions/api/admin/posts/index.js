import { isAuthenticated } from '../../../_lib/session.js'
import { ghListDirWithContent, ghGetFile, ghPutFile } from '../../../_lib/github.js'
import { parseFrontmatter, serializeFrontmatter } from '../../../../src/lib/frontmatter.js'

const PUBLISHED_DIR = 'src/content/posts'
const DRAFTS_DIR = 'content/drafts'

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function onRequestGet({ request, env }) {
  if (!(await isAuthenticated(request, env))) {
    return jsonResponse({ error: 'Not authenticated.' }, 401)
  }

  try {
    // One GraphQL call per directory (not one REST call per file) -- see
    // the comment on ghListDirWithContent. This is what keeps the request
    // count flat as the number of posts grows.
    const [publishedFiles, draftFiles] = await Promise.all([
      ghListDirWithContent(env, PUBLISHED_DIR),
      ghListDirWithContent(env, DRAFTS_DIR),
    ])

    // A single malformed/corrupt post file should never take down the
    // whole listing -- surface it as a visibly broken row instead of
    // throwing and turning the entire dashboard into "Could not load
    // posts.".
    const toPost = (entry, status) => {
      try {
        const { data } = parseFrontmatter(entry.content)
        return {
          slug: data.slug || entry.name.replace(/\.md$/, ''),
          title: data.title || entry.name,
          date: data.date || '',
          excerpt: data.excerpt || '',
          tags: data.tags || [],
          categories: data.categories || [],
          status,
        }
      } catch (err) {
        console.error(`Failed to parse frontmatter for ${entry.path}:`, err)
        return {
          slug: entry.name.replace(/\.md$/, ''),
          title: `\u26A0\uFE0F ${entry.name} (failed to parse -- check its frontmatter)`,
          date: '',
          excerpt: String(err?.message || err),
          tags: [],
          categories: [],
          status: `${status}-error`,
        }
      }
    }

    const posts = [
      ...publishedFiles.filter((f) => f.name.endsWith('.md')).map((f) => toPost(f, 'published')),
      ...draftFiles.filter((f) => f.name.endsWith('.md') && f.name !== '.gitkeep').map((f) => toPost(f, 'draft')),
    ]

    posts.sort((a, b) => (b.date || '').localeCompare(a.date || ''))

    return jsonResponse({ posts })
  } catch (err) {
    // Log the real error to Cloudflare's Functions logs (dashboard or
    // `wrangler pages deployment tail`) -- the client only gets a summary.
    console.error('GET /api/admin/posts failed:', err)
    return jsonResponse({ error: 'Could not reach GitHub.', detail: String(err?.message || err) }, 502)
  }
}

export async function onRequestPost({ request, env }) {
  if (!(await isAuthenticated(request, env))) {
    return jsonResponse({ error: 'Not authenticated.' }, 401)
  }

  let body
  try {
    body = await request.json()
  } catch {
    return jsonResponse({ error: 'Invalid request body.' }, 400)
  }

  const { title, excerpt = '', markdown = '', tags = [], categories = [], published = false } = body
  const slug = slugify(body.slug || title || '')

  if (!title || !slug) {
    return jsonResponse({ error: 'Title is required.' }, 400)
  }

  const targetPath = `${published ? PUBLISHED_DIR : DRAFTS_DIR}/${slug}.md`
  const otherPath = `${published ? DRAFTS_DIR : PUBLISHED_DIR}/${slug}.md`

  try {
    const [existingTarget, existingOther] = await Promise.all([
      ghGetFile(env, targetPath),
      ghGetFile(env, otherPath),
    ])
    if (existingTarget || existingOther) {
      return jsonResponse({ error: `A post with slug "${slug}" already exists.` }, 409)
    }

    const date = body.date || new Date().toISOString().slice(0, 10)
    const fileContent = serializeFrontmatter(
      { title, slug, date, excerpt, tags, categories, published: !!published },
      markdown,
    )

    await ghPutFile(env, targetPath, fileContent, `Add post: ${title}`)

    return jsonResponse({ ok: true, slug, status: published ? 'published' : 'draft' }, 201)
  } catch (err) {
    return jsonResponse({ error: 'Could not save post to GitHub.', detail: String(err) }, 502)
  }
}
