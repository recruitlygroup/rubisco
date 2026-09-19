import { useEffect, useId, useRef, useState } from 'react'
import Button from '../ui/Button.jsx'
import { SITE_URL, CONTACT_EMAIL } from '../../lib/site.js'

/**
 * Shared enquiry form for the landing pages (candidate, employer, partner).
 *
 * It posts to the EXISTING /api/contact Cloudflare function, so no backend
 * change is needed. That function only knows name / email / organisation /
 * message, so the extra fields (destination, roles, herd size...) are folded
 * into the message as labelled lines, prefixed with the enquiry type, e.g.
 *
 *   [Employer enquiry]
 *   Farm location: New Zealand
 *   Roles and number of positions: 2 milkers
 *
 *   Sent from: https://rubisco.com.np/hire-herd-managers
 *
 * `config` shape (see src/content/seoPages.js):
 *   { intent, heading, intro, submitLabel, messageLabel, messageRequired,
 *     showOrganisation, fields: [{ name, label, type: 'text' | 'select',
 *     options?, required?, placeholder?, autoComplete?, default? }] }
 *
 * Render with a `key` if `config` can change while the component stays
 * mounted (e.g. moving between destination pages), so state resets.
 */
const INPUT =
  'mt-2 w-full border border-line bg-milk px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-leaf'
const LABEL = 'font-mono text-xs uppercase tracking-widest text-ink-soft'

function initialValues(config) {
  const values = { name: '', email: '', organisation: '', message: '', website: '' }
  for (const field of config.fields) values[field.name] = field.default || ''
  return values
}

export default function LeadForm({ config, sourcePath }) {
  const uid = useId()
  const [values, setValues] = useState(() => initialValues(config))
  const [status, setStatus] = useState('idle') // idle | submitting | sent | error
  const [errorMessage, setErrorMessage] = useState('')
  // Used server-side as a lightweight anti-spam signal (bots submit too fast).
  const [formLoadedAt] = useState(() => Date.now())
  const sentHeadingRef = useRef(null)

  useEffect(() => {
    if (status === 'sent') sentHeadingRef.current?.focus()
  }, [status])

  function handleChange(event) {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  function buildMessage() {
    const lines = [`[${config.intent}]`]
    for (const field of config.fields) {
      const value = (values[field.name] || '').trim()
      if (value) lines.push(`${field.label}: ${value}`)
    }
    const message = values.message.trim()
    if (message) lines.push('', `${config.messageLabel}`, message)
    lines.push('', `Sent from: ${SITE_URL}${sourcePath}`)
    return lines.join('\n')
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
          name: values.name,
          email: values.email,
          organisation: config.showOrganisation ? values.organisation : '',
          message: buildMessage(),
          website: values.website,
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
      setValues(initialValues(config))
    } catch {
      setErrorMessage('Something went wrong — please try again.')
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <section id="enquiry" className="border-t border-line/70 bg-milk">
        <div className="mx-auto max-w-2xl px-6 py-20 text-center sm:px-10">
          <h2
            ref={sentHeadingRef}
            tabIndex={-1}
            className="font-display text-3xl font-medium text-ink outline-none"
          >
            Message received.
          </h2>
          <p className="mt-4 text-ink-soft">
            We reply to every message ourselves, usually within a couple of working days. Thanks
            for reaching out.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section id="enquiry" className="border-t border-line/70 bg-milk">
      <div className="mx-auto grid max-w-5xl gap-12 px-6 py-20 sm:px-10 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-leaf">Get in touch</p>
          <h2 className="mt-3 font-display text-2xl font-medium text-ink sm:text-3xl">
            {config.heading}
          </h2>
          <p className="mt-4 max-w-sm leading-relaxed text-ink-soft">{config.intro}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Honeypot: invisible to people and screen readers, tempting to bots. */}
          <div
            className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
            aria-hidden="true"
          >
            <label htmlFor={`${uid}-website`}>Leave this field empty</label>
            <input
              id={`${uid}-website`}
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={values.website}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor={`${uid}-name`} className={LABEL}>
                Name
              </label>
              <input
                id={`${uid}-name`}
                name="name"
                type="text"
                required
                maxLength={200}
                autoComplete="name"
                value={values.name}
                onChange={handleChange}
                className={INPUT}
              />
            </div>
            <div>
              <label htmlFor={`${uid}-email`} className={LABEL}>
                Email
              </label>
              <input
                id={`${uid}-email`}
                name="email"
                type="email"
                required
                maxLength={320}
                autoComplete="email"
                value={values.email}
                onChange={handleChange}
                className={INPUT}
              />
            </div>
          </div>

          {config.showOrganisation && (
            <div>
              <label htmlFor={`${uid}-organisation`} className={LABEL}>
                Farm / organisation
              </label>
              <input
                id={`${uid}-organisation`}
                name="organisation"
                type="text"
                maxLength={200}
                autoComplete="organization"
                value={values.organisation}
                onChange={handleChange}
                className={INPUT}
              />
            </div>
          )}

          {config.fields.map((field) => (
            <div key={field.name}>
              <label htmlFor={`${uid}-${field.name}`} className={LABEL}>
                {field.label}
              </label>
              {field.type === 'select' ? (
                <select
                  id={`${uid}-${field.name}`}
                  name={field.name}
                  required={field.required}
                  value={values[field.name]}
                  onChange={handleChange}
                  className={INPUT}
                >
                  <option value="" disabled>
                    Select…
                  </option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={`${uid}-${field.name}`}
                  name={field.name}
                  type="text"
                  required={field.required}
                  maxLength={200}
                  placeholder={field.placeholder}
                  autoComplete={field.autoComplete}
                  value={values[field.name]}
                  onChange={handleChange}
                  className={INPUT}
                />
              )}
            </div>
          ))}

          <div>
            <label htmlFor={`${uid}-message`} className={LABEL}>
              {config.messageLabel}
            </label>
            <textarea
              id={`${uid}-message`}
              name="message"
              required={config.messageRequired}
              rows={5}
              maxLength={2000}
              value={values.message}
              onChange={handleChange}
              className={INPUT}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={status === 'submitting'}
            arrow={status !== 'submitting'}
          >
            {status === 'submitting' ? 'Sending…' : config.submitLabel}
          </Button>

          <div aria-live="polite">
            {status === 'error' && (
              <p role="alert" className="text-sm text-soil">
                {errorMessage || 'Something went wrong.'} You can also email us directly at{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}
