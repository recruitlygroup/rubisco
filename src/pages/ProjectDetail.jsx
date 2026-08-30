import { Link, useParams } from 'react-router-dom'
import { getProjectBySlug, projects } from '../content/projects.js'
import NotFound from './NotFound.jsx'
import Seo from '../components/Seo.jsx'

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = getProjectBySlug(slug)

  if (!project) return <NotFound />

  const currentIndex = projects.findIndex((p) => p.slug === slug)
  const next = projects[(currentIndex + 1) % projects.length]

  return (
    <>
      <Seo title={project.title} description={project.summary} path={`/projects/${project.slug}`} />
      <section className="mx-auto max-w-3xl px-6 pt-20 sm:px-10">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 font-mono text-xs text-ink-soft hover:text-leaf"
        >
          <span aria-hidden="true">&larr;</span>
          All projects
        </Link>

        <div className="mt-6 flex items-center gap-3">
          <p className="font-mono text-xs uppercase tracking-widest text-mustard-dark">
            {project.category}
          </p>
          <span className="h-1 w-1 rounded-full bg-line" />
          <p className="font-mono text-xs text-ink-soft">{project.year}</p>
        </div>

        <h1 className="mt-4 font-display text-3xl font-medium leading-tight text-ink sm:text-4xl">
          {project.title}
        </h1>

        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 border-y border-line/70 py-5 text-sm">
          <div>
            <dt className="font-mono text-xs uppercase tracking-widest text-ink-soft">Client</dt>
            <dd className="mt-1 text-ink">{project.client}</dd>
          </div>
          <div>
            <dt className="font-mono text-xs uppercase tracking-widest text-ink-soft">Location</dt>
            <dd className="mt-1 text-ink">{project.location}</dd>
          </div>
        </dl>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-12 sm:px-10">
        <div className="grid grid-cols-3 gap-6 border-b border-line/70 pb-12">
          {project.stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-2xl font-medium text-leaf sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs leading-snug text-ink-soft">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 space-y-10">
          {project.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="font-display text-xl font-medium text-ink">
                {section.heading}
              </h2>
              <p className="mt-3 leading-relaxed text-ink-soft">{section.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-line/70 bg-milk">
        <div className="mx-auto flex max-w-3xl flex-col items-start justify-between gap-6 px-6 py-12 sm:flex-row sm:items-center sm:px-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">
              Next case study
            </p>
            <Link
              to={`/projects/${next.slug}`}
              className="mt-2 block font-display text-lg font-medium text-ink hover:text-leaf"
            >
              {next.title}
            </Link>
          </div>
          <Link
            to="/contact"
            className="inline-flex shrink-0 items-center gap-2 border border-ink px-6 py-3 font-mono text-sm text-ink transition-colors hover:border-leaf hover:bg-leaf hover:text-milk"
          >
            Start a project
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </section>
    </>
  )
}
