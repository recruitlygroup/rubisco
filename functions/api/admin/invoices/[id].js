import { isAuthenticated } from '../../../_lib/session.js'

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

export async function onRequestGet({ request, env, params }) {
  if (!(await isAuthenticated(request, env))) return jsonResponse({ error: 'Not authenticated.' }, 401)

  const invoice = await env.DB.prepare('SELECT * FROM invoices WHERE id = ?').bind(params.id).first()
  if (!invoice) return jsonResponse({ error: 'Invoice not found.' }, 404)

  const { results: items } = await env.DB
    .prepare('SELECT * FROM invoice_items WHERE invoice_id = ? ORDER BY id')
    .bind(params.id)
    .all()

  const { results: creditNotes } = await env.DB
    .prepare('SELECT * FROM credit_notes WHERE invoice_id = ? ORDER BY id')
    .bind(params.id)
    .all()

  return jsonResponse({ invoice, items, credit_notes: creditNotes })
}

// IRD RULE: issued invoices are immutable. There is deliberately no
// onRequestPut here — editing means issuing a Credit Note instead (see
// invoices/[id]/void.js). These handlers exist only to return a clear
// 405 instead of a generic Cloudflare "method not allowed" HTML page, so
// the admin UI (or an accidental script) gets an unambiguous reason.
export async function onRequestPut() {
  return jsonResponse({ error: 'Invoices cannot be edited once issued (IRD compliance). Issue a credit note instead.' }, 405)
}

export async function onRequestDelete() {
  return jsonResponse({ error: 'Invoices cannot be deleted once issued (IRD compliance). Issue a credit note instead.' }, 405)
}
