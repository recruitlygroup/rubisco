import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { marked } from 'marked'
import { getPostBySlug } from '../content/posts.js'
import NotFound from './NotFound.jsx'

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
