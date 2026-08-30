import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { formatMoney } from '../../lib/invoiceCalc.js'
import { downloadInvoicePdf } from '../../lib/invoicePdf.js'

const STATUS_STYLES = {
  ISSUED: 'bg-mustard/20 text-mustard-dark',
  PAID: 'bg-leaf/15 text-leaf-dark',
  VOIDED: 'bg-soil/15 text-soil',
}

export default function AdminInvoiceDetail() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [voidReason, setVoidReason] = useState('')
  const [showVoidForm, setShowVoidForm] = useState(false)
  const [busy, setBusy] = useState(false)

  function load() {
    fetch(`/api/admin/invoices/${id}`)
      .then((res) => res.json())
      .then((d) => (d.error ? setError(d.error) : setData(d)))
      .catch(() => setError('Could not load invoice.'))
  }

  useEffect(load, [id])

  async function handleVoid(e) {
    e.preventDefault()
    if (!voidReason.trim()) return
    setBusy(true)
    try {
      const res = await fetch(`/api/admin/invoices/${id}/void`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ reason: voidReason }),
      })
      const result = await res.json()
      if (!res.ok) {
        setError(result.error || 'Could not void invoice.')
        return
      }
      setShowVoidForm(false)
      setVoidReason('')
      load()
    } finally {
      setBusy(false)
    }
  }

  async function handleMarkPaid() {
    setBusy(true)
    try {
      const res = await fetch(`/api/admin/invoices/${id}/mark-paid`, { method: 'POST' })
      const result = await res.json()
      if (!res.ok) {
        setError(result.error || 'Could not update invoice.')
        return
      }
      load()
    } finally {
      setBusy(false)
    }
  }

  if (error) return <p role="alert" className="text-sm text-soil">{error}</p>
  if (!data) return <p className="font-mono text-sm text-ink-soft">Loading…</p>

  const { invoice, items, credit_notes: creditNotes } = data

  return (
    <div>
      <Helmet>
        <title>{invoice.invoice_number} — Rubisco Admin</title>
      </Helmet>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-medium text-ink">{invoice.invoice_number}</h1>
            <span className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest ${STATUS_STYLES[invoice.status]}`}>
              {invoice.status}
            </span>
          </div>
          <p className="mt-1 font-mono text-xs text-ink-soft">
            {invoice.issue_date_bs} BS · {invoice.issue_date_ad} AD · FY {invoice.fiscal_year}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => downloadInvoicePdf({ invoice, items })}
            className="border border-line px-4 py-2 font-mono text-xs uppercase tracking-widest text-ink-soft hover:border-leaf hover:text-leaf"
          >
            Download PDF
          </button>
          {invoice.status === 'ISSUED' && (
            <button
              type="button"
              onClick={handleMarkPaid}
              disabled={busy}
              className="border border-line px-4 py-2 font-mono text-xs uppercase tracking-widest text-ink-soft hover:border-leaf hover:text-leaf disabled:opacity-50"
            >
              Mark as paid
            </button>
          )}
          {invoice.status !== 'VOIDED' && (
            <button
              type="button"
              onClick={() => setShowVoidForm((v) => !v)}
              className="border border-soil px-4 py-2 font-mono text-xs uppercase tracking-widest text-soil hover:bg-soil/10"
            >
              Void (credit note)
            </button>
          )}
        </div>
      </div>

      {showVoidForm && (
        <form onSubmit={handleVoid} className="mt-6 border border-soil/40 bg-soil/5 p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-soil">
            This cannot be undone. The invoice will be flagged VOIDED and a credit note recorded against it —
            the original invoice row is never modified (IRD rule).
          </p>
          <label htmlFor="void-reason" className="mt-3 block font-mono text-xs uppercase tracking-widest text-ink-soft">
            Reason
          </label>
          <textarea
            id="void-reason"
            rows={2}
            className="mt-2 w-full border border-line bg-milk px-4 py-3 text-sm text-ink outline-none focus:border-leaf"
            value={voidReason}
            onChange={(e) => setVoidReason(e.target.value)}
          />
          <button
            type="submit"
            disabled={busy || !voidReason.trim()}
            className="mt-3 border border-soil bg-soil px-5 py-2.5 font-mono text-xs text-milk disabled:opacity-50"
          >
            Confirm void
          </button>
        </form>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">Bill to</p>
          <p className="mt-1 font-display text-lg text-ink">{invoice.client_name}</p>
          <p className="text-sm text-ink-soft">{invoice.client_address}</p>
          {invoice.client_pan_or_tax_id && (
            <p className="text-sm text-ink-soft">PAN / Tax ID: {invoice.client_pan_or_tax_id}</p>
          )}
          <p className="mt-1 font-mono text-xs text-ink-soft">{invoice.client_type}</p>
        </div>
        <div className="text-sm text-ink-soft">
          <p>Currency: {invoice.currency}</p>
          {invoice.client_type === 'FOREIGN' && <p>Exchange rate: 1 {invoice.currency} = NPR {invoice.exchange_rate_npr}</p>}
          {invoice.tax_exempt_reason && <p className="mt-1">{invoice.tax_exempt_reason}</p>}
        </div>
      </div>

      <div className="mt-8 divide-y divide-line/70 border-y border-line/70">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-4 py-3 text-sm">
            <span className="text-ink">{item.description}</span>
            <span className="font-mono text-ink-soft">
              {item.quantity} &times; {formatMoney(item.unit_price, invoice.currency)}
            </span>
            <span className="font-mono text-ink">{formatMoney(item.total_price, invoice.currency)}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 ml-auto w-full max-w-xs space-y-1 font-mono text-sm">
        <div className="flex justify-between text-ink-soft">
          <span>Subtotal</span>
          <span>{formatMoney(invoice.subtotal, invoice.currency)}</span>
        </div>
        <div className="flex justify-between text-ink-soft">
          <span>VAT ({(invoice.vat_rate * 100).toFixed(0)}%)</span>
          <span>{formatMoney(invoice.vat_amount, invoice.currency)}</span>
        </div>
        <div className="flex justify-between border-t border-line pt-1 text-base font-medium text-ink">
          <span>Total</span>
          <span>{formatMoney(invoice.grand_total, invoice.currency)}</span>
        </div>
      </div>

      {creditNotes.length > 0 && (
        <div className="mt-10 border-t border-line/70 pt-6">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">Credit notes</p>
          {creditNotes.map((cn) => (
            <div key={cn.id} className="mt-3 text-sm">
              <p className="font-display text-ink">{cn.credit_note_number}</p>
              <p className="text-ink-soft">{cn.reason}</p>
              <p className="font-mono text-xs text-ink-soft">
                {formatMoney(cn.refund_amount, cn.currency)} · {cn.created_at}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
