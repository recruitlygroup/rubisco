import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { apiFetch } from '../../lib/api.js'

export default function AdminDashboard() {
  const [posts, setPosts] = useState(null)
  const [error, setError] = useState('')
  const [deletingSlug, setDeletingSlug] = useState(null)

  function loadPosts() {
    setError('')
    setPosts(null)
    apiFetch('/api/admin/posts')
      .then((data) => setPosts(data.posts || []))
      .catch((err) => {
        setError(err.message || 'Could not load posts.')
        setPosts([])
      })
  }

  useEffect(() => {
    loadPosts()
  }, [])

  async function handleDelete(slug) {
    if (!confirm(`Delete "${slug}"? This removes the file from GitHub and can't be undone.`)) return
    setDeletingSlug(slug)
    try {
      await apiFetch(`/api/admin/posts/${slug}`, { method: 'DELETE' })
      setPosts((prev) => prev.filter((p) => p.slug !== slug))
    } catch (err) {
      setError(err.message || 'Could not delete post.')
    } finally {
      setDeletingSlug(null)
    }
  }

  return (
    <div>
      <Helmet>
        <title>Posts — Rubisco Admin</title>
      </Helmet>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-medium text-ink">Posts</h1>
        <Link
          to="/admin/new"
          className="inline-flex items-center gap-2 border border-ink bg-ink px-5 py-2.5 font-mono text-xs text-milk transition-colors hover:border-leaf hover:bg-leaf"
        >
          New post
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>

      {error && (
        <div role="alert" className="mt-6 text-sm text-soil">
          <p>{error}</p>
          <button type="button" onClick={loadPosts} className="mt-2 font-mono text-xs text-leaf hover:underline">
            Retry
          </button>
        </div>
      )}

      {posts === null && !error && (
        <p className="mt-6 font-mono text-sm text-ink-soft">Loading…</p>
      )}

      {posts && posts.length === 0 && !error && (
        <p className="mt-6 font-mono text-sm text-ink-soft">No posts yet. Create your first one.</p>
      )}

      {posts && posts.length > 0 && (
        <div className="mt-8 divide-y divide-line/70 border-t border-line/70">
          {posts.map((post) => (
            <div key={post.slug} className="flex flex-wrap items-center justify-between gap-4 py-5">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest ${
                      post.status === 'published'
                        ? 'bg-leaf/15 text-leaf-dark'
                        : 'bg-mustard/20 text-mustard-dark'
                    }`}
                  >
                    {post.status}
                  </span>
                  <p className="truncate font-display text-lg font-medium text-ink">{post.title}</p>
                </div>
                <p className="mt-1 truncate text-sm text-ink-soft">{post.excerpt}</p>
                <p className="mt-1 font-mono text-xs text-ink-soft">
                  {post.date} · /blog/{post.slug}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-4 font-mono text-xs">
                <Link to={`/admin/edit/${post.slug}`} className="text-leaf hover:underline">
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(post.slug)}
                  disabled={deletingSlug === post.slug}
                  className="text-soil hover:underline disabled:opacity-50"
                >
                  {deletingSlug === post.slug ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
