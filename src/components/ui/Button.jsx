import { forwardRef } from 'react'
import { Link } from 'react-router-dom'

/**
 * Shared CTA button.
 *
 * Variants:
 *  - "primary"   solid ink fill, milk text, hovers to leaf. Use for the
 *                main action on a section (hero, closing CTAs, form submit).
 *  - "secondary" outlined, transparent fill. Use for the secondary action
 *                next to a primary button.
 *  - "ghost"     no border, just text + arrow. Use for low-emphasis links
 *                like "How we work ->" next to a primary CTA.
 *
 * Renders a react-router <Link> when `to` is passed, a plain <a> when
 * `href` is passed, and a <button> otherwise (pass `type="submit"` etc via
 * props). The trailing arrow can be disabled with `arrow={false}`.
 */
const VARIANT_CLASSES = {
  primary:
    'border border-ink bg-ink px-6 py-3 text-milk hover:border-leaf hover:bg-leaf disabled:cursor-wait disabled:opacity-60 disabled:hover:border-ink disabled:hover:bg-ink',
  secondary:
    'border border-ink bg-transparent px-6 py-3 text-ink hover:border-leaf hover:bg-leaf hover:text-milk disabled:cursor-wait disabled:opacity-60',
  ghost: 'text-ink-soft hover:text-leaf',
}

const BASE_CLASSES = 'inline-flex items-center gap-2 font-mono text-sm transition-colors'

const Button = forwardRef(function Button(
  { variant = 'primary', arrow = true, to, href, className = '', children, ...rest },
  ref,
) {
  const classes = [BASE_CLASSES, VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary, className]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {children}
      {arrow && <span aria-hidden="true">&rarr;</span>}
    </>
  )

  if (to) {
    return (
      <Link ref={ref} to={to} className={classes} {...rest}>
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a ref={ref} href={href} className={classes} {...rest}>
        {content}
      </a>
    )
  }

  return (
    <button ref={ref} type={rest.type || 'button'} className={classes} {...rest}>
      {content}
    </button>
  )
})

export default Button
