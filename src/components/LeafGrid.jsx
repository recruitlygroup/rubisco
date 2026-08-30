/**
 * The signature visual for Rubisco Tech: a single line drawing that reads
 * as both a leaf's vein structure (the enzyme Rubisco fixes carbon inside
 * every leaf) and a paddock grid seen from above (the farm it serves).
 * Used once, boldly, in the hero — then echoed small as a divider.
 */
export default function LeafGrid({ className = '', animate = false, size = 'large' }) {
  const strokeWidth = size === 'large' ? 1.4 : 1

  return (
    <svg
      viewBox="0 0 600 400"
      className={className}
      role="img"
      aria-label="Line illustration of a leaf's vein structure merging into a farm paddock grid"
    >
      <title>Leaf vein structure merging into a paddock grid</title>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className={animate ? 'lg-draw' : ''}
      >
        {/* Central vein / farm access line */}
        <path d="M300 20 C 300 120, 300 220, 300 380" />

        {/* Leaf veins, upper half — curve outward like veins from a midrib */}
        <path d="M300 70 C 260 90, 210 95, 160 80" />
        <path d="M300 70 C 340 90, 390 95, 440 80" />
        <path d="M300 110 C 250 135, 190 140, 120 120" />
        <path d="M300 110 C 350 135, 410 140, 480 120" />
        <path d="M300 150 C 245 175, 180 182, 100 165" />
        <path d="M300 150 C 355 175, 420 182, 500 165" />

        {/* Transition zone — veins straighten into paddock lines */}
        <path d="M300 190 L 140 210" />
        <path d="M300 190 L 460 210" />
        <path d="M300 225 L 110 245" />
        <path d="M300 225 L 490 245" />

        {/* Paddock grid, lower half — straight fenced fields */}
        <path d="M60 260 H 540" />
        <path d="M40 300 H 560" />
        <path d="M20 340 H 580" />

        <path d="M150 260 V 380" />
        <path d="M225 260 V 380" />
        <path d="M300 260 V 380" />
        <path d="M375 260 V 380" />
        <path d="M450 260 V 380" />
      </g>
    </svg>
  )
}
