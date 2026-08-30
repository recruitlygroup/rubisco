import { isAuthenticated } from '../../../_lib/session.js'
import { ghGetFile, ghPutFile, ghDeleteFile } from '../../../_lib/github.js'
import { parseFrontmatter, serializeFrontmatter } from '../../../../src/lib/frontmatter.js'

const PUBLISHED_DIR = 'src/content/posts'
const DRAFTS_DIR = 'content/drafts'

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

async function locatePost(env, slug) {
  const publishedPath = `${PUBLISHED_DIR}/${slug}.md`
  const draftPath = `${DRAFTS_DIR}/${slug}.md`

  const [published, draft] = await Promise.all([
    ghGetFile(env, publishedPath),
    ghGetFile(env, draftPath),
  ])

  if (published) return { path: publishedPath, status: 'published', ...published }
  if (draft) return { path: draftPath, status: 'draft', ...draft }
  return null
}

export async function onRequestGet({ request, env, params }) {
  if (!(await isAuthenticated(request, env))) return jsonResponse({ error: 'Not authenticated.' }, 401)

  const found = await locatePost(env, params.slug)
  if (!found) return jsonResponse({ error: 'Post not found.' }, 404)

  const { data, body } = parseFrontmatter(found.content)
  return jsonResponse({
    slug: params.slug,
    title: data.title || '',
    date: data.date || '',
    excerpt: data.excerpt || '',
    tags: data.tags || [],
    categories: data.categories || [],
    published: found.status === 'published',
    markdown: body,
  })
}

export async function onRequestPut({ request, env, params }) {
  if (!(await isAuthenticated(request, env))) return jsonResponse({ error: 'Not authenticated.' }, 401)

  const found = await locatePost(env, params.slug)
  if (!found) return jsonResponse({ error: 'Post not found.' }, 404)

  let body
  try {
    body = await request.json()
  } catch {
    return jsonResponse({ error: 'Invalid request body.' }, 400)
  }

  const { title, excerpt = '', markdown = '', tags = [], categories = [], published = false, date } = body
  if (!title) return jsonResponse({ error: 'Title is required.' }, 400)

  const newStatus = published ? 'published' : 'draft'
  const newPath = `${published ? PUBLISHED_DIR : DRAFTS_DIR}/${params.slug}.md`
  const fileContent = serializeFrontmatter(
    {
      title,
      slug: params.slug,
      date: date || new Date().toISOString().slice(0, 10),
      excerpt,
      tags,
      categories,
      published: !!published,
    },
    markdown,
  )

  try {
    if (newStatus === found.status) {
      // Same location — plain update.
      await ghPutFile(env, found.path, fileContent, `Update post: ${title}`, found.sha)
    } else {
      // Moving between draft <-> published: create at the new location,
      // then remove the old file, as two commits.
      await ghPutFile(env, newPath, fileContent, `${published ? 'Publish' : 'Unpublish'} post: ${title}`)
      await ghDeleteFile(env, found.path, `Remove old copy after ${published ? 'publishing' : 'unpublishing'}: ${title}`, found.sha)
    }
    return jsonResponse({ ok: true, slug: params.slug, status: newStatus })
  } catch (err) {
    return jsonResponse({ error: 'Could not update post on GitHub.', detail: String(err) }, 502)
  }
}

export async function onRequestDelete({ request, env, params }) {
  if (!(await isAuthenticated(request, env))) return jsonResponse({ error: 'Not authenticated.' }, 401)

  const found = await locatePost(env, params.slug)
  if (!found) return jsonResponse({ error: 'Post not found.' }, 404)

  try {
    await ghDeleteFile(env, found.path, `Delete post: ${params.slug}`, found.sha)
    return jsonResponse({ ok: true })
  } catch (err) {
    return jsonResponse({ error: 'Could not delete post on GitHub.', detail: String(err) }, 502)
  }
}
