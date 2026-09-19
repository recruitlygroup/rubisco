import { useState } from 'react'

const SERVICES = [
  {
    id: 'software',
    number: '01',
    title: 'Software for the farm',
    body: 'Herd, pasture and yield systems built for how a farm actually runs — not a generic dashboard bolted on afterward.',
    mock: 'dashboard',
  },
  {
    id: 'hardware',
    number: '02',
    title: 'Sensors & hardware',
    body: 'IoT sensors, monitoring hardware and automation we design, source, install and keep running.',
    mock: 'sensor',
  },
  {
    id: 'consulting',
    number: '03',
    title: 'Consulting',
    body: 'End-to-end digital transformation for dairies and grain operations, from first sensor to full rollout.',
    mock: 'timeline',
  },
]

export default function ServicesShowcase() {
  const [activeId, setActiveId] = useState(SERVICES[0].id)
  const active = SERVICES.find((s) => s.id === activeId)

  return (
    <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
      {/* Tab list */}
      <div role="tablist" aria-label="Rubisco services" className="flex flex-col divide-y divide-line/70 border-y border-line/70 lg:border-none lg:divide-y-0">
        {SERVICES.map((service) => {
          const isActive = service.id === activeId
          return (
            <button
              key={service.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`svc-panel-${service.id}`}
              id={`svc-tab-${service.id}`}
              onClick={() => setActiveId(service.id)}
              className={[
                'group flex items-start gap-4 py-6 text-left transition-colors first:pt-0 lg:border-l-2 lg:pl-6 lg:first:pt-6',
                isActive ? 'lg:border-leaf' : 'lg:border-transparent',
              ].join(' ')}
            >
              <span
                className={[
                  'font-mono text-xs transition-colors',
                  isActive ? 'text-mustard-dark' : 'text-mustard-text',
                ].join(' ')}
              >
                {service.number}
              </span>
              <div>
                <h3
                  className={[
                    'font-display text-xl font-medium transition-colors',
                    isActive ? 'text-leaf' : 'text-ink group-hover:text-leaf',
                  ].join(' ')}
                >
                  {service.title}
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">{service.body}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Mock panel */}
      <div
        role="tabpanel"
        id={`svc-panel-${active.id}`}
        aria-labelledby={`svc-tab-${active.id}`}
        className="min-h-[360px] border border-line bg-milk p-2 sm:p-4"
      >
        {active.mock === 'dashboard' && <DashboardMock />}
        {active.mock === 'sensor' && <SensorMock />}
        {active.mock === 'timeline' && <TimelineMock />}
      </div>
    </div>
  )
}

/** Clickable-feeling mock of the herd/yield dashboard software. */
function DashboardMock() {
  const [tab, setTab] = useState('herd')
  const bars = [22, 34, 18, 40, 30, 46, 38]

  return (
    <div className="flex h-full flex-col overflow-hidden border border-line/70 bg-paper text-left">
      <div className="flex items-center gap-2 border-b border-line/70 bg-milk px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-mustard-dark/70" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-leaf/70" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" aria-hidden="true" />
        <p className="ml-3 font-mono text-[11px] text-ink-faint">herd.rubisco.tech</p>
      </div>

      <div className="flex flex-1 flex-col sm:flex-row">
        <div className="flex shrink-0 gap-1 border-b border-line/70 p-2 sm:w-36 sm:flex-col sm:border-b-0 sm:border-r">
          {[
            { id: 'herd', label: 'Herd' },
            { id: 'yield', label: 'Yield' },
            { id: 'health', label: 'Health' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              aria-pressed={tab === t.id}
              className={[
                'rounded px-3 py-2 text-left font-mono text-xs transition-colors',
                tab === t.id ? 'bg-leaf text-milk' : 'text-ink-soft hover:bg-paper-dim',
              ].join(' ')}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 p-4">
          {tab === 'herd' && (
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">
                Animals tracked
              </p>
              <p className="mt-1 font-display text-3xl font-medium text-ink">412</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                {['Lactating', 'Dry', 'Calves'].map((label, i) => (
                  <div key={label} className="border border-line/70 bg-milk p-2">
                    <p className="font-display text-lg font-medium text-leaf">{[248, 96, 68][i]}</p>
                    <p className="mt-0.5 text-ink-faint">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'yield' && (
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">
                Litres, last 7 days
              </p>
              <svg viewBox="0 0 220 60" className="mt-3 h-20 w-full text-leaf" role="img" aria-label="Milk litres trending upward over the last seven days">
                {bars.map((h, i) => (
                  <rect key={i} x={i * 30 + 6} y={60 - h} width="16" height={h} rx="2" fill="currentColor" opacity={0.4 + (i / bars.length) * 0.5} />
                ))}
              </svg>
            </div>
          )}

          {tab === 'health' && (
            <ul className="space-y-2 text-sm">
              {[
                ['Cow #114', 'Breeding window open', 'text-mustard-dark'],
                ['Cow #087', 'Vaccination due', 'text-leaf'],
                ['Cow #203', 'Checked — healthy', 'text-ink-faint'],
              ].map(([name, note, color]) => (
                <li key={name} className="flex items-center justify-between border-b border-line/60 pb-2">
                  <span className="text-ink">{name}</span>
                  <span className={`font-mono text-[11px] ${color}`}>{note}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

/** Exploded-view style diagram of a field sensor unit, with callouts. */
function SensorMock() {
  const [hovered, setHovered] = useState(null)
  const parts = [
    { id: 'solar', label: 'Solar trickle charger', x: 300, y: 40, lx: 300, ly: 20 },
    { id: 'radio', label: 'Low-power LoRa radio', x: 300, y: 110, lx: 420, ly: 100 },
    { id: 'probe', label: 'Moisture / temp probe', x: 300, y: 210, lx: 420, ly: 220 },
    { id: 'battery', label: 'Battery, 8–14 mo life', x: 300, y: 270, lx: 300, ly: 300 },
  ]

  return (
    <div className="grid h-full grid-cols-1 gap-4 p-4 sm:grid-cols-[1fr_1fr] sm:items-center">
      <svg viewBox="0 0 500 340" className="h-64 w-full text-ink-soft sm:h-full" role="img" aria-label="Diagram of a field sensor unit with its main components labeled">
        <g fill="none" stroke="currentColor" strokeWidth="1.3">
          <rect x="255" y="30" width="90" height="24" rx="3" />
          <rect x="270" y="85" width="60" height="40" rx="4" />
          <line x1="300" y1="54" x2="300" y2="85" />
          <rect x="260" y="150" width="80" height="90" rx="6" />
          <line x1="300" y1="125" x2="300" y2="150" />
          <path d="M280 190 L 320 190 M 300 170 L 300 230" strokeWidth="1" opacity="0.6" />
          <rect x="270" y="255" width="60" height="30" rx="3" />
          <line x1="300" y1="240" x2="300" y2="255" />
        </g>
        {parts.map((p) => (
          <g
            key={p.id}
            onMouseEnter={() => setHovered(p.id)}
            onMouseLeave={() => setHovered((h) => (h === p.id ? null : h))}
            onFocus={() => setHovered(p.id)}
            onBlur={() => setHovered((h) => (h === p.id ? null : h))}
            tabIndex={0}
            className="cursor-pointer outline-none"
          >
            <line
              x1={p.x}
              y1={p.y}
              x2={p.lx}
              y2={p.ly}
              stroke={hovered === p.id ? 'var(--color-mustard-dark)' : 'var(--color-line)'}
              strokeWidth="1"
            />
            <circle
              cx={p.x}
              cy={p.y}
              r="4"
              fill={hovered === p.id ? 'var(--color-mustard-dark)' : 'var(--color-leaf)'}
            />
          </g>
        ))}
      </svg>

      <ul className="space-y-2">
        {parts.map((p) => (
          <li
            key={p.id}
            onMouseEnter={() => setHovered(p.id)}
            onMouseLeave={() => setHovered((h) => (h === p.id ? null : h))}
            className={[
              'border px-3 py-2 text-sm transition-colors',
              hovered === p.id ? 'border-mustard-dark bg-milk text-ink' : 'border-line/70 text-ink-soft',
            ].join(' ')}
          >
            {p.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Simple phased-rollout timeline for the consulting practice. */
function TimelineMock() {
  const phases = [
    { label: 'Assess', detail: 'Map current tools, paper processes and staff workflow.' },
    { label: 'Unify records', detail: 'One system replaces scattered spreadsheets and books.' },
    { label: 'Add sensors', detail: 'Hardware goes in where it earns its keep first.' },
    { label: 'Train & rollout', detail: 'Staff trained inside every phase, not bolted on at the end.' },
  ]
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="flex h-full flex-col justify-center p-6">
      <ol className="space-y-1">
        {phases.map((phase, i) => {
          const isOpen = openIndex === i
          return (
            <li key={phase.label} className="border-b border-line/60 last:border-none">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-4 py-3 text-left"
              >
                <span
                  className={[
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[11px] transition-colors',
                    isOpen ? 'bg-leaf text-milk' : 'bg-paper-dim text-ink-soft',
                  ].join(' ')}
                >
                  {i + 1}
                </span>
                <span className={['font-display text-base font-medium', isOpen ? 'text-leaf' : 'text-ink'].join(' ')}>
                  {phase.label}
                </span>
                <span className="ml-auto text-ink-faint" aria-hidden="true">
                  {isOpen ? '–' : '+'}
                </span>
              </button>
              {isOpen && (
                <p className="max-w-md pb-4 pl-11 text-sm leading-relaxed text-ink-soft">{phase.detail}</p>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
