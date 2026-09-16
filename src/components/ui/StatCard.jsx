import { useId } from 'react'

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
 *
 * `trend` is an optional array of numbers (e.g. daily litres over the
 * last couple of weeks). When present, hovering or focusing the card
 * draws a small sparkline underneath the label — a quiet way to show
 * the shape of real farm data without turning the proof strip into a
 * dashboard. The line is decorative; pair it with `trendLabel` for the
 * screen-reader-visible summary.
 */
export default function StatCard({
  value,
  label,
  subtext,
  trend,
  trendLabel,
  size = 'sm',
  className = '',
}) {
  const gradientId = useId()
  const valueClasses =
    size === 'lg'
      ? 'font-display text-2xl font-medium text-leaf sm:text-3xl'
      : 'font-display text-2xl font-medium text-mustard-dark sm:text-3xl'

  const points = normalize(trend)

  return (
    <div className={['group', className].filter(Boolean).join(' ')} tabIndex={points ? 0 : undefined}>
      <p className={valueClasses}>{value}</p>
      <p className="mt-1 text-xs leading-snug text-ink-soft">{label}</p>
      {subtext && <p className="mt-0.5 text-xs leading-snug text-ink-faint">{subtext}</p>}

      {points && (
        <div className="mt-3">
          <svg
            viewBox="0 0 110 32"
            className="sparkline h-8 w-full max-w-[140px] text-leaf"
            role="img"
            aria-label={trendLabel || `Recent trend for ${label}`}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={`${points.line} L 110 32 L 0 32 Z`} fill={`url(#${gradientId})`} stroke="none" />
            <path
              d={points.line}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx={points.lastX}
              cy={points.lastY}
              r="2.2"
              fill="var(--color-mustard-dark)"
              stroke="var(--color-milk)"
              strokeWidth="1"
            />
          </svg>
          <p className="mt-1 text-[11px] leading-snug text-ink-faint">
            {trendLabel || 'Hover to trace the last 14 days'}
          </p>
        </div>
      )}
    </div>
  )
}

// Maps an array of numbers onto a 0-110 x 0-32 sparkline path, padded
// slightly so the stroke never clips at the card edge.
function normalize(values) {
  if (!values || values.length < 2) return null

  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const stepX = 110 / (values.length - 1)
  const pad = 4

  const coords = values.map((v, i) => {
    const x = i * stepX
    const y = pad + (1 - (v - min) / range) * (32 - pad * 2)
    return [x, y]
  })

  const line = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const [lastX, lastY] = coords[coords.length - 1]

  return { line, lastX, lastY }
}
