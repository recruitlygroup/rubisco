import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo.jsx'
import Button from '../components/ui/Button.jsx'
import Breadcrumbs from '../components/seo/Breadcrumbs.jsx'
import FaqList from '../components/seo/FaqList.jsx'
import RelatedPosts from '../components/seo/RelatedPosts.jsx'
import LeadForm from '../components/seo/LeadForm.jsx'
import LeafGrid from '../components/LeafGrid.jsx'
import ServiceCard from '../components/ui/ServiceCard.jsx'
import { agritechPage as page } from '../content/seoPages.js'
import { agritechSchema } from '../lib/schemas.js'
import { getPostBySlug } from '../lib/posts.js'

/** /agritech-solutions: showcase for investors, technology partners and cooperatives. */
export default function AgritechSolutions() {
  const jsonLd = useMemo(() => agritechSchema(page), [])

  return (
    <>
      <Seo
        title={page.seoTitle}
        description={page.seoDescription}
        path={page.path}
        jsonLd={jsonLd}
      />

      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 pt-10 sm:px-10 sm:pb-20 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <Breadcrumbs trail={[{ label: 'Home', to: '/' }, { label: 'AgriTech solutions' }]} />
            <p className="mt-10 font-mono text-xs uppercase tracking-widest text-leaf">{page.eyebrow}</p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-medium leading-[1.1] tracking-tight text-ink sm:text-5xl">
              {page.h1}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">{page.intro}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button href="#enquiry" variant="primary">
                Partner or invest
              </Button>
              <Button to="/projects" variant="ghost">
                See our work
              </Button>
            </div>
          </div>
          <div aria-hidden="true" className="hidden lg:block">
            <LeafGrid className="h-auto w-full text-leaf-dark" size="large" />
          </div>
        </div>
      </section>

      <section className="border-t border-line/70 bg-milk">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
          <h2 className="max-w-lg font-display text-2xl font-medium text-ink sm:text-3xl">
            {page.pillarsHeading}
          </h2>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {page.pillars.map((pillar) => (
              <ServiceCard
                key={pillar.title}
                number={pillar.number}
                title={pillar.title}
                body={pillar.body}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line/70">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
          <h2 className="max-w-lg font-display text-2xl font-medium text-ink sm:text-3xl">
            {page.principlesHeading}
          </h2>
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {page.principles.map((item) => {
              const post = getPostBySlug(item.post)
              return (
                <li key={item.title} className="border border-line bg-milk p-6">
                  <h3 className="font-display text-lg font-medium text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.body}</p>
                  {post && (
                    <Link
                      to={`/blog/${post.slug}`}
                      className="mt-4 inline-block font-mono text-xs text-leaf hover:underline"
                    >
                      Read: {post.title} <span aria-hidden="true">&rarr;</span>
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="border-t border-line/70 bg-milk">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:px-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">{page.fitHeading}</h2>
            <ul className="mt-6 space-y-3 text-ink-soft">
              {page.fit.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="text-leaf">
                    &bull;
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm">
              <Link to="/projects" className="text-leaf underline underline-offset-2">
                See our projects
              </Link>
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">
              {page.workforceHeading}
            </h2>
            <p className="mt-6 leading-relaxed text-ink-soft">{page.workforceBody}</p>
            <p className="mt-4 text-sm">
              <Link to="/training" className="text-leaf underline underline-offset-2">
                Explore our dairy training
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-line/70">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
          <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">{page.partnerHeading}</h2>
          <ul className="mt-8 grid gap-6 md:grid-cols-3">
            {page.partnerTracks.map((track) => (
              <li key={track.title} className="border border-line bg-milk p-6">
                <h3 className="font-display text-lg font-medium text-ink">{track.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{track.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <RelatedPosts slugs={page.relatedPosts} heading="Read more about how we build" />
      <FaqList faqs={page.faqs} />
      <LeadForm config={page.form} sourcePath={page.path} />
    </>
  )
}
