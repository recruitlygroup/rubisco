/**
 * Numbered service item card — "01 Software", "02 Sensors & Hardware",
 * "03 Consulting" on the homepage. `number` is a plain string so callers
 * control the format ("01", "1", etc.).
 */
export default function ServiceCard({ number, title, body, className = '' }) {
  return (
    <div className={className}>
      {number && <p className="font-mono text-xs text-mustard-dark">{number}</p>}
      <h3 className="mt-3 font-display text-xl font-medium text-ink">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">{body}</p>
    </div>
  )
}
