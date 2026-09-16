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
              className="hover-lift group flex flex-col justify-between bg-paper transition-colors hover:bg-milk"
            >
              {project.image && (
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.imageAlt || ''}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="photo-wash-soft" aria-hidden="true" />
                  {project.badges?.length > 0 && (
                    <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-1.5 p-3">
                      {project.badges.map((badge) => (
                        <span
                          key={badge.label}
                          className="border border-milk/40 bg-ink/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-milk backdrop-blur-sm"
                        >
                          {badge.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-1 flex-col justify-between p-8">
                <div>
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-xs uppercase tracking-widest text-mustard-text">
                      {project.category}
                    </p>
                    <p className="font-mono text-xs text-ink-faint">{project.year}</p>
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
              </div>
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
