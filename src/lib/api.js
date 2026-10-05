// Small fetch wrapper for the admin dashboard.
//
// - Always resolves to parsed JSON or throws an Error with a message that is
//   safe to show in the UI (never a raw JSON parse failure).
// - Turns gateway-level failures (502/503/504 with an HTML/empty body) into an
//   actionable message instead of "unexpected response".
// - Retries idempotent GETs once on gateway errors / network failures.

export class ApiError extends Error {
  constructor(message, status, detail) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.detail = detail
  }
}

const GATEWAY_MESSAGES = {
  502: 'The server could not reach its upstream service (HTTP 502). Check the Cloudflare Functions logs and the GITHUB_* environment variables, then retry.',
  503: 'The server is temporarily unavailable (HTTP 503). Please retry in a moment.',
  504: 'The server timed out (HTTP 504). Please retry in a moment.',
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function attempt(url, options) {
  let res
  try {
    res = await fetch(url, { credentials: 'same-origin', ...options })
  } catch {
    throw new ApiError('Network error — check your connection and try again.', 0)
  }

  let data = null
  const text = await res.text().catch(() => '')
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = null // HTML error page from a gateway/proxy, or an SPA fallback
    }
  }

  if (!res.ok || (data && data.error)) {
    const message =
      data?.error ||
      GATEWAY_MESSAGES[res.status] ||
      `Server returned an unexpected response (HTTP ${res.status}).`
    throw new ApiError(message, res.status, data?.detail)
  }
  if (data === null) {
    throw new ApiError(
      `Server returned a non-JSON response (HTTP ${res.status}). Is /api being served by Cloudflare Functions (use \`wrangler pages dev\` locally)?`,
      res.status,
    )
  }
  return data
}

export async function apiFetch(url, options = {}) {
  const method = (options.method || 'GET').toUpperCase()
  const retryable = method === 'GET'
  try {
    return await attempt(url, options)
  } catch (err) {
    const transient = err.status === 0 || [502, 503, 504].includes(err.status)
    if (retryable && transient) {
      await sleep(600)
      return attempt(url, options)
    }
    throw err
  }
}

export function jsonBody(payload) {
  return {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }
}
