import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo.jsx'
import Button from '../components/ui/Button.jsx'
import Breadcrumbs from '../components/seo/Breadcrumbs.jsx'
import FaqList from '../components/seo/FaqList.jsx'
import RelatedPosts from '../components/seo/RelatedPosts.jsx'
import LeadForm from '../components/seo/LeadForm.jsx'
import {
  TRAINING_MODULES,
  PROMISE_NOTE,
  destinations,
  trainingForm,
} from '../content/seoPages.js'
import { trainingCountrySchema } from '../lib/schemas.js'

/**
 * Programmatic destination page, rendered once per entry in `destinations`
 * (src/content/seoPages.js) at /training/<slug>. To add a country, add an
 * entry there and it appears here, in the sitemap and in the prerender step.
 */
export default function TrainingCountry({ destination }) {
  const path = `/training/${destination.slug}`
  const jsonLd = useMemo(() => trainingCountrySchema(destination), [destination])
  const form = useMemo(() => trainingForm(destination.name), [destination])

  const priorityIds = new Set(destination.priorityModules.map((m) => m.id))
  const otherModules = Object.entries(TRAINING_MODULES).filter(([id]) => !priorityIds.has(id))
  const otherDestinations = destinations.filter((d) => d.slug !== destination.slug)

  return (
    <>
      <Seo
        title={destination.seoTitle}
        description={destination.seoDescription}
        path={path}
        jsonLd={jsonLd}
      />

      <section className="mx-auto max-w-6xl px-6 pb-16 pt-10 sm:px-10 sm:pb-20">
        <Breadcrumbs
          trail={[
            { label: 'Home', to: '/' },
            { label: 'Training', to: '/training' },
            { label: destination.name },
          ]}
        />
        <p className="mt-10 font-mono text-xs uppercase tracking-widest text-leaf">
          Training &middot; {destination.name}
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-medium leading-[1.1] tracking-tight text-ink sm:text-5xl">
          {destination.h1}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">{destination.intro}</p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button href="#enquiry" variant="primary">
            Ask about training
          </Button>
          <Button to="/hire-herd-managers" variant="ghost">
            I am a farm employer
          </Button>
        </div>
      </section>

      <section className="border-t border-line/70 bg-milk">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:px-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">
              {destination.systemHeading}
            </h2>
            {destination.system.map((paragraph) => (
              <p key={paragraph} className="mt-4 max-w-2xl leading-relaxed text-ink-soft">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="border border-line bg-paper p-6">
            <h3 className="font-display text-lg font-medium text-ink">{destination.dayHeading}</h3>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-soft">
              {destination.day.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="text-leaf">
                    &bull;
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-line/70">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
          <p className="font-mono text-xs uppercase tracking-widest text-mustard-text">
            Curriculum emphasis
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-2xl font-medium text-ink sm:text-3xl">
            What we emphasise for {destination.name}
          </h2>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {destination.priorityModules.map(({ id, why }, index) => {
              const mod = TRAINING_MODULES[id]
              return (
                <li key={id} className="border border-line bg-milk p-6">
                  <p className="font-mono text-xs text-mustard-dark">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-3 font-display text-xl font-medium text-ink">{mod.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{mod.summary}</p>
                  <p className="mt-3 text-sm leading-relaxed text-ink">
                    <span className="font-medium">Why it matters here: </span>
                    {why}
                  </p>
                </li>
              )
            })}
          </ul>

          <p className="mt-10 font-mono text-xs uppercase tracking-widest text-ink-soft">
            Also part of the core curriculum
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {otherModules.map(([id, mod]) => (
              <li
                key={id}
                className="rounded-full border border-line px-3 py-1 font-mono text-xs text-ink-soft"
              >
                {mod.title}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-line/70 bg-milk">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:px-10 md:grid-cols-2">
          <div>
            <h2 className="font-display text-xl font-medium text-ink">Language</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{destination.languageNote}</p>
          </div>
          <div>
            <h2 className="font-display text-xl font-medium text-ink">Visas and requirements</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{destination.pathwayNote}</p>
            <p className="mt-3 text-sm">
              <a
                href={destination.official.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-leaf underline underline-offset-2"
              >
                {destination.official.label} (official site)
              </a>
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-6 pb-16 sm:px-10">
          <div className="border border-line bg-paper p-6">
            <h2 className="font-display text-lg font-medium text-ink">{PROMISE_NOTE.heading}</h2>
            {PROMISE_NOTE.body.map((paragraph) => (
              <p key={paragraph} className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-soft">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <RelatedPosts slugs={destination.relatedPosts} heading={`Reading for ${destination.name}`} />

      <section className="border-t border-line/70 bg-milk">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
          <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">
            Other destinations
          </h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-3">
            {otherDestinations.map((d) => (
              <li key={d.slug}>
                <Link
                  to={`/training/${d.slug}`}
                  className="hover-lift block h-full border border-line bg-paper p-6"
                >
                  <p className="font-display text-lg font-medium text-ink">
                    Dairy farm training for {d.name}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{d.tagline}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FaqList faqs={destination.faqs} heading={`${destination.name} training: common questions`} />

      <LeadForm key={destination.slug} config={form} sourcePath={path} />
    </>
  )
}
