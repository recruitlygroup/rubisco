import { isAuthenticated } from '../../../_lib/session.js'
import { adDateToBs, fiscalYearFromBsDate } from '../../../../src/lib/nepaliDate.js'
import { computeInvoiceTotals } from '../../../../src/lib/invoiceCalc.js'

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

/**
 * Atomically claim the next sequence number for a fiscal year and format
 * the invoice number as AGRI-83-84-0001. Uses a single UPDATE ... RETURNING
 * statement: D1/SQLite serializes writes to a row, so two concurrent
 * requests can't ever be handed the same number, unlike "read last_number,
 * add 1, write it back" done as separate steps.
 */
async function claimInvoiceNumber(db, fiscalYear, env) {
  const prefix = env.INVOICE_PREFIX || 'AGRI'

  await db
    .prepare('INSERT INTO invoice_counters (fiscal_year, last_number) VALUES (?, 0) ON CONFLICT(fiscal_year) DO NOTHING')
    .bind(fiscalYear)
    .run()

  const { results } = await db
    .prepare('UPDATE invoice_counters SET last_number = last_number + 1 WHERE fiscal_year = ? RETURNING last_number')
    .bind(fiscalYear)
    .all()

  const sequence = results[0].last_number
  const padded = String(sequence).padStart(4, '0')
  return `${prefix}-${fiscalYear}-${padded}`
}

export async function onRequestGet({ request, env }) {
  if (!(await isAuthenticated(request, env))) return jsonResponse({ error: 'Not authenticated.' }, 401)

  const url = new URL(request.url)
  const fiscalYear = url.searchParams.get('fiscal_year')
  const status = url.searchParams.get('status')

  let query = 'SELECT * FROM invoices'
  const conditions = []
  const params = []
  if (fiscalYear) {
    conditions.push('fiscal_year = ?')
    params.push(fiscalYear)
  }
  if (status) {
    conditions.push('status = ?')
    params.push(status)
  }
  if (conditions.length) query += ` WHERE ${conditions.join(' AND ')}`
  query += ' ORDER BY id DESC'

  try {
    const { results } = await env.DB.prepare(query).bind(...params).all()
    return jsonResponse({ invoices: results })
  } catch (err) {
    return jsonResponse({ error: 'Could not load invoices.', detail: String(err) }, 500)
  }
}

export async function onRequestPost({ request, env }) {
  if (!(await isAuthenticated(request, env))) return jsonResponse({ error: 'Not authenticated.' }, 401)

  let body
  try {
    body = await request.json()
  } catch {
    return jsonResponse({ error: 'Invalid request body.' }, 400)
  }

  const {
    client_name,
    client_type, // 'LOCAL' | 'FOREIGN'
    client_address = '',
    client_pan_or_tax_id = '',
    client_vat_registered = false,
    currency,
    exchange_rate_npr = 1,
    items = [],
    notes = '',
  } = body

  // --- Validation -----------------------------------------------------
  if (!client_name || !client_name.trim()) return jsonResponse({ error: 'Client name is required.' }, 400)
  if (!['LOCAL', 'FOREIGN'].includes(client_type)) {
    return jsonResponse({ error: 'client_type must be LOCAL or FOREIGN.' }, 400)
  }
  if (client_type === 'LOCAL' && currency !== 'NPR') {
    return jsonResponse({ error: 'Local invoices must be denominated in NPR.' }, 400)
  }
  if (client_type === 'FOREIGN' && currency === 'NPR') {
    return jsonResponse({ error: 'Foreign/export invoices must be in a foreign currency (USD/EUR).' }, 400)
  }
  if (client_type === 'FOREIGN' && (!exchange_rate_npr || exchange_rate_npr <= 0)) {
    return jsonResponse({ error: 'A positive NPR exchange rate is required for foreign invoices (needed for the Annexure-13 sales book, which is always in NPR).' }, 400)
  }
  if (!Array.isArray(items) || items.length === 0) {
    return jsonResponse({ error: 'At least one line item is required.' }, 400)
  }
  for (const item of items) {
    if (!item.description || !(Number(item.quantity) > 0) || !(Number(item.unit_price) >= 0)) {
      return jsonResponse({ error: 'Every line item needs a description, a positive quantity, and a non-negative unit price.' }, 400)
    }
  }

  // --- Recompute money server-side. Never trust client-submitted totals
  // for a document that IRD may audit. --------------------------------
  const { subtotal, vatRate, vatAmount, grandTotal, taxExemptReason } = computeInvoiceTotals(
    items,
    client_type,
    !!client_vat_registered,
  )
  const rate = client_type === 'FOREIGN' ? Number(exchange_rate_npr) : 1
  const subtotalNpr = Math.round(subtotal * rate * 100) / 100
  const vatAmountNpr = Math.round(vatAmount * rate * 100) / 100
  const grandTotalNpr = Math.round(grandTotal * rate * 100) / 100

  const issueDateAd = new Date().toISOString().slice(0, 10)
  let issueDateBs
  try {
    issueDateBs = adDateToBs(issueDateAd)
  } catch (err) {
    return jsonResponse({ error: 'Could not convert issue date to Bikram Sambat.', detail: String(err) }, 500)
  }
  const fiscalYear = fiscalYearFromBsDate(issueDateBs)

  try {
    const invoiceNumber = await claimInvoiceNumber(env.DB, fiscalYear, env)

    const insertInvoice = env.DB.prepare(
      `INSERT INTO invoices (
        invoice_number, fiscal_year, client_name, client_type, client_address,
        client_pan_or_tax_id, client_vat_registered, currency, exchange_rate_npr,
        subtotal, vat_rate, vat_amount, grand_total,
        subtotal_npr, vat_amount_npr, grand_total_npr,
        tax_exempt_reason, issue_date_ad, issue_date_bs, status, notes, created_by
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      RETURNING id`,
    ).bind(
      invoiceNumber, fiscalYear, client_name.trim(), client_type, client_address,
      client_pan_or_tax_id, client_type === 'LOCAL' && client_vat_registered ? 1 : 0,
      currency, rate,
      subtotal, vatRate, vatAmount, grandTotal,
      subtotalNpr, vatAmountNpr, grandTotalNpr,
      taxExemptReason, issueDateAd, issueDateBs, 'ISSUED', notes, 'admin',
    )

    const { results } = await insertInvoice.all()
    const invoiceId = results[0].id

    const itemStatements = items.map((item) =>
      env.DB.prepare(
        'INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, total_price) VALUES (?,?,?,?,?)',
      ).bind(invoiceId, item.description, Number(item.quantity), Number(item.unit_price), Number(item.quantity) * Number(item.unit_price)),
    )
    // D1 batch = one round trip, all-or-nothing.
    await env.DB.batch(itemStatements)

    return jsonResponse({ ok: true, id: invoiceId, invoice_number: invoiceNumber }, 201)
  } catch (err) {
    return jsonResponse({ error: 'Could not create invoice.', detail: String(err) }, 500)
  }
}
