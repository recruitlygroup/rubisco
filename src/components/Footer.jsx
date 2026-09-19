import { Link } from 'react-router-dom'
import LeafGrid from './LeafGrid.jsx'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line/70 bg-paper-dim">
      <div className="mx-auto max-w-6xl px-6 py-14 sm:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1.1fr]">
          <div>
            <p className="font-display text-lg font-medium text-ink">
              Rubisco
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">
              Dairy farm training and placement, plus software, sensors and
              systems for dairy and grain farms.
              Registered at Suryabinayak-04, Bhaktapur, Nepal.
            </p>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">
              Training
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/training" className="hover:text-leaf">All destinations</Link></li>
              <li><Link to="/training/new-zealand" className="hover:text-leaf">New Zealand</Link></li>
              <li><Link to="/training/austria" className="hover:text-leaf">Austria</Link></li>
              <li><Link to="/training/canada" className="hover:text-leaf">Canada</Link></li>
              <li><Link to="/training/ireland" className="hover:text-leaf">Ireland</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">
              Partner with us
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/hire-herd-managers" className="hover:text-leaf">Hire herd managers</Link></li>
              <li><Link to="/agritech-solutions" className="hover:text-leaf">AgriTech solutions</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">
              Site
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/projects" className="hover:text-leaf">Projects</Link></li>
              <li><Link to="/blog" className="hover:text-leaf">Blog</Link></li>
              <li><Link to="/about" className="hover:text-leaf">About</Link></li>
              <li><Link to="/contact" className="hover:text-leaf">Contact</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">
              Get in touch
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="mailto:info@rubisco.com.np" className="hover:text-leaf">
                  info@rubisco.com.np
                </a>
              </li>
              <li className="text-ink-soft">Suryabinayak-04, Bhaktapur, Nepal</li>
              <li className="text-ink-soft">Field operations: Sindhuli, Nepal</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-line/70 pt-6 sm:flex-row sm:items-center">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
            <p className="font-mono text-xs text-ink-soft">
              &copy; {year} Rubisco Tech Pvt. Ltd. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="font-mono text-xs text-ink-soft hover:text-leaf">
                Privacy Policy
              </Link>
              <Link to="/terms" className="font-mono text-xs text-ink-soft hover:text-leaf">
                Terms of Use
              </Link>
            </div>
          </div>
          <LeafGrid className="h-6 w-10 text-leaf/60" size="small" />
        </div>
      </div>
    </footer>
  )
}
