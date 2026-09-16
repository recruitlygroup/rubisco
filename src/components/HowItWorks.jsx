import { useState } from 'react'

/**
 * Interactive "How it works" diagram: three stages data moves through on
 * a Rubisco-built system, from sensor to cooperative office. Built as
 * plain SVG + React state (no chart/diagram library) so it stays in the
 * project's existing visual language — line-drawing icons, mono labels,
 * the same palette as LeafGrid — instead of importing a generic
 * flowchart component.
 */
const NODES = [
  {
    id: 'sensors',
    step: '01',
    title: 'On-farm hardware',
    short: 'Sensors & IoT',
    description:
      'Moisture probes, milk meters and environmental sensors installed on the barn, silo or pasture, reporting on a schedule that fits the connectivity on site — often every 15 minutes.',
    metrics: [
      { label: 'Reporting interval', value: '15 min' },
      { label: 'Battery life', value: '8–14 mo' },
    ],
    chart: 'pulses',
  },
  {
    id: 'edge',
    step: '02',
    title: 'Edge server / offline tablet',
    short: 'Local & offline-first',
    description:
      'A shared tablet or on-site edge box keeps working with no signal at all — herders log breeding, health and yield events in Nepali or English in under 10 seconds, queued locally until a connection appears.',
    metrics: [
      { label: 'Works offline', value: 'Always' },
      { label: 'Entry time', value: '<10 sec' },
    ],
    chart: 'queue',
  },
  {
    id: 'cloud',
    step: '03',
    title: 'Cloud sync & analytics',
    short: 'Reports & alerts',
    description:
      'Once connectivity returns, records sync to a central platform: threshold alerts go out by SMS, and cooperative staff see one dashboard instead of five disconnected tools.',
    metrics: [
      { label: 'Alerting', value: 'SMS + app' },
      { label: 'Sources unified', value: '5 → 1' },
    ],
    chart: 'sync',
  },
]

export default function HowItWorks() {
  const [activeId, setActiveId] = useState(NODES[0].id)
  const active = NODES.find((n) => n.id === activeId)
  const activeIndex = NODES.findIndex((n) => n.id === activeId)

  return (
    <div>
      {/* Node rail */}
      <div
        role="tablist"
        aria-label="How data moves through a Rubisco system"
        className="relative grid gap-4 sm:grid-cols-3"
      >
        {/* Connecting line, desktop only */}
        <div className="pointer-events-none absolute left-0 right-0 top-9 hidden h-px bg-line sm:block" aria-hidden="true">
          <div
            className="h-px bg-leaf transition-all duration-500 ease-out"
            style={{ width: `${(activeIndex / (NODES.length - 1)) * 100}%` }}
          />
        </div>

        {NODES.map((node, i) => {
          const isActive = node.id === activeId
          return (
            <button
              key={node.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`how-panel-${node.id}`}
              id={`how-tab-${node.id}`}
              onClick={() => setActiveId(node.id)}
              className={[
                'hover-lift relative z-10 flex flex-col items-start gap-3 border px-5 py-5 text-left transition-colors',
                isActive
                  ? 'border-leaf bg-milk shadow-sm'
                  : 'border-line bg-paper hover:border-leaf/60 hover:bg-milk/60',
              ].join(' ')}
            >
              <span
                className={[
                  'flex h-9 w-9 items-center justify-center rounded-full font-mono text-xs transition-colors',
                  isActive ? 'bg-leaf text-milk' : 'bg-paper-dim text-ink-soft',
                ].join(' ')}
                aria-hidden="true"
              >
                {node.step}
              </span>
              <div>
                <p className="font-display text-base font-medium text-ink">{node.title}</p>
                <p className="mt-0.5 font-mono text-xs uppercase tracking-widest text-mustard-text">
                  {node.short}
                </p>
              </div>
              {i < NODES.length - 1 && (
                <span
                  className="absolute -right-3 top-9 hidden text-line sm:block"
                  aria-hidden="true"
                >
                  &rarr;
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Detail panel */}
      <div
        role="tabpanel"
        id={`how-panel-${active.id}`}
        aria-labelledby={`how-tab-${active.id}`}
        className="mt-8 grid gap-8 border border-line bg-milk p-6 sm:p-8 lg:grid-cols-[1.3fr_1fr]"
      >
        <div>
          <p className="max-w-lg leading-relaxed text-ink-soft">{active.description}</p>
          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {active.metrics.map((m) => (
              <div key={m.label}>
                <dt className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">
                  {m.label}
                </dt>
                <dd className="mt-1 font-display text-lg font-medium text-leaf">{m.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <MicroChart kind={active.chart} />
      </div>
    </div>
  )
}

/**
 * Small illustrative charts, one per pipeline stage. Not tied to a
 * dataset — they're a visual metaphor for what each stage does
 * (sensors pulse in, the edge tablet queues, the cloud smooths into a
 * synced report) rather than a claim about real telemetry.
 */
function MicroChart({ kind }) {
  if (kind === 'pulses') {
    const bars = [6, 14, 9, 20, 11, 24, 15, 22, 10, 18]
    return (
      <div className="flex h-full flex-col justify-center border-t border-line/70 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
        <p className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">
          Sensor readings, last 10 cycles
        </p>
        <svg viewBox="0 0 220 60" className="mt-3 h-16 w-full text-leaf" role="img" aria-label="Sensor readings arriving at regular intervals">
          {bars.map((h, i) => (
            <rect
              key={i}
              x={i * 22 + 4}
              y={60 - h}
              width="10"
              height={h}
              rx="2"
              fill="currentColor"
              opacity={0.35 + (i / bars.length) * 0.5}
            />
          ))}
        </svg>
      </div>
    )
  }

  if (kind === 'queue') {
    const items = ['Breeding log', 'Health check', 'Yield entry', 'Feed record']
    return (
      <div className="flex h-full flex-col justify-center border-t border-line/70 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
        <p className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">
          Queued locally, no signal needed
        </p>
        <ul className="mt-3 space-y-2">
          {items.map((item, i) => (
            <li key={item} className="flex items-center gap-3 text-sm text-ink-soft">
              <span
                className={[
                  'h-2 w-2 shrink-0 rounded-full',
                  i === 0 ? 'bg-mustard-dark' : 'bg-leaf',
                ].join(' ')}
                aria-hidden="true"
              />
              {item}
              <span className="ml-auto font-mono text-[11px] text-ink-faint">
                {i === 0 ? 'syncing…' : 'saved offline'}
              </span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  // sync
  const points = [8, 14, 12, 20, 18, 27, 24, 32, 29, 36]
  const stepX = 200 / (points.length - 1)
  const line = points
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${(i * stepX).toFixed(1)} ${(40 - v).toFixed(1)}`)
    .join(' ')

  return (
    <div className="flex h-full flex-col justify-center border-t border-line/70 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
      <p className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">
        Records synced this week
      </p>
      <svg viewBox="0 0 200 40" className="mt-3 h-16 w-full text-mustard-dark" role="img" aria-label="Records synced trending upward across the week">
        <path d={line} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p className="mt-2 font-mono text-xs text-ink-faint">One dashboard, updated automatically.</p>
    </div>
  )
}
