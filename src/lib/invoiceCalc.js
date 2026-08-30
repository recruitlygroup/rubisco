// Invoice arithmetic, kept in one place so the live preview in the admin
// form and the server-side recompute in the API can never drift apart.
//
// COMPLIANCE NOTE: the API must always recompute these values itself from
// the raw line items rather than trusting whatever the browser sent — see
// functions/api/admin/invoices/index.js. This module is what both sides
// call, so "the client's math was wrong" can't become "the invoice's math
// was wrong".

export const LOCAL_VAT_RATE = 0.13
export const FOREIGN_VAT_RATE = 0 // IT export services, Income Tax Act 2058, Sec. 11
export const EXPORT_EXEMPTION_NOTE = 'Tax-exempt: IT Export Service under Income Tax Act, 2058, Section 11'

export function lineTotal(item) {
  const qty = Number(item.quantity) || 0
  const price = Number(item.unit_price) || 0
  return Math.round(qty * price * 100) / 100
}

/**
 * @param {Array<{quantity:number, unit_price:number}>} items
 * @param {'LOCAL'|'FOREIGN'} clientType
 * @param {boolean} vatRegistered - only consulted for LOCAL clients
 */
export function computeInvoiceTotals(items, clientType, vatRegistered) {
  const subtotal = items.reduce((sum, item) => sum + lineTotal(item), 0)

  let vatRate = 0
  let taxExemptReason = null

  if (clientType === 'FOREIGN') {
    vatRate = FOREIGN_VAT_RATE
    taxExemptReason = EXPORT_EXEMPTION_NOTE
  } else if (clientType === 'LOCAL') {
    if (vatRegistered) {
      vatRate = LOCAL_VAT_RATE
    } else {
      vatRate = 0
      taxExemptReason = 'PAN-exempt (client not VAT registered)'
    }
  }

  const vatAmount = Math.round(subtotal * vatRate * 100) / 100
  const grandTotal = Math.round((subtotal + vatAmount) * 100) / 100

  return { subtotal, vatRate, vatAmount, grandTotal, taxExemptReason }
}

export function formatMoney(amount, currency) {
  const symbol = { NPR: 'Rs. ', USD: '$', EUR: '\u20ac' }[currency] || ''
  return `${symbol}${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
