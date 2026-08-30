import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { marked } from 'marked'
import { getPostBySlug } from '../content/posts.js'
import NotFound from './NotFound.jsx'
import Seo from '../components/Seo.jsx'

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

export default function BlogPost() {
  const { slug } = useParams()
  const post = getPostBySlug(slug)

  const html = useMemo(() => (post ? marked.parse(post.body) : ''), [post])

  if (!post) return <NotFound />

  return (
    <article className="mx-auto max-w-2xl px-6 py-20 sm:px-10">
      <Seo title={post.title} description={post.excerpt} path={`/blog/${post.slug}`} />
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 font-mono text-xs text-ink-soft hover:text-leaf"
      >
        <span aria-hidden="true">&larr;</span>
        All articles
      </Link>

      <p className="mt-6 font-mono text-xs text-ink-soft">{formatDate(post.date)}</p>
      <h1 className="mt-3 font-display text-3xl font-medium leading-tight text-ink sm:text-4xl">
        {post.title}
      </h1>

      {post.tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-line px-3 py-1 font-mono text-xs text-ink-soft"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}

      <div
        className="prose-rubisco mt-10"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <div className="mt-16 border-t border-line/70 pt-8">
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 font-mono text-sm text-leaf hover:underline"
        >
          Talk to us about a project
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </article>
  )
}
