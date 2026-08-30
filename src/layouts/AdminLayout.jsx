import { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export default function AdminLayout() {
  const [status, setStatus] = useState('checking') // checking | authed | unauthed
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/session')
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return
        if (data.authenticated) {
          setStatus('authed')
        } else {
          setStatus('unauthed')
          navigate('/admin/login', { replace: true })
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatus('unauthed')
          navigate('/admin/login', { replace: true })
        }
      })
    return () => {
      cancelled = true
    }
  }, [navigate])

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    navigate('/admin/login', { replace: true })
  }

  if (status !== 'authed') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <p className="font-mono text-sm text-ink-soft">Checking session…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <header className="border-b border-line/70 bg-milk">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 sm:px-10">
          <Link to="/admin" className="font-mono text-sm uppercase tracking-widest text-ink">
            Rubisco Admin
          </Link>
          <nav className="flex flex-wrap items-center gap-6 font-mono text-xs uppercase tracking-widest">
            <Link to="/admin" className="text-ink-soft hover:text-leaf">
              Posts
            </Link>
            <Link to="/admin/new" className="text-ink-soft hover:text-leaf">
              New post
            </Link>
            <span className="h-4 w-px bg-line" aria-hidden="true" />
            <Link to="/admin/invoices" className="text-ink-soft hover:text-leaf">
              All invoices
            </Link>
            <Link to="/admin/invoices/new" className="text-ink-soft hover:text-leaf">
              Create invoice
            </Link>
            <Link to="/admin/invoices/audit" className="text-ink-soft hover:text-leaf">
              Audit reports
            </Link>
            <span className="h-4 w-px bg-line" aria-hidden="true" />
            <button type="button" onClick={handleLogout} className="text-ink-soft hover:text-leaf">
              Log out
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10 sm:px-10">
        <Outlet />
      </main>
    </div>
  )
}
