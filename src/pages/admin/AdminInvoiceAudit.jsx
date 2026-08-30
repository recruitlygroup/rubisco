import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { currentFiscalYear } from '../../lib/nepaliDate.js'

function recentFiscalYears() {
  let current
  try {
    current = currentFiscalYear()
  } catch {
    return []
  }
  const startYear = Number(current.split('-')[0])
  return Array.from({ length: 5 }, (_, i) => {
    const y = startYear - i
    return `${y}-${y + 1}`
  })
}

export default function AdminInvoiceAudit() {
  const years = recentFiscalYears()
  const [fiscalYear, setFiscalYear] = useState(years[0] || '')
  const [error, setError] = useState('')

  async function handleDownload() {
    setError('')
    if (!fiscalYear) {
      setError('Enter a fiscal year, e.g. 83-84.')
      return
    }
    try {
      const res = await fetch(`/api/admin/invoices/annexure13?fiscal_year=${encodeURIComponent(fiscalYear)}`)
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Could not generate the report.')
        return
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `annexure-13-sales-book-FY${fiscalYear}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setError('Could not reach the server.')
    }
  }

  return (
    <div>
      <Helmet>
        <title>Audit Reports — Rubisco Admin</title>
      </Helmet>
      <h1 className="font-display text-2xl font-medium text-ink">Audit reports</h1>
      <p className="mt-2 max-w-xl text-sm text-ink-soft">
        Exports the IRD Annexure-13 sales book (बिक्री खाता) for a Nepali fiscal year as a CSV, ready to hand to
        your accountant. Voided invoices are excluded; their credit notes remain visible on the invoice detail
        page as the audit trail for the reversal.
      </p>

      <div className="mt-8 flex flex-wrap items-end gap-4">
        <div>
          <label htmlFor="fiscal-year" className="font-mono text-xs uppercase tracking-widest text-ink-soft">
            Fiscal Year (BS)
          </label>
          <input
            id="fiscal-year"
            list="fiscal-year-options"
            className="mt-2 w-40 border border-line bg-milk px-4 py-3 text-sm text-ink outline-none focus:border-leaf"
            placeholder="83-84"
            value={fiscalYear}
            onChange={(e) => setFiscalYear(e.target.value)}
          />
          <datalist id="fiscal-year-options">
            {years.map((y) => (
              <option key={y} value={y} />
            ))}
          </datalist>
        </div>
        <button
          type="button"
          onClick={handleDownload}
          className="border border-ink bg-ink px-6 py-3 font-mono text-sm text-milk transition-colors hover:border-leaf hover:bg-leaf"
        >
          Download CSV
        </button>
      </div>

      {error && <p role="alert" className="mt-4 text-sm text-soil">{error}</p>}
    </div>
  )
}
