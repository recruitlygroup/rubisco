import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { marked } from 'marked'
import { Helmet } from 'react-helmet-async'

function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const emptyForm = {
  title: '',
  slug: '',
  excerpt: '',
  markdown: '',
  tags: '',
  categories: '',
  published: false,
}

export default function AdminPostEditor() {
  const { slug: editingSlug } = useParams()
  const isEditing = Boolean(editingSlug)
  const navigate = useNavigate()

  const [form, setForm] = useState(emptyForm)
  const [slugTouched, setSlugTouched] = useState(false)
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    if (!isEditing) return
    fetch(`/api/admin/posts/${editingSlug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error)
          return
        }
        setForm({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          markdown: data.markdown,
          tags: (data.tags || []).join(', '),
          categories: (data.categories || []).join(', '),
          published: data.published,
        })
        setSlugTouched(true)
      })
      .catch(() => setError('Could not load post.'))
      .finally(() => setLoading(false))
  }, [editingSlug, isEditing])

  function handleTitleChange(value) {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: slugTouched ? prev.slug : slugify(value),
    }))
  }

  const previewHtml = useMemo(() => marked.parse(form.markdown || ''), [form.markdown])

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      markdown: form.markdown,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      categories: form.categories.split(',').map((c) => c.trim()).filter(Boolean),
      published: form.published,
    }

    try {
      const res = await fetch(
        isEditing ? `/api/admin/posts/${editingSlug}` : '/api/admin/posts',
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      )
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(data.error || 'Could not save post.')
        setSaving(false)
        return
      }

      navigate('/admin', { replace: true })
    } catch {
      setError('Something went wrong — please try again.')
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="font-mono text-sm text-ink-soft">Loading…</p>
  }

  return (
    <div>
      <Helmet>
        <title>{isEditing ? 'Edit post' : 'New post'} — Rubisco Admin</title>
      </Helmet>
      <h1 className="font-display text-2xl font-medium text-ink">
        {isEditing ? `Edit: ${form.title}` : 'New post'}
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="post-title" className="font-mono text-xs uppercase tracking-widest text-ink-soft">Title</label>
            <input
              id="post-title"
              required
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="mt-2 w-full border border-line bg-milk px-4 py-3 text-sm text-ink outline-none focus:border-leaf"
            />
          </div>
          <div>
            <label htmlFor="post-slug" className="font-mono text-xs uppercase tracking-widest text-ink-soft">Slug</label>
            <input
              id="post-slug"
              required
              value={form.slug}
              disabled={isEditing}
              onChange={(e) => {
                setSlugTouched(true)
                setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }))
              }}
              className="mt-2 w-full border border-line bg-milk px-4 py-3 text-sm text-ink outline-none focus:border-leaf disabled:opacity-60"
            />
            {isEditing && (
              <p className="mt-1 text-xs text-ink-soft">Slug can't be changed after a post is created.</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="post-excerpt" className="font-mono text-xs uppercase tracking-widest text-ink-soft">Excerpt</label>
          <textarea
            id="post-excerpt"
            required
            rows={2}
            value={form.excerpt}
            onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
            className="mt-2 w-full border border-line bg-milk px-4 py-3 text-sm text-ink outline-none focus:border-leaf"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="post-tags" className="font-mono text-xs uppercase tracking-widest text-ink-soft">
              Tags <span className="normal-case text-ink-soft/70">(comma separated)</span>
            </label>
            <input
              id="post-tags"
              value={form.tags}
              onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
              placeholder="offline-first, hardware"
              className="mt-2 w-full border border-line bg-milk px-4 py-3 text-sm text-ink outline-none focus:border-leaf"
            />
          </div>
          <div>
            <label htmlFor="post-categories" className="font-mono text-xs uppercase tracking-widest text-ink-soft">
              Categories <span className="normal-case text-ink-soft/70">(comma separated)</span>
            </label>
            <input
              id="post-categories"
              value={form.categories}
              onChange={(e) => setForm((prev) => ({ ...prev, categories: e.target.value }))}
              placeholder="Engineering"
              className="mt-2 w-full border border-line bg-milk px-4 py-3 text-sm text-ink outline-none focus:border-leaf"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="post-markdown" className="font-mono text-xs uppercase tracking-widest text-ink-soft">
              Body (Markdown)
            </label>
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              className="font-mono text-xs text-leaf hover:underline"
            >
              {showPreview ? 'Hide preview' : 'Show preview'}
            </button>
          </div>
          <div className={`mt-2 grid gap-4 ${showPreview ? 'sm:grid-cols-2' : ''}`}>
            <textarea
              id="post-markdown"
              required
              rows={16}
              value={form.markdown}
              onChange={(e) => setForm((prev) => ({ ...prev, markdown: e.target.value }))}
              className="w-full border border-line bg-milk px-4 py-3 font-mono text-sm text-ink outline-none focus:border-leaf"
            />
            {showPreview && (
              <div
                className="prose-rubisco border border-line bg-milk px-4 py-3"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            )}
          </div>
        </div>

        <label className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-ink-soft">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm((prev) => ({ ...prev, published: e.target.checked }))}
            className="h-4 w-4 accent-leaf"
          />
          Published
        </label>
        <p className="text-xs text-ink-soft">
          Publishing commits this file to <code>src/content/posts/</code> and triggers a site
          rebuild — it takes a minute or two to appear on the blog. Leaving this unchecked saves
          it as a draft, stored separately from the live site.
        </p>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 border border-ink bg-ink px-6 py-3 font-mono text-sm text-milk transition-colors hover:border-leaf hover:bg-leaf disabled:cursor-wait disabled:opacity-60"
          >
            {saving ? 'Saving…' : isEditing ? 'Save changes' : 'Create post'}
          </button>
          {error && <p role="alert" className="text-sm text-soil">{error}</p>}
        </div>
      </form>
    </div>
  )
}
