import { Link } from 'react-router-dom'
import LeafGrid from '../components/LeafGrid.jsx'
import useReveal from '../lib/useReveal.js'

const pillars = [
  {
    label: '01',
    title: 'Software for the farm',
    body: 'Herd, pasture and yield systems built for how a farm actually runs — not a generic dashboard bolted on afterward.',
  },
  {
    label: '02',
    title: 'Sensors & hardware',
    body: 'IoT sensors, monitoring hardware and automation we design, source, install and keep running.',
  },
  {
    label: '03',
    title: 'Consulting',
    body: 'End-to-end digital transformation for dairies and grain operations, from first sensor to full rollout.',
  },
]

export default function Home() {
  const pillarsRef = useReveal()
  const ctaRef = useReveal()

  return (
    <>
      {/* Hero — deliberately quiet. One line, one motif, one path forward. */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 sm:px-10 sm:py-28 lg:grid-cols-[1.1fr_1fr] lg:py-32">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-leaf">
              Agri-tech &amp; dairy-tech, built in Nepal
            </p>
            <h1 className="mt-5 font-display text-4xl font-medium leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              We build the technology dairy and grain farms run on.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink-soft">
              Rubisco Tech designs software, sensors and systems for working
              farms — not just a website, a dream farm, built and run end to
              end.
            </p>
            <div className="mt-9">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 border border-ink px-6 py-3 font-mono text-sm text-ink transition-colors hover:border-leaf hover:bg-leaf hover:text-milk"
              >
                See our work
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>

          <div className="relative">
            <LeafGrid
              animate
              className="h-auto w-full text-leaf-dark"
              size="large"
            />
          </div>
        </div>
      </section>

      {/* What we build */}
      <section ref={pillarsRef} className="reveal border-t border-line/70">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10">
          <div className="grid gap-10 sm:grid-cols-3">
            {pillars.map((pillar) => (
              <div key={pillar.label}>
                <p className="font-mono text-xs text-mustard-dark">{pillar.label}</p>
                <h3 className="mt-3 font-display text-xl font-medium text-ink">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section ref={ctaRef} className="reveal border-t border-line/70 bg-milk">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center sm:px-10">
          <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">
            Building a dream farm? Let&rsquo;s talk.
          </h2>
          <div className="mt-7">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 border border-ink px-6 py-3 font-mono text-sm text-ink transition-colors hover:border-leaf hover:bg-leaf hover:text-milk"
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
