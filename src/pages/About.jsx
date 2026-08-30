import { Link } from 'react-router-dom'
import LeafGrid from '../components/LeafGrid.jsx'
import useReveal from '../lib/useReveal.js'
import Seo from '../components/Seo.jsx'

const values = [
  {
    title: 'Built for the field, not the boardroom',
    body: 'Every system we ship gets tested by the person actually using it daily — a herder, a warehouse manager, a cooperative clerk — before it ships to anyone reviewing a report.',
  },
  {
    title: 'Offline is the default, not the exception',
    body: 'Connectivity on a working farm is unreliable by nature. We design for that reality first, rather than treating it as an edge case.',
  },
  {
    title: 'We stay after the install',
    body: 'A sensor network or a herd system is not finished when it is switched on. We maintain what we build, on a schedule, for as long as you run it.',
  },
]

export default function About() {
  const valuesRef = useReveal()
  const ctaRef = useReveal()

  return (
    <>
      <Seo
        title="About"
        description="Rubisco Tech is a Nepal-based team building software, sensors and digital transformation for dairy and grain operations — work that starts on the ground."
        path="/about"
      />
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 sm:px-10 sm:py-24 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-leaf">About</p>
            <h1 className="mt-3 font-display text-3xl font-medium leading-tight text-ink sm:text-4xl">
              Why Rubisco
            </h1>
            <p className="mt-6 max-w-md leading-relaxed text-ink-soft">
              Rubisco is the enzyme that fixes carbon inside every leaf — the
              quiet, unglamorous mechanism that everything else in the plant
              depends on. We named the company after it because that is the
              kind of technology we want to build: not the flashy part, the
              part everything else runs on.
            </p>
            <p className="mt-4 max-w-md leading-relaxed text-ink-soft">
              We are a Nepal-based team building software, sensors and
              digital transformation for dairy and grain operations — work
              that starts on the ground, with the people running the farm,
              not with a slide deck.
            </p>
          </div>
          <div className="relative">
            <LeafGrid className="h-auto w-full text-leaf-dark" size="large" />
          </div>
        </div>
      </section>

      <section ref={valuesRef} className="reveal border-t border-line/70">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10">
          <p className="font-mono text-xs uppercase tracking-widest text-mustard-dark">
            How we work
          </p>
          <div className="mt-8 grid gap-10 sm:grid-cols-3">
            {values.map((value) => (
              <div key={value.title}>
                <h3 className="font-display text-lg font-medium text-ink">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {value.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line/70 bg-milk">
        <div className="mx-auto max-w-3xl px-6 py-20 sm:px-10">
          <p className="font-mono text-xs uppercase tracking-widest text-leaf">
            Registered &amp; based
          </p>
          <p className="mt-3 max-w-xl leading-relaxed text-ink-soft">
            Rubisco Tech Pvt. Ltd. is registered in Bhaktapur, Nepal, with
            field operations based out of Sindhuli. We work directly with
            cooperatives, private dairies and grain storage operators across
            the country.
          </p>
        </div>
      </section>

      <section ref={ctaRef} className="reveal border-t border-line/70">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center sm:px-10">
          <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">
            Want to see how we work up close?
          </h2>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 border border-ink bg-ink px-6 py-3 font-mono text-sm text-milk transition-colors hover:border-leaf hover:bg-leaf"
            >
              See our work
              <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 font-mono text-sm text-ink-soft hover:text-leaf"
            >
              Get in touch
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
