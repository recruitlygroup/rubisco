// Signed, HttpOnly session cookie for the /admin dashboard. There's a
// single admin user (credentials come from environment variables, not
// hardcoded anywhere), so this is intentionally simple: a cookie holding
// an expiry timestamp plus an HMAC-SHA256 signature over that timestamp,
// keyed by a secret only Cloudflare knows.

const COOKIE_NAME = 'rubisco_admin_session'
const SESSION_TTL_MS = 12 * 60 * 60 * 1000 // 12 hours

async function hmac(secret, message) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message))
  return [...new Uint8Array(signature)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

export async function sha256Hex(input) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input))
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function createSessionCookie(env) {
  const expiry = Date.now() + SESSION_TTL_MS
  const signature = await hmac(env.SESSION_SECRET, String(expiry))
  const value = `${expiry}.${signature}`
  const secure = env.ENVIRONMENT === 'development' ? '' : ' Secure;'
  return `${COOKIE_NAME}=${value}; HttpOnly;${secure} SameSite=Strict; Path=/; Max-Age=${SESSION_TTL_MS / 1000}`
}

export function clearSessionCookie(env) {
  const secure = env.ENVIRONMENT === 'development' ? '' : ' Secure;'
  return `${COOKIE_NAME}=; HttpOnly;${secure} SameSite=Strict; Path=/; Max-Age=0`
}

function parseCookies(header) {
  const cookies = {}
  if (!header) return cookies
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=')
    cookies[key] = rest.join('=')
  }
  return cookies
}

export async function isAuthenticated(request, env) {
  const cookies = parseCookies(request.headers.get('cookie'))
  const value = cookies[COOKIE_NAME]
  if (!value) return false

  const [expiryStr, signature] = value.split('.')
  const expiry = Number(expiryStr)
  if (!expiry || !signature || Date.now() > expiry) return false

  const expected = await hmac(env.SESSION_SECRET, String(expiry))
  return timingSafeEqual(expected, signature)
}

export function timingSafeEqualStrings(a, b) {
  return timingSafeEqual(a, b)
}
