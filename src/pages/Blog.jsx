import { Link } from 'react-router-dom'
import { posts } from '../content/posts.js'
import useReveal from '../lib/useReveal.js'

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

export default function Blog() {
  const listRef = useReveal()
  const [featured, ...rest] = posts

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pb-10 pt-20 sm:px-10">
        <p className="font-mono text-xs uppercase tracking-widest text-leaf">Blog</p>
        <h1 className="mt-3 font-display text-3xl font-medium text-ink sm:text-4xl">
          Notes from the field
        </h1>
        <p className="mt-4 max-w-xl text-ink-soft">
          What we learn building software and hardware for working farms —
          written plainly, without the buzzwords.
        </p>
      </section>

      {featured && (
        <section className="border-t border-line/70">
          <Link
            to={`/blog/${featured.slug}`}
            className="group block px-6 py-14 transition-colors hover:bg-milk sm:px-10"
          >
            <div className="mx-auto max-w-6xl">
              <p className="font-mono text-xs text-ink-soft">{formatDate(featured.date)}</p>
              <h2 className="mt-3 max-w-2xl font-display text-2xl font-medium leading-snug text-ink group-hover:text-leaf sm:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-3 max-w-xl text-ink-soft">{featured.excerpt}</p>
              <p className="mt-5 inline-flex items-center gap-2 font-mono text-xs text-leaf">
                Read the piece
                <span aria-hidden="true">&rarr;</span>
              </p>
            </div>
          </Link>
        </section>
      )}

      <section ref={listRef} className="reveal border-t border-line/70">
        <div className="mx-auto max-w-6xl divide-y divide-line/70 px-6 sm:px-10">
          {rest.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group flex flex-col gap-2 py-8 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
            >
              <div className="sm:max-w-xl">
                <h3 className="font-display text-lg font-medium text-ink group-hover:text-leaf">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {post.excerpt}
                </p>
              </div>
              <p className="shrink-0 font-mono text-xs text-ink-soft">
                {formatDate(post.date)}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
