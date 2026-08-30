import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { computeInvoiceTotals, formatMoney } from '../../lib/invoiceCalc.js'
import { adDateToBs } from '../../lib/nepaliDate.js'

const inputClass =
  'mt-2 w-full border border-line bg-milk px-4 py-3 text-sm text-ink outline-none focus:border-leaf'
const labelClass = 'font-mono text-xs uppercase tracking-widest text-ink-soft'

function emptyItem() {
  return { description: '', quantity: 1, unit_price: 0 }
}

export default function AdminInvoiceForm() {
  const navigate = useNavigate()
  const [clientType, setClientType] = useState('LOCAL')
  const [currency, setCurrency] = useState('NPR')
  const [vatRegistered, setVatRegistered] = useState(true)
  const [exchangeRate, setExchangeRate] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientAddress, setClientAddress] = useState('')
  const [clientPan, setClientPan] = useState('')
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState([emptyItem()])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const todayBs = useMemo(() => {
    try {
      return adDateToBs(new Date().toISOString().slice(0, 10))
    } catch {
      return null
    }
  }, [])

  function handleClientTypeChange(type) {
    setClientType(type)
    setCurrency(type === 'LOCAL' ? 'NPR' : 'USD')
  }

  function updateItem(index, field, value) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }

  function addItem() {
    setItems((prev) => [...prev, emptyItem()])
  }

  function removeItem(index) {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const totals = useMemo(
    () => computeInvoiceTotals(items, clientType, vatRegistered),
    [items, clientType, vatRegistered],
  )

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!clientName.trim()) {
      setError('Client name is required.')
      return
    }
    if (clientType === 'FOREIGN' && (!exchangeRate || Number(exchangeRate) <= 0)) {
      setError('A positive NPR exchange rate is required for foreign invoices.')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/admin/invoices', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          client_name: clientName,
          client_type: clientType,
          client_address: clientAddress,
          client_pan_or_tax_id: clientPan,
          client_vat_registered: clientType === 'LOCAL' ? vatRegistered : false,
          currency,
          exchange_rate_npr: clientType === 'FOREIGN' ? Number(exchangeRate) : 1,
          items,
          notes,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Could not create invoice.')
        return
      }
      navigate(`/admin/invoices/${data.id}`)
    } catch {
      setError('Could not reach the server.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <Helmet>
        <title>Create Invoice — Rubisco Admin</title>
      </Helmet>
      <h1 className="font-display text-2xl font-medium text-ink">Create invoice</h1>
      <p className="mt-2 font-mono text-xs text-ink-soft">
        Once issued, an invoice cannot be edited or deleted (IRD rule). Double-check everything before submitting.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        {/* Client type switch */}
        <div>
          <span className={labelClass}>Client Type</span>
          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={() => handleClientTypeChange('LOCAL')}
              className={`border px-5 py-2.5 font-mono text-xs uppercase tracking-widest transition-colors ${
                clientType === 'LOCAL' ? 'border-ink bg-ink text-milk' : 'border-line text-ink-soft hover:border-leaf'
              }`}
            >
              Local (Nepal)
            </button>
            <button
              type="button"
              onClick={() => handleClientTypeChange('FOREIGN')}
              className={`border px-5 py-2.5 font-mono text-xs uppercase tracking-widest transition-colors ${
                clientType === 'FOREIGN' ? 'border-ink bg-ink text-milk' : 'border-line text-ink-soft hover:border-leaf'
              }`}
            >
              Foreign (Export)
            </button>
          </div>
          {clientType === 'FOREIGN' && (
            <p className="mt-2 text-xs text-ink-soft">
              Treated as 0% VAT, tax-exempt IT export service (Income Tax Act, 2058, Sec. 11). SWIFT wire
              instructions are added automatically on the invoice and PDF.
            </p>
          )}
        </div>

        {/* Client details */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="client-name" className={labelClass}>Client Name</label>
            <input id="client-name" className={inputClass} value={clientName} onChange={(e) => setClientName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="client-pan" className={labelClass}>
              {clientType === 'LOCAL' ? 'Client PAN' : 'Client Tax ID (if any)'}
            </label>
            <input id="client-pan" className={inputClass} value={clientPan} onChange={(e) => setClientPan(e.target.value)} />
          </div>
        </div>
        <div>
          <label htmlFor="client-address" className={labelClass}>Client Address</label>
          <textarea id="client-address" rows={2} className={inputClass} value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} />
        </div>

        {/* Currency / VAT / exchange rate */}
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <label htmlFor="currency" className={labelClass}>Currency</label>
            <select id="currency" className={inputClass} value={currency} onChange={(e) => setCurrency(e.target.value)}>
              {clientType === 'LOCAL' ? (
                <option value="NPR">NPR</option>
              ) : (
                <>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </>
              )}
            </select>
          </div>

          {clientType === 'LOCAL' ? (
            <div className="sm:col-span-2">
              <span className={labelClass}>VAT Status</span>
              <label className="mt-2 flex items-center gap-3 font-mono text-xs text-ink-soft">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-leaf"
                  checked={vatRegistered}
                  onChange={(e) => setVatRegistered(e.target.checked)}
                />
                Client is VAT registered (charge 13% VAT). Uncheck for a PAN-exempt local client (0%).
              </label>
            </div>
          ) : (
            <div className="sm:col-span-2">
              <label htmlFor="exchange-rate" className={labelClass}>
                Exchange Rate (1 {currency} = ? NPR)
              </label>
              <input
                id="exchange-rate"
                type="number"
                step="0.0001"
                min="0"
                className={inputClass}
                value={exchangeRate}
                onChange={(e) => setExchangeRate(e.target.value)}
              />
              <p className="mt-1 text-xs text-ink-soft">
                Used only to convert to NPR for the Annexure-13 sales book. Use the NRB reference rate for the issue date.
              </p>
            </div>
          )}
        </div>

        {/* Line items */}
        <div>
          <span className={labelClass}>Line Items</span>
          <div className="mt-3 space-y-3">
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-3">
                <input
                  className={`${inputClass} col-span-6 mt-0`}
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                />
                <input
                  className={`${inputClass} col-span-2 mt-0`}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                />
                <input
                  className={`${inputClass} col-span-2 mt-0`}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Unit price"
                  value={item.unit_price}
                  onChange={(e) => updateItem(index, 'unit_price', e.target.value)}
                />
                <div className="col-span-1 flex items-center font-mono text-sm text-ink">
                  {formatMoney((Number(item.quantity) || 0) * (Number(item.unit_price) || 0), currency)}
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  disabled={items.length === 1}
                  className="col-span-1 font-mono text-xs text-soil hover:underline disabled:opacity-40"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addItem} className="mt-3 font-mono text-xs text-leaf hover:underline">
            + Add line item
          </button>
        </div>

        {/* Live totals */}
        <div className="border border-line bg-milk px-6 py-5">
          <div className="flex justify-between font-mono text-sm text-ink-soft">
            <span>Subtotal</span>
            <span>{formatMoney(totals.subtotal, currency)}</span>
          </div>
          <div className="mt-1 flex justify-between font-mono text-sm text-ink-soft">
            <span>VAT ({(totals.vatRate * 100).toFixed(0)}%)</span>
            <span>{formatMoney(totals.vatAmount, currency)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-line pt-2 font-mono text-base font-medium text-ink">
            <span>Grand Total</span>
            <span>{formatMoney(totals.grandTotal, currency)}</span>
          </div>
          {totals.taxExemptReason && (
            <p className="mt-2 text-xs text-ink-soft">{totals.taxExemptReason}</p>
          )}
          {todayBs && (
            <p className="mt-3 font-mono text-xs text-ink-soft">
              Issue date: {new Date().toISOString().slice(0, 10)} AD &middot; {todayBs} BS
            </p>
          )}
        </div>

        <div>
          <label htmlFor="notes" className={labelClass}>Notes (optional, printed on invoice)</label>
          <textarea id="notes" rows={2} className={inputClass} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 border border-ink bg-ink px-6 py-3 font-mono text-sm text-milk transition-colors hover:border-leaf hover:bg-leaf disabled:cursor-wait disabled:opacity-60"
          >
            {saving ? 'Issuing…' : 'Issue invoice'}
          </button>
          {error && <p role="alert" className="text-sm text-soil">{error}</p>}
        </div>
      </form>
    </div>
  )
}
