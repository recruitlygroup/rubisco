import { Link } from 'react-router-dom'

/**
 * Visible breadcrumb trail. Mirrors the BreadcrumbList JSON-LD emitted by
 * src/lib/schemas.js so what crawlers read in structured data is also what
 * visitors see on the page.
 *
 *   <Breadcrumbs trail={[{ label: 'Home', to: '/' }, { label: 'Training' }]} />
 *
 * The last item is the current page and is rendered as plain text.
 */
export default function Breadcrumbs({ trail }) {
  return (
    <nav aria-label="Breadcrumb" className="font-mono text-xs text-ink-soft">
      <ol className="flex flex-wrap items-center gap-2">
        {trail.map((step, index) => {
          const isLast = index === trail.length - 1
          return (
            <li key={step.label} className="flex items-center gap-2">
              {isLast || !step.to ? (
                <span aria-current={isLast ? 'page' : undefined} className="text-ink">
                  {step.label}
                </span>
              ) : (
                <Link to={step.to} className="hover:text-leaf">
                  {step.label}
                </Link>
              )}
              {!isLast && <span aria-hidden="true">/</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
