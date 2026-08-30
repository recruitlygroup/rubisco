import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { formatMoney } from '../../lib/invoiceCalc.js'

const STATUS_STYLES = {
  ISSUED: 'bg-mustard/20 text-mustard-dark',
  PAID: 'bg-leaf/15 text-leaf-dark',
  VOIDED: 'bg-soil/15 text-soil',
}

export default function AdminInvoiceList() {
  const [invoices, setInvoices] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/invoices')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error)
          setInvoices([])
        } else {
          setInvoices(data.invoices)
        }
      })
      .catch(() => setError('Could not load invoices.'))
  }, [])

  return (
    <div>
      <Helmet>
        <title>Invoices — Rubisco Admin</title>
      </Helmet>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-medium text-ink">Invoices</h1>
        <Link
          to="/admin/invoices/new"
          className="inline-flex items-center gap-2 border border-ink bg-ink px-5 py-2.5 font-mono text-xs text-milk transition-colors hover:border-leaf hover:bg-leaf"
        >
          Create invoice
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>

      {error && <p role="alert" className="mt-6 text-sm text-soil">{error}</p>}
      {invoices === null && !error && <p className="mt-6 font-mono text-sm text-ink-soft">Loading…</p>}
      {invoices && invoices.length === 0 && !error && (
        <p className="mt-6 font-mono text-sm text-ink-soft">No invoices yet. Create your first one.</p>
      )}

      {invoices && invoices.length > 0 && (
        <div className="mt-8 divide-y divide-line/70 border-t border-line/70">
          {invoices.map((inv) => (
            <Link
              key={inv.id}
              to={`/admin/invoices/${inv.id}`}
              className="flex flex-wrap items-center justify-between gap-4 py-5 hover:bg-milk"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest ${STATUS_STYLES[inv.status]}`}>
                    {inv.status}
                  </span>
                  <p className="truncate font-display text-lg font-medium text-ink">{inv.invoice_number}</p>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">
                    {inv.client_type}
                  </span>
                </div>
                <p className="mt-1 truncate text-sm text-ink-soft">{inv.client_name}</p>
                <p className="mt-1 font-mono text-xs text-ink-soft">
                  {inv.issue_date_bs} BS · {inv.issue_date_ad} AD · FY {inv.fiscal_year}
                </p>
              </div>
              <p className="shrink-0 font-mono text-sm text-ink">{formatMoney(inv.grand_total, inv.currency)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
