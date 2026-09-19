import { parseFrontmatter } from './frontmatter.js'

// Reads every markdown file under src/content/posts/ at build time.
// This directory is the CMS's source of truth (functions/api/admin/posts/*
// commits files here via the GitHub API) -- drafts live in a separate
// content/drafts/ dir, so anything found here is publish-eligible by
// location. The `published` frontmatter flag is still checked as a
// belt-and-suspenders guard.
const modules = import.meta.glob('../content/posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const WORDS_PER_MINUTE = 200
const DEFAULT_AUTHOR = 'Rubisco Team'

// Rough reading-time estimate from the markdown body's word count. Strips
// the most common markdown syntax first so headings/links/code fences
// don't inflate the count, then rounds up to a whole minute (minimum 1).
function estimateReadingTime(body) {
  const plain = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#*_>~-]/g, ' ')

  const wordCount = plain.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE))
}

function loadPost(path, raw) {
  const { data, body } = parseFrontmatter(raw)
  const slug = data.slug || path.split('/').pop().replace(/\.md$/, '')
  return {
    slug,
    title: data.title || slug,
    date: data.date || '',
    excerpt: data.excerpt || '',
    author: data.author || DEFAULT_AUTHOR,
    tags: data.tags || [],
    categories: data.categories || [],
    published: data.published !== false,
    readingTime: estimateReadingTime(body),
    body,
  }
}

const allPosts = Object.entries(modules)
  .map(([path, raw]) => loadPost(path, raw))
  .filter((post) => post.published)
  .sort((a, b) => (b.date || '').localeCompare(a.date || ''))

export const posts = allPosts

export function getPostBySlug(slug) {
  return allPosts.find((post) => post.slug === slug)
}
