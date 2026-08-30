import { useState } from 'react'
import Seo from '../components/Seo.jsx'

const fields = [
  { name: 'name', label: 'Name', type: 'text', autoComplete: 'name' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'organisation', label: 'Farm / organisation', type: 'text', autoComplete: 'organization' },
]

const initialState = { name: '', email: '', organisation: '', message: '', website: '' }

export default function Contact() {
  const [values, setValues] = useState(initialState)
  const [status, setStatus] = useState('idle') // idle | submitting | sent | error
  const [errorMessage, setErrorMessage] = useState('')
  // Timestamp the form became visible — used server-side as a lightweight
  // anti-spam signal (bots tend to submit implausibly fast).
  const [formLoadedAt] = useState(() => Date.now())

  function handleChange(event) {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          formLoadedAt,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        setErrorMessage(data.error || 'Something went wrong — please try again.')
        setStatus('error')
        return
      }

      setStatus('sent')
      setValues(initialState)
    } catch {
      setErrorMessage('Something went wrong — please try again.')
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <>
        <Seo title="Contact" description="Tell us about your farm or operation and what isn't working right now." path="/contact" />
        <section className="mx-auto max-w-2xl px-6 py-24 text-center sm:px-10">
          <p className="font-mono text-xs uppercase tracking-widest text-leaf">Contact</p>
          <h1 className="mt-3 font-display text-3xl font-medium text-ink">
            Message received.
          </h1>
          <p className="mt-4 text-ink-soft">
            We reply to every message ourselves, usually within a couple of
            working days. Thanks for reaching out.
          </p>
        </section>
      </>
    )
  }

  return (
    <>
      <Seo title="Contact" description="Tell us about your farm or operation and what isn't working right now." path="/contact" />
      <section className="mx-auto max-w-5xl px-6 py-20 sm:px-10">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-leaf">Contact</p>
          <h1 className="mt-3 font-display text-3xl font-medium text-ink sm:text-4xl">
            Let&rsquo;s talk
          </h1>
          <p className="mt-4 max-w-sm leading-relaxed text-ink-soft">
            Tell us about the farm or operation and what is not working right
            now. If it is a good fit, we will reply with next steps, not a
            sales pitch.
          </p>

          <dl className="mt-10 space-y-6 border-t border-line/70 pt-8 text-sm">
            <div>
              <dt className="font-mono text-xs uppercase tracking-widest text-ink-soft">
                Email
              </dt>
              <dd className="mt-1">
                <a href="mailto:hello@rubisco.tech" className="text-ink hover:text-leaf">
                  hello@rubisco.tech
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-widest text-ink-soft">
                Based in
              </dt>
              <dd className="mt-1 text-ink">Sindhuli, Nepal</dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-widest text-ink-soft">
                Registered as
              </dt>
              <dd className="mt-1 text-ink">Rubisco Tech Pvt. Ltd., Bhaktapur</dd>
            </div>
          </dl>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Honeypot field — hidden from sighted users and screen readers,
              but visible to most bots that blindly fill in every field. */}
          <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
            <label htmlFor="website">Leave this field empty</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={values.website}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {fields.slice(0, 2).map((field) => (
              <FormField
                key={field.name}
                {...field}
                value={values[field.name]}
                onChange={handleChange}
              />
            ))}
          </div>

          <FormField
            {...fields[2]}
            value={values.organisation}
            onChange={handleChange}
          />

          <div>
            <label
              htmlFor="message"
              className="font-mono text-xs uppercase tracking-widest text-ink-soft"
            >
              What are you working on?
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              value={values.message}
              onChange={handleChange}
              className="mt-2 w-full border border-line bg-milk px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-leaf"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="inline-flex items-center gap-2 border border-ink bg-ink px-6 py-3 font-mono text-sm text-milk transition-colors hover:border-leaf hover:bg-leaf disabled:cursor-wait disabled:opacity-60"
          >
            {status === 'submitting' ? 'Sending…' : 'Send message'}
            <span aria-hidden="true">&rarr;</span>
          </button>

          {status === 'error' && (
            <p className="text-sm text-soil">
              {errorMessage || 'Something went wrong.'} You can also email us directly at{' '}
              <a href="mailto:hello@rubisco.tech" className="underline">
                hello@rubisco.tech
              </a>
              .
            </p>
          )}
        </form>
      </div>
    </section>
    </>
  )
}

function FormField({ name, label, type, autoComplete, value, onChange }) {
  return (
    <div>
      <label htmlFor={name} className="font-mono text-xs uppercase tracking-widest text-ink-soft">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={name !== 'organisation'}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        className="mt-2 w-full border border-line bg-milk px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-leaf"
      />
    </div>
  )
}
