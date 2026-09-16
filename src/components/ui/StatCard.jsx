/**
 * Standardized metric card — used in the homepage proof strip and on
 * project case-study pages.
 *
 *   <StatCard value="12" label="Farms running our systems" />
 *   <StatCard value="400+" label="Animals tracked" subtext="First season" />
 *
 * `size="lg"` bumps the value up a step for pages where stats are the
 * primary content (e.g. project detail); the default "sm" size matches
 * the compact homepage proof strip.
 */
export default function StatCard({ value, label, subtext, size = 'sm', className = '' }) {
  const valueClasses =
    size === 'lg'
      ? 'font-display text-2xl font-medium text-leaf sm:text-3xl'
      : 'font-display text-2xl font-medium text-mustard-dark sm:text-3xl'

  return (
    <div className={className}>
      <p className={valueClasses}>{value}</p>
      <p className="mt-1 text-xs leading-snug text-ink-soft">{label}</p>
      {subtext && <p className="mt-0.5 text-xs leading-snug text-ink-soft/70">{subtext}</p>}
    </div>
  )
}
