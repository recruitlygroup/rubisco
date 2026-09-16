import { Link } from 'react-router-dom'
import LeafGrid from '../components/LeafGrid.jsx'
import useReveal from '../lib/useReveal.js'
import Seo from '../components/Seo.jsx'
import Button from '../components/ui/Button.jsx'
import StatCard from '../components/ui/StatCard.jsx'
import HowItWorks from '../components/HowItWorks.jsx'
import ServicesShowcase from '../components/ServicesShowcase.jsx'
import { HERO_IMAGE } from '../content/media.js'
import { projects } from '../content/projects.js'

const stats = [
  {
    value: '12',
    label: 'Farms running our systems',
    trend: [9, 9, 10, 10, 11, 11, 12],
    trendLabel: 'Farms onboarded, last 6 months: 9 to 12',
  },
  {
    value: '3',
    label: 'Districts covered',
  },
  {
    value: '40k+',
    label: 'Litres tracked daily',
    trend: [31, 33, 30, 35, 37, 36, 39, 38, 41, 40],
    trendLabel: 'Daily litres tracked, last 10 days, trending up',
  },
  {
    value: '2019',
    label: 'Building in Nepal since',
  },
]

const featuredProjects = projects.slice(0, 2)

export default function Home() {
  const howRef = useReveal()
  const servicesRef = useReveal()
  const workRef = useReveal()
  const ctaRef = useReveal()

  return (
    <>
      <Seo
        title="Software, sensors & systems for dairy and grain farms"
        description="Rubisco Tech builds offline-first software, IoT sensors and end-to-end digital transformation for dairy and grain farming operations in Nepal."
        path="/"
      />
      {/* Hero — the line-drawing motif now shares the frame with a real
          field photo, instead of carrying the whole section alone. */}
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
            {/* Real field photography, ink-washed so it sits inside the
                palette instead of reading as a stock-photo drop-in. */}
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-line/70">
              <img
                src={HERO_IMAGE.url}
                alt={HERO_IMAGE.alt}
                className="h-full w-full object-cover"
                fetchpriority="high"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(155deg, rgba(22,36,27,0.15) 0%, rgba(22,36,27,0.55) 100%)',
                }}
                aria-hidden="true"
              />
              <p className="absolute bottom-2 right-3 font-mono text-[10px] text-milk/70">
                {HERO_IMAGE.credit}
              </p>

              {/* A small, honest UI mock — not a stock photo of a fake
                  screen — showing the herd dashboard the copy talks about. */}
              <div className="absolute bottom-4 left-4 w-[72%] max-w-[220px] border border-milk/30 bg-ink/75 p-3 backdrop-blur-sm sm:w-[60%]">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-mustard/80" />
                  <span className="h-1.5 w-1.5 rounded-full bg-leaf/80" />
                  <p className="ml-1 font-mono text-[9px] text-milk/70">herd.rubisco.tech</p>
                </div>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-milk/60">
                  Litres today
                </p>
                <p className="font-display text-lg font-medium text-milk">1,842 L</p>
              </div>
            </div>

            <LeafGrid
              animate
              className="pointer-events-none absolute -bottom-10 -right-10 hidden h-40 w-40 text-leaf/25 sm:block"
              size="small"
            />
          </div>
        </div>

        {/* Proof strip — real headline figures; hover/focus a stat with a
            trend line to see the shape of the underlying data. */}
        <div className="border-t border-line/70">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-10 sm:grid-cols-4 sm:px-10">
            {stats.map((stat) => (
              <StatCard
                key={stat.label}
                value={stat.value}
                label={stat.label}
                trend={stat.trend}
                trendLabel={stat.trendLabel}
              />
            ))}
          </div>
        </div>
      </section>

      {/* What we build — interactive tabbed showcase */}
      <section ref={servicesRef} className="reveal border-t border-line/70">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10">
          <p className="font-mono text-xs uppercase tracking-widest text-leaf">What we build</p>
          <h2 className="mt-3 max-w-lg font-display text-2xl font-medium text-ink sm:text-3xl">
            Three practices, one team, one farm to keep running.
          </h2>
          <div className="mt-12">
            <ServicesShowcase />
          </div>
        </div>
      </section>

      {/* How it works — interactive architecture diagram */}
      <section ref={howRef} className="reveal border-t border-line/70 bg-milk">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10">
          <p className="font-mono text-xs uppercase tracking-widest text-leaf">How it works</p>
          <h2 className="mt-3 max-w-lg font-display text-2xl font-medium text-ink sm:text-3xl">
            From a sensor in the field to a report on your desk.
          </h2>
          <p className="mt-4 max-w-xl text-ink-soft">
            Click through the three stages below — the same path every
            reading, every log entry and every alert takes on a Rubisco
            system.
          </p>
          <div className="mt-10">
            <HowItWorks />
          </div>
        </div>
      </section>

      {/* Case studies teaser */}
      <section ref={workRef} className="reveal border-t border-line/70">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-leaf">Work on the ground</p>
              <h2 className="mt-3 max-w-lg font-display text-2xl font-medium text-ink sm:text-3xl">
                Real systems, running today.
              </h2>
            </div>
            <Button to="/projects" variant="ghost">
              All projects
            </Button>
          </div>

          <div className="mt-10 grid gap-px overflow-hidden border border-line/70 bg-line/70 sm:grid-cols-2">
            {featuredProjects.map((project) => (
              <Link
                key={project.slug}
                to={`/projects/${project.slug}`}
                className="hover-lift group flex flex-col bg-paper transition-colors hover:bg-milk"
              >
                <div className="relative h-52 w-full overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.imageAlt || ''}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="photo-wash-soft" aria-hidden="true" />
                  <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-1.5 p-4">
                    {project.badges?.map((badge) => (
                      <span
                        key={badge.label}
                        className="border border-milk/40 bg-ink/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-milk backdrop-blur-sm"
                      >
                        {badge.label}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <p className="font-mono text-xs uppercase tracking-widest text-mustard-text">
                    {project.category}
                  </p>
                  <h3 className="mt-3 font-display text-lg font-medium leading-snug text-ink group-hover:text-leaf">
                    {project.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{project.summary}</p>
                  <p className="mt-5 inline-flex items-center gap-2 font-mono text-xs text-ink-soft group-hover:text-leaf">
                    Read case study
                    <span aria-hidden="true">&rarr;</span>
                  </p>
                </div>
              </Link>
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
