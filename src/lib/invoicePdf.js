import { jsPDF } from 'jspdf'
import { formatMoney } from './invoiceCalc.js'

/**
 * Renders an invoice (as returned by GET /api/admin/invoices/:id) to a PDF
 * and triggers a browser download. No server-side storage involved -
 * see the note at the top of this file for why.
 */
export function downloadInvoicePdf({ invoice, items, company, bank }) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const left = 48
  let y = 56

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text(company?.name || 'AgriTech IT Company', left, y)
  y += 20
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  if (company?.address) {
    doc.text(company.address, left, y)
    y += 14
  }
  if (company?.pan) {
    doc.text(`PAN: ${company.pan}`, left, y)
    y += 14
  }

  y += 16
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text(`Invoice ${invoice.invoice_number}`, left, y)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(`Status: ${invoice.status}`, 400, y)
  y += 18
  doc.text(`Date (AD): ${invoice.issue_date_ad}`, left, y)
  doc.text(`Date (BS): ${invoice.issue_date_bs}`, 260, y)
  y += 16
  doc.text(`Fiscal Year: ${invoice.fiscal_year}`, left, y)
  y += 24

  doc.setFont('helvetica', 'bold')
  doc.text('Bill To', left, y)
  y += 14
  doc.setFont('helvetica', 'normal')
  doc.text(invoice.client_name, left, y)
  y += 14
  if (invoice.client_address) {
    doc.text(invoice.client_address, left, y)
    y += 14
  }
  if (invoice.client_pan_or_tax_id) {
    doc.text(`PAN / Tax ID: ${invoice.client_pan_or_tax_id}`, left, y)
    y += 14
  }
  y += 10

  // Line items table
  doc.setFont('helvetica', 'bold')
  doc.text('Description', left, y)
  doc.text('Qty', 320, y)
  doc.text('Unit Price', 380, y)
  doc.text('Total', 480, y)
  y += 6
  doc.line(left, y, 545, y)
  y += 14
  doc.setFont('helvetica', 'normal')
  for (const item of items) {
    doc.text(item.description, left, y, { maxWidth: 260 })
    doc.text(String(item.quantity), 320, y)
    doc.text(formatMoney(item.unit_price, invoice.currency), 380, y)
    doc.text(formatMoney(item.total_price, invoice.currency), 480, y)
    y += 16
  }
  y += 8
  doc.line(left, y, 545, y)
  y += 20

  doc.text(`Subtotal: ${formatMoney(invoice.subtotal, invoice.currency)}`, 380, y)
  y += 16
  doc.text(`VAT (${(invoice.vat_rate * 100).toFixed(0)}%): ${formatMoney(invoice.vat_amount, invoice.currency)}`, 380, y)
  y += 16
  doc.setFont('helvetica', 'bold')
  doc.text(`Grand Total: ${formatMoney(invoice.grand_total, invoice.currency)}`, 380, y)
  doc.setFont('helvetica', 'normal')
  y += 24

  if (invoice.tax_exempt_reason) {
    doc.setFontSize(9)
    doc.text(invoice.tax_exempt_reason, left, y, { maxWidth: 497 })
    doc.setFontSize(10)
    y += 20
  }

  if (invoice.client_type === 'FOREIGN' && bank) {
    y += 10
    doc.setFont('helvetica', 'bold')
    doc.text('Wire Transfer Instructions', left, y)
    y += 16
    doc.setFont('helvetica', 'normal')
    const lines = [
      bank.name && `Bank: ${bank.name}`,
      bank.address && `Bank Address: ${bank.address}`,
      bank.accountTitle && `Account Title: ${bank.accountTitle}`,
      bank.accountNumber && `Account Number: ${bank.accountNumber}`,
      bank.swiftCode && `SWIFT Code: ${bank.swiftCode}`,
      `Exchange Rate Used: 1 ${invoice.currency} = NPR ${invoice.exchange_rate_npr}`,
      'Purpose Code: IT Service Export Payment',
    ].filter(Boolean)
    for (const line of lines) {
      doc.text(line, left, y)
      y += 14
    }
  }

  if (invoice.status === 'VOIDED') {
    doc.setFontSize(48)
    doc.setTextColor(200, 60, 60)
    doc.text('VOID', 380, 400, { angle: 30 })
  }

  doc.save(`${invoice.invoice_number}.pdf`)
}
