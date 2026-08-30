import { isAuthenticated } from '../../../_lib/session.js'
import { ghListDir, ghGetFile, ghPutFile } from '../../../_lib/github.js'
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
    const [publishedFiles, draftFiles] = await Promise.all([
      ghListDir(env, PUBLISHED_DIR),
      ghListDir(env, DRAFTS_DIR),
    ])

    const load = async (entry, status) => {
      const file = await ghGetFile(env, entry.path)
      const { data } = parseFrontmatter(file.content)
      return {
        slug: data.slug || entry.name.replace(/\.md$/, ''),
        title: data.title || entry.name,
        date: data.date || '',
        excerpt: data.excerpt || '',
        tags: data.tags || [],
        categories: data.categories || [],
        status,
      }
    }

    const posts = await Promise.all([
      ...publishedFiles.filter((f) => f.name.endsWith('.md')).map((f) => load(f, 'published')),
      ...draftFiles.filter((f) => f.name.endsWith('.md') && f.name !== '.gitkeep').map((f) => load(f, 'draft')),
    ])

    posts.sort((a, b) => (b.date || '').localeCompare(a.date || ''))

    return jsonResponse({ posts })
  } catch (err) {
    return jsonResponse({ error: 'Could not reach GitHub.', detail: String(err) }, 502)
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
