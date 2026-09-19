import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo.jsx'
import Button from '../components/ui/Button.jsx'
import Breadcrumbs from '../components/seo/Breadcrumbs.jsx'
import FaqList from '../components/seo/FaqList.jsx'
import RelatedPosts from '../components/seo/RelatedPosts.jsx'
import LeadForm from '../components/seo/LeadForm.jsx'
import { employersPage as page, destinations } from '../content/seoPages.js'
import { employersSchema } from '../lib/schemas.js'

/** /hire-herd-managers: B2B page for dairy employers and farm owners. */
export default function Employers() {
  const jsonLd = useMemo(() => employersSchema(page), [])

  return (
    <>
      <Seo
        title={page.seoTitle}
        description={page.seoDescription}
        path={page.path}
        jsonLd={jsonLd}
      />

      <section className="mx-auto max-w-6xl px-6 pb-16 pt-10 sm:px-10 sm:pb-20">
        <Breadcrumbs trail={[{ label: 'Home', to: '/' }, { label: 'Hire herd managers' }]} />
        <p className="mt-10 font-mono text-xs uppercase tracking-widest text-leaf">{page.eyebrow}</p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-medium leading-[1.1] tracking-tight text-ink sm:text-5xl">
          {page.h1}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">{page.intro}</p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button href="#enquiry" variant="primary">
            Request candidates
          </Button>
          <Button to="/training" variant="ghost">
            See how candidates train
          </Button>
        </div>
      </section>

      <section className="border-t border-line/70 bg-milk">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {page.highlights.map((item) => (
              <li key={item.title}>
                <h2 className="font-display text-lg font-medium text-ink">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-line/70">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
          <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">{page.specHeading}</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">{page.specIntro}</p>
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
              <caption className="sr-only">Competency areas and what candidates are trained to do</caption>
              <thead>
                <tr className="border-b border-ink/30 font-mono text-xs uppercase tracking-widest text-ink-soft">
                  <th scope="col" className="py-3 pr-6 font-normal">Competency area</th>
                  <th scope="col" className="py-3 font-normal">What candidates are trained to do</th>
                </tr>
              </thead>
              <tbody>
                {page.spec.map((row) => (
                  <tr key={row.area} className="border-b border-line/70 align-top">
                    <th scope="row" className="py-4 pr-6 font-display text-base font-medium text-ink">
                      {row.area}
                    </th>
                    <td className="py-4 leading-relaxed text-ink-soft">{row.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-t border-line/70 bg-milk">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:px-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">{page.rolesHeading}</h2>
            <ul className="mt-6 space-y-3 text-ink-soft">
              {page.roles.map((role) => (
                <li key={role} className="flex gap-3">
                  <span aria-hidden="true" className="text-leaf">
                    &bull;
                  </span>
                  <span>{role}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-soft">{page.rolesNote}</p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">{page.processHeading}</h2>
            <ol className="mt-6 space-y-6">
              {page.process.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="font-mono text-xs text-mustard-dark">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-medium text-ink">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="border-t border-line/70">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
          <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">
            {page.destinationsHeading}
          </h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {destinations.map((d) => (
              <li key={d.slug}>
                <Link
                  to={`/training/${d.slug}`}
                  className="hover-lift block h-full border border-line bg-milk p-6"
                >
                  <p className="font-display text-lg font-medium text-ink">{d.name}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{d.tagline}</p>
                  <p className="mt-4 font-mono text-xs text-leaf">
                    How candidates train <span aria-hidden="true">&rarr;</span>
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-line/70 bg-milk">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
          <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">
            {page.partnershipHeading}
          </h2>
          <ul className="mt-8 grid gap-8 md:grid-cols-3">
            {page.partnerships.map((item) => (
              <li key={item.title} className="border border-line bg-paper p-6">
                <h3 className="font-display text-lg font-medium text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <RelatedPosts slugs={page.relatedPosts} heading="Why employers hire this way" />
      <FaqList faqs={page.faqs} heading="Employer questions" />
      <LeadForm config={page.form} sourcePath={page.path} />
    </>
  )
}
