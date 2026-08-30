import { createSessionCookie, sha256Hex, timingSafeEqualStrings } from '../../_lib/session.js'

function jsonResponse(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...headers },
  })
}

export async function onRequestPost({ request, env }) {
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD_HASH || !env.SESSION_SECRET) {
    return jsonResponse({ error: 'Admin login is not configured yet.' }, 500)
  }

  let body
  try {
    body = await request.json()
  } catch {
    return jsonResponse({ error: 'Invalid request.' }, 400)
  }

  const { email, password } = body
  if (typeof email !== 'string' || typeof password !== 'string') {
    return jsonResponse({ error: 'Email and password are required.' }, 400)
  }

  const emailMatches = timingSafeEqualStrings(
    email.trim().toLowerCase(),
    env.ADMIN_EMAIL.trim().toLowerCase(),
  )
  const passwordHash = await sha256Hex(password)
  const passwordMatches = timingSafeEqualStrings(passwordHash, env.ADMIN_PASSWORD_HASH.toLowerCase())

  if (!emailMatches || !passwordMatches) {
    return jsonResponse({ error: 'Incorrect email or password.' }, 401)
  }

  const cookie = await createSessionCookie(env)
  return jsonResponse({ ok: true }, 200, { 'set-cookie': cookie })
}
