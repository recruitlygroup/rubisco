/**
 * Accordion FAQ built on native <details>/<summary>: keyboard accessible,
 * no JavaScript, and every answer stays in the DOM so it can be indexed.
 *
 *   <FaqList faqs={[{ q: 'Question?', a: 'Answer.' }]} />
 */
export default function FaqList({ faqs, heading = 'Frequently asked questions' }) {
  if (!faqs?.length) return null

  return (
    <section className="border-t border-line/70">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:px-10">
        <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">{heading}</h2>
        <div className="mt-8 divide-y divide-line/70 border-y border-line/70">
          {faqs.map(({ q, a }) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-display text-lg font-medium text-ink [&::-webkit-details-marker]:hidden">
                <span>{q}</span>
                <span
                  aria-hidden="true"
                  className="font-mono text-leaf transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
