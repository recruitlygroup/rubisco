// Cloudflare Pages Function — POST /api/contact
//
// Receives the contact form submission from src/pages/Contact.jsx, validates
// it server-side, and sends it as an email via Resend (https://resend.com).
//
// Required environment variables (set in Cloudflare Pages dashboard under
// Settings → Environment variables, or via `wrangler pages secret put`):
//
//   RESEND_API_KEY   (secret)  — API key from resend.com
//   CONTACT_TO_EMAIL (var)     — where inquiries should land, e.g. hello@rubisco.tech
//   CONTACT_FROM_EMAIL (var)   — verified sender, e.g. contact@rubisco.tech
//                                  (must be on a domain you've verified in Resend;
//                                  use "onboarding@resend.dev" for quick testing only)
//
// Optional rate limiting: if you've added a Workers Rate Limiting binding
// named CONTACT_RATE_LIMITER to this Pages project (see wrangler.toml /
// README for setup), it will be used automatically. If it's not bound,
// the function still runs fine — it just skips that extra layer and relies
// on the honeypot + minimum-fill-time checks below.

const MAX_FIELD_LENGTH = {
  name: 200,
  email: 320,
  organisation: 200,
  message: 5000,
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function onRequestPost({ request, env }) {
  let payload
  try {
    payload = await request.json()
  } catch {
    return jsonResponse({ error: 'Invalid request body.' }, 400)
  }

  const { name, email, organisation = '', message, website, formLoadedAt } = payload

  // --- Honeypot -----------------------------------------------------------
  // `website` is a field that's invisible to real users but bots tend to
  // fill in. If it has anything in it, silently pretend success so the bot
  // doesn't learn to adapt.
  if (typeof website === 'string' && website.trim() !== '') {
    return jsonResponse({ ok: true })
  }

  // --- Minimum fill time ----------------------------------------------------
  // Real humans take at least a couple of seconds to fill out a form.
  // Submissions faster than that are almost always scripted.
  if (typeof formLoadedAt === 'number') {
    const elapsed = Date.now() - formLoadedAt
    if (elapsed >= 0 && elapsed < 1500) {
      return jsonResponse({ error: 'Please try again.' }, 400)
    }
  }

  // --- Basic validation -----------------------------------------------------
  const errors = []
  if (typeof name !== 'string' || name.trim().length < 1) errors.push('name')
  if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) errors.push('email')
  if (typeof message !== 'string' || message.trim().length < 1) errors.push('message')

  for (const [field, max] of Object.entries(MAX_FIELD_LENGTH)) {
    const value = payload[field]
    if (typeof value === 'string' && value.length > max) errors.push(field)
  }

  if (errors.length > 0) {
    return jsonResponse({ error: 'Please check the highlighted fields.', fields: errors }, 400)
  }

  // --- Optional rate limiting (Workers Rate Limiting binding) --------------
  if (env.CONTACT_RATE_LIMITER) {
    try {
      const ip = request.headers.get('cf-connecting-ip') || 'unknown'
      const { success } = await env.CONTACT_RATE_LIMITER.limit({ key: ip })
      if (!success) {
        return jsonResponse({ error: 'Too many requests — please try again in a bit.' }, 429)
      }
    } catch {
      // If the binding misbehaves, don't block legitimate submissions on it.
    }
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL || !env.CONTACT_FROM_EMAIL) {
    return jsonResponse(
      { error: 'Contact form is not fully configured yet. Please email us directly.' },
      500,
    )
  }

  const cleanName = name.trim()
  const cleanEmail = email.trim()
  const cleanOrg = typeof organisation === 'string' ? organisation.trim() : ''
  const cleanMessage = message.trim()

  const html = `
    <div style="font-family: sans-serif; font-size: 14px; color: #16241b;">
      <p><strong>Name:</strong> ${escapeHtml(cleanName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(cleanEmail)}</p>
      ${cleanOrg ? `<p><strong>Farm / organisation:</strong> ${escapeHtml(cleanOrg)}</p>` : ''}
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap;">${escapeHtml(cleanMessage)}</p>
    </div>
  `.trim()

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Rubisco Tech website <${env.CONTACT_FROM_EMAIL}>`,
        to: [env.CONTACT_TO_EMAIL],
        reply_to: cleanEmail,
        subject: `New contact form message from ${cleanName}`,
        html,
      }),
    })

    if (!resendResponse.ok) {
      const detail = await resendResponse.text().catch(() => '')
      console.error('Resend API error:', resendResponse.status, detail)
      return jsonResponse({ error: 'Could not send your message. Please try again.' }, 502)
    }
  } catch (err) {
    console.error('Failed to reach Resend:', err)
    return jsonResponse({ error: 'Could not send your message. Please try again.' }, 502)
  }

  return jsonResponse({ ok: true })
}

// Reject any method other than POST.
export async function onRequestGet() {
  return jsonResponse({ error: 'Method not allowed.' }, 405)
}
