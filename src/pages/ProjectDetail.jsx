import { useParams } from 'react-router-dom'

export default function ProjectDetail() {
  const { slug } = useParams()
  return (
    <section className="mx-auto max-w-3xl px-6 py-20 sm:px-10">
      <p className="font-mono text-xs uppercase tracking-widest text-leaf">Project</p>
      <h1 className="mt-3 font-display text-3xl font-medium text-ink">{slug}</h1>
      <p className="mt-4 text-ink-soft">Case study detail lands in the next piece of this build.</p>
    </section>
  )
}
