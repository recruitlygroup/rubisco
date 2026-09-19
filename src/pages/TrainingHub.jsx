import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo.jsx'
import Button from '../components/ui/Button.jsx'
import Breadcrumbs from '../components/seo/Breadcrumbs.jsx'
import FaqList from '../components/seo/FaqList.jsx'
import RelatedPosts from '../components/seo/RelatedPosts.jsx'
import LeadForm from '../components/seo/LeadForm.jsx'
import { TRAINING_MODULES, PROMISE_NOTE, destinations, trainingHub, trainingForm } from '../content/seoPages.js'
import { trainingHubSchema } from '../lib/schemas.js'

/** /training: the hub that links to every destination page. */
export default function TrainingHub() {
  const jsonLd = useMemo(() => trainingHubSchema(), [])
  const form = useMemo(() => trainingForm(''), [])

  return (
    <>
      <Seo
        title={trainingHub.seoTitle}
        description={trainingHub.seoDescription}
        path={trainingHub.path}
        jsonLd={jsonLd}
      />

      <section className="mx-auto max-w-6xl px-6 pb-16 pt-10 sm:px-10 sm:pb-20">
        <Breadcrumbs trail={[{ label: 'Home', to: '/' }, { label: 'Training' }]} />
        <p className="mt-10 font-mono text-xs uppercase tracking-widest text-leaf">
          {trainingHub.eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-medium leading-[1.1] tracking-tight text-ink sm:text-5xl">
          {trainingHub.h1}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">{trainingHub.intro}</p>
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
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
          <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">
            Choose your destination
          </h2>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {destinations.map((d) => (
              <li key={d.slug}>
                <Link
                  to={`/training/${d.slug}`}
                  className="hover-lift block h-full border border-line bg-paper p-6"
                >
                  <p className="font-mono text-xs uppercase tracking-widest text-mustard-text">
                    {d.tagline}
                  </p>
                  <p className="mt-3 font-display text-xl font-medium text-ink">
                    Dairy farm training for {d.name}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{d.cardSummary}</p>
                  <p className="mt-4 font-mono text-xs text-leaf">
                    See the {d.name} page <span aria-hidden="true">&rarr;</span>
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-line/70">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
          <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">
            {trainingHub.howHeading}
          </h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {trainingHub.howSteps.map((step, index) => (
              <li key={step.title}>
                <p className="font-mono text-xs text-mustard-dark">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="mt-3 font-display text-lg font-medium text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-line/70 bg-milk">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
          <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">
            {trainingHub.curriculumHeading}
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">{trainingHub.curriculumIntro}</p>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(TRAINING_MODULES).map(([id, mod]) => (
              <li key={id} className="border border-line bg-paper p-6">
                <h3 className="font-display text-lg font-medium text-ink">{mod.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{mod.summary}</p>
              </li>
            ))}
          </ul>

          <div className="mt-10 border border-line bg-paper p-6">
            <h2 className="font-display text-lg font-medium text-ink">{PROMISE_NOTE.heading}</h2>
            {PROMISE_NOTE.body.map((paragraph) => (
              <p key={paragraph} className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-soft">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <RelatedPosts slugs={trainingHub.relatedPosts} />
      <FaqList faqs={trainingHub.faqs} />
      <LeadForm config={form} sourcePath={trainingHub.path} />
    </>
  )
}
