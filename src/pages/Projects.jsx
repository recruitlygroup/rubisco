import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { projects } from '../content/projects.js'
import useReveal from '../lib/useReveal.js'
import Seo from '../components/Seo.jsx'

const categories = ['All', ...new Set(projects.map((p) => p.category))]

export default function Projects() {
  const [active, setActive] = useState('All')
  const gridRef = useReveal()

  const visible = useMemo(
    () => (active === 'All' ? projects : projects.filter((p) => p.category === active)),
    [active],
  )

  return (
    <>
      <Seo
        title="Projects"
        description="Case studies in software, sensors and digital transformation for dairy cooperatives and grain storage operations across Nepal."
        path="/projects"
      />
      <section className="mx-auto max-w-6xl px-6 pb-10 pt-20 sm:px-10">
        <p className="font-mono text-xs uppercase tracking-widest text-leaf">Projects</p>
        <h1 className="mt-3 max-w-2xl font-display text-3xl font-medium text-ink sm:text-4xl">
          Work on the ground
        </h1>
        <p className="mt-4 max-w-xl text-ink-soft">
          Software, sensors and consulting engagements with dairy and grain
          operations across Nepal — each one a real system running today, not
          a pitch deck.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              aria-pressed={active === cat}
              className={[
                'border px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors',
                active === cat
                  ? 'border-ink bg-ink text-milk'
                  : 'border-line text-ink-soft hover:border-leaf hover:text-leaf',
              ].join(' ')}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section ref={gridRef} className="reveal border-t border-line/70">
        <div className="mx-auto grid max-w-6xl gap-px bg-line/70 px-6 py-px sm:grid-cols-2 sm:px-10 lg:grid-cols-3">
          {visible.map((project) => (
            <Link
              key={project.slug}
              to={`/projects/${project.slug}`}
              className="group flex flex-col justify-between bg-paper p-8 transition-colors hover:bg-milk"
            >
              <div>
                <div className="flex items-center justify-between">
                  <p className="font-mono text-xs uppercase tracking-widest text-mustard-dark">
                    {project.category}
                  </p>
                  <p className="font-mono text-xs text-ink-soft">{project.year}</p>
                </div>
                <h2 className="mt-4 font-display text-xl font-medium leading-snug text-ink group-hover:text-leaf">
                  {project.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {project.summary}
                </p>
              </div>
              <p className="mt-6 inline-flex items-center gap-2 font-mono text-xs text-ink-soft group-hover:text-leaf">
                Read case study
                <span aria-hidden="true">&rarr;</span>
              </p>
            </Link>
          ))}

          {visible.length === 0 && (
            <p className="col-span-full bg-paper py-12 text-center text-sm text-ink-soft">
              No projects in this category yet.
            </p>
          )}
        </div>
      </section>
    </>
  )
}
