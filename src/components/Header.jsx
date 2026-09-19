import { useState, useRef } from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/training', label: 'Training' },
  { to: '/hire-herd-managers', label: 'For employers' },
  { to: '/agritech-solutions', label: 'AgriTech' },
  { to: '/projects', label: 'Projects' },
  { to: '/blog', label: 'Blog' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

function NavItem({ to, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        [
          'font-mono text-sm tracking-wide transition-colors',
          isActive ? 'text-leaf' : 'text-ink-soft hover:text-leaf',
        ].join(' ')
      }
    >
      {label}
    </NavLink>
  )
}

export default function Header() {
  const [open, setOpen] = useState(false)
  const toggleRef = useRef(null)

  function closeMenu() {
    setOpen(false)
    toggleRef.current?.focus()
  }

  return (
    <header className="border-b border-line/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-10">
        <NavLink to="/" className="font-display text-xl font-medium tracking-tight text-ink">
          Rubisco
        </NavLink>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <NavItem key={link.to} {...link} />
          ))}
        </nav>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
            <path
              d={open ? 'M1 1 L19 13 M19 1 L1 13' : 'M0 1 H20 M0 7 H20 M0 13 H20'}
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          onKeyDown={(event) => {
            if (event.key === 'Escape') closeMenu()
          }}
          aria-label="Mobile"
          className="flex flex-col gap-1 border-t border-line/70 px-6 py-4 lg:hidden"
        >
          {links.map((link) => (
            <div key={link.to} className="py-2">
              <NavItem {...link} onClick={closeMenu} />
            </div>
          ))}
        </nav>
      )}
    </header>
  )
}
