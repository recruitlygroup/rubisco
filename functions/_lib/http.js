// Shared helpers for admin API routes.
//
// withErrorHandling() guarantees that every request ends in a JSON response,
// even when something throws outside a route's own try/catch (auth check,
// missing env vars, GitHub fetch failures, etc.). Without it, an uncaught
// exception makes the platform answer with its own non-JSON error page, which
// the dashboard can only report as "Server returned an unexpected response".

export function jsonResponse(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...headers },
  })
}

export class HttpError extends Error {
  constructor(status, message, detail) {
    super(message)
    this.status = status
    this.detail = detail
  }
}

const GITHUB_ENV = ['GITHUB_TOKEN', 'GITHUB_OWNER', 'GITHUB_REPO', 'GITHUB_BRANCH']

/** Throws a readable 500 listing which variables are missing. */
export function requireEnv(env, names = GITHUB_ENV) {
  const missing = names.filter((n) => !env[n] || !String(env[n]).trim())
  if (missing.length) {
    throw new HttpError(500, `Server is missing environment variables: ${missing.join(', ')}.`)
  }
}

export function withErrorHandling(handler) {
  return async (context) => {
    try {
      return await handler(context)
    } catch (err) {
      console.error(`${context.request.method} ${new URL(context.request.url).pathname} failed:`, err)
      if (err instanceof HttpError) {
        return jsonResponse({ error: err.message, detail: err.detail }, err.status)
      }
      // Upstream (GitHub) problems -> 502; anything else -> 500. Always JSON.
      const upstream = err?.name === 'GitHubError'
      return jsonResponse(
        {
          error: upstream ? 'Could not reach GitHub.' : 'Unexpected server error.',
          detail: String(err?.message || err),
        },
        upstream ? 502 : 500,
      )
    }
  }
}
