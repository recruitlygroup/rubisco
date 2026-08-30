/**
 * Blog content, loaded from the markdown files in ./posts/*.md at build
 * time. Each file's frontmatter (title, slug, date, excerpt, tags,
 * categories, published) plus its markdown body become one post object.
 *
 * New posts are added by committing a new .md file here — either by hand,
 * or via the admin dashboard at /admin, which commits directly to this
 * repo through the GitHub API (see functions/api/admin/).
 *
 * Only posts with `published: true` are included in the site build.
 */
import { parseFrontmatter } from '../lib/frontmatter.js'

const files = import.meta.glob('./posts/*.md', { eager: true, query: '?raw', import: 'default' })

export const posts = Object.entries(files)
  .map(([path, raw]) => {
    const { data, body } = parseFrontmatter(raw)
    const slug = data.slug || path.split('/').pop().replace(/\.md$/, '')
    return {
      slug,
      title: data.title || slug,
      date: data.date || '1970-01-01',
      excerpt: data.excerpt || '',
      tags: data.tags || [],
      categories: data.categories || [],
      published: data.published !== false,
      body,
    }
  })
  .filter((post) => post.published)
  .sort((a, b) => new Date(b.date) - new Date(a.date))

export function getPostBySlug(slug) {
  return posts.find((post) => post.slug === slug)
}
