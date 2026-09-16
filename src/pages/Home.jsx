import LeafGrid from '../components/LeafGrid.jsx'
import useReveal from '../lib/useReveal.js'
import Seo from '../components/Seo.jsx'
import Button from '../components/ui/Button.jsx'
import StatCard from '../components/ui/StatCard.jsx'
import ServiceCard from '../components/ui/ServiceCard.jsx'

const stats = [
  { value: '12', label: 'Farms running our systems' },
  { value: '3', label: 'Districts covered' },
  { value: '40k+', label: 'Litres tracked daily' },
  { value: '2019', label: 'Building in Nepal since' },
]

const services = [
  {
    number: '01',
    title: 'Software for the farm',
    body: 'Herd, pasture and yield systems built for how a farm actually runs — not a generic dashboard bolted on afterward.',
  },
  {
    number: '02',
    title: 'Sensors & hardware',
    body: 'IoT sensors, monitoring hardware and automation we design, source, install and keep running.',
  },
  {
    number: '03',
    title: 'Consulting',
    body: 'End-to-end digital transformation for dairies and grain operations, from first sensor to full rollout.',
  },
]

export default function Home() {
  const pillarsRef = useReveal()
  const ctaRef = useReveal()

  return (
    <>
      <Seo
        title="Software, sensors & systems for dairy and grain farms"
        description="Rubisco Tech builds offline-first software, IoT sensors and end-to-end digital transformation for dairy and grain farming operations in Nepal."
        path="/"
      />
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
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Button to="/projects" variant="primary">
                See our work
              </Button>
              <Button to="/contact" variant="ghost">
                How we work
              </Button>
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

        {/* Proof strip — replace figures with real ones when ready */}
        <div className="border-t border-line/70">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-10 sm:grid-cols-4 sm:px-10">
            {stats.map((stat) => (
              <StatCard key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </section>

      {/* What we build */}
      <section ref={pillarsRef} className="reveal border-t border-line/70">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10">
          <div className="grid gap-10 sm:grid-cols-3">
            {services.map((service) => (
              <ServiceCard
                key={service.number}
                number={service.number}
                title={service.title}
                body={service.body}
              />
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
            <Button to="/contact" variant="secondary">
              Get in touch
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
