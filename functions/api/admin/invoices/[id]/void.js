import { isAuthenticated } from '../../../../_lib/session.js'

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

export async function onRequestPost({ request, env, params }) {
  if (!(await isAuthenticated(request, env))) return jsonResponse({ error: 'Not authenticated.' }, 401)

  let body
  try {
    body = await request.json()
  } catch {
    return jsonResponse({ error: 'Invalid request body.' }, 400)
  }

  const { reason } = body
  if (!reason || !reason.trim()) {
    return jsonResponse({ error: 'A reason is required for every credit note (IRD audit trail).' }, 400)
  }

  const invoice = await env.DB.prepare('SELECT * FROM invoices WHERE id = ?').bind(params.id).first()
  if (!invoice) return jsonResponse({ error: 'Invoice not found.' }, 404)
  if (invoice.status === 'VOIDED') return jsonResponse({ error: 'Invoice is already voided.' }, 409)

  const creditNoteNumber = `CN-${invoice.invoice_number}`

  try {
    await env.DB.batch([
      env.DB.prepare(
        'INSERT INTO credit_notes (credit_note_number, invoice_id, reason, refund_amount, currency, created_by) VALUES (?,?,?,?,?,?)',
      ).bind(creditNoteNumber, invoice.id, reason.trim(), invoice.grand_total, invoice.currency, 'admin'),
      env.DB.prepare('UPDATE invoices SET status = ? WHERE id = ?').bind('VOIDED', invoice.id),
    ])
    return jsonResponse({ ok: true, credit_note_number: creditNoteNumber })
  } catch (err) {
    return jsonResponse({ error: 'Could not void invoice.', detail: String(err) }, 500)
  }
}
