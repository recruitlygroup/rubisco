import { isAuthenticated } from '../../../../_lib/session.js'

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

// Marking PAID is a status flag, not an edit to any financial field on the
// invoice (amounts, dates, and invoice_number never change) - so it's
// compatible with the immutability rule, unlike a general-purpose PUT.
export async function onRequestPost({ request, env, params }) {
  if (!(await isAuthenticated(request, env))) return jsonResponse({ error: 'Not authenticated.' }, 401)

  const invoice = await env.DB.prepare('SELECT * FROM invoices WHERE id = ?').bind(params.id).first()
  if (!invoice) return jsonResponse({ error: 'Invoice not found.' }, 404)
  if (invoice.status === 'VOIDED') return jsonResponse({ error: 'Cannot mark a voided invoice as paid.' }, 409)

  await env.DB.prepare('UPDATE invoices SET status = ? WHERE id = ?').bind('PAID', invoice.id).run()
  return jsonResponse({ ok: true })
}
