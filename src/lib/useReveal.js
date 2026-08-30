import { useEffect, useRef } from 'react'

/**
 * Adds the `is-visible` class to an element the first time it scrolls
 * into view, triggering the `.reveal` transition defined in index.css.
 * Returns a ref to attach to the element you want to animate.
 */
export default function useReveal(options = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (typeof IntersectionObserver === 'undefined') {
      node.classList.add('is-visible')
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('is-visible')
          observer.unobserve(node)
        }
      },
      { threshold: 0.15, ...options },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [options])

  return ref
}
