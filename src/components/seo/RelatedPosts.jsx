import { Link } from 'react-router-dom'
import { getPostBySlug } from '../../lib/posts.js'

/**
 * Internal links from a landing page to existing blog posts.
 *
 * Takes blog slugs and looks each one up in the live post list, so a slug
 * that was renamed or unpublished is silently skipped instead of producing
 * a broken link. Reads posts only; it never writes to them.
 */
export default function RelatedPosts({ slugs = [], heading = 'Related reading' }) {
  const items = slugs.map((slug) => getPostBySlug(slug)).filter(Boolean)
  if (items.length === 0) return null

  return (
    <section className="border-t border-line/70">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
        <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">{heading}</h2>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2">
          {items.map((post) => (
            <li key={post.slug}>
              <Link
                to={`/blog/${post.slug}`}
                className="hover-lift block h-full border border-line bg-milk p-6"
              >
                <p className="font-display text-lg font-medium text-ink">{post.title}</p>
                {post.excerpt && (
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">
                    {post.excerpt.trim()}
                  </p>
                )}
                <p className="mt-4 font-mono text-xs text-leaf">
                  Read article <span aria-hidden="true">&rarr;</span>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
