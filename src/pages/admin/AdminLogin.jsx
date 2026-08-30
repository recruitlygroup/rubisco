import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('idle') // idle | submitting | error
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('submitting')
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(data.error || 'Login failed.')
        setStatus('error')
        return
      }

      navigate('/admin', { replace: true })
    } catch {
      setError('Something went wrong — please try again.')
      setStatus('error')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6">
      <Helmet>
        <title>Admin login — Rubisco Tech</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="w-full max-w-sm">
        <p className="font-mono text-xs uppercase tracking-widest text-leaf">Rubisco Admin</p>
        <h1 className="mt-2 font-display text-2xl font-medium text-ink">Sign in</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="font-mono text-xs uppercase tracking-widest text-ink-soft">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full border border-line bg-milk px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-leaf"
            />
          </div>
          <div>
            <label htmlFor="password" className="font-mono text-xs uppercase tracking-widest text-ink-soft">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full border border-line bg-milk px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-leaf"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="inline-flex w-full items-center justify-center gap-2 border border-ink bg-ink px-6 py-3 font-mono text-sm text-milk transition-colors hover:border-leaf hover:bg-leaf disabled:cursor-wait disabled:opacity-60"
          >
            {status === 'submitting' ? 'Signing in…' : 'Sign in'}
          </button>

          {status === 'error' && <p role="alert" className="text-sm text-soil">{error}</p>}
        </form>
      </div>
    </div>
  )
}
