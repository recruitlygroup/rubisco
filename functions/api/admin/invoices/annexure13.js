import { isAuthenticated } from '../../../_lib/session.js'

function csvEscape(value) {
  const str = String(value ?? '')
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`
  return str
}

export async function onRequestGet({ request, env }) {
  if (!(await isAuthenticated(request, env))) {
    return new Response(JSON.stringify({ error: 'Not authenticated.' }), { status: 401 })
  }

  const url = new URL(request.url)
  const fiscalYear = url.searchParams.get('fiscal_year')
  if (!fiscalYear) {
    return new Response(JSON.stringify({ error: 'fiscal_year query param is required, e.g. ?fiscal_year=83-84' }), { status: 400 })
  }

  // VOIDED invoices are excluded from the sales book by design: their
  // credit note is the audit-trail record of the reversal. Anyone who
  // needs to see the voided invoice + its credit note can still pull them
  // from the invoice detail page.
  const { results: invoices } = await env.DB
    .prepare("SELECT * FROM invoices WHERE fiscal_year = ? AND status != 'VOIDED' ORDER BY issue_date_ad, id")
    .bind(fiscalYear)
    .all()

  const header = [
    'Invoice No',
    'Date BS',
    'Client Name',
    'Client PAN',
    'Export Sales NPR',
    'Taxable Sales NPR',
    '13% VAT NPR',
    'Total Amount NPR',
  ]

  const rows = invoices.map((inv) => {
    const isExport = inv.client_type === 'FOREIGN'
    return [
      inv.invoice_number,
      inv.issue_date_bs,
      inv.client_name,
      inv.client_pan_or_tax_id || '',
      isExport ? inv.subtotal_npr.toFixed(2) : '0.00',
      isExport ? '0.00' : inv.subtotal_npr.toFixed(2),
      isExport ? '0.00' : inv.vat_amount_npr.toFixed(2),
      inv.grand_total_npr.toFixed(2),
    ]
  })

  const totals = rows.reduce(
    (acc, row) => {
      acc.exportSales += Number(row[4])
      acc.taxableSales += Number(row[5])
      acc.vat += Number(row[6])
      acc.total += Number(row[7])
      return acc
    },
    { exportSales: 0, taxableSales: 0, vat: 0, total: 0 },
  )
  const totalsRow = [
    'TOTAL', '', '', '',
    totals.exportSales.toFixed(2),
    totals.taxableSales.toFixed(2),
    totals.vat.toFixed(2),
    totals.total.toFixed(2),
  ]

  const csv = [header, ...rows, totalsRow].map((row) => row.map(csvEscape).join(',')).join('\n')

  return new Response(csv, {
    status: 200,
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="annexure-13-sales-book-FY${fiscalYear}.csv"`,
    },
  })
}
