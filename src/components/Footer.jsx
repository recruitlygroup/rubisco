import { Link } from 'react-router-dom'
import LeafGrid from './LeafGrid.jsx'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line/70 bg-paper-dim">
      <div className="mx-auto max-w-6xl px-6 py-14 sm:px-10">
        <div className="grid gap-10 sm:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <p className="font-display text-lg font-medium text-ink">
              Rubisco<span className="text-leaf">.</span>Tech
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">
              Software, sensors and systems for dairy and grain farms.
              Registered in Bhaktapur, Nepal.
            </p>
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
                <a href="mailto:hello@rubisco.tech" className="hover:text-leaf">
                  hello@rubisco.tech
                </a>
              </li>
              <li className="text-ink-soft">Sindhuli, Nepal</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-line/70 pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-xs text-ink-soft">
            &copy; {year} Rubisco Tech Pvt. Ltd. All rights reserved.
          </p>
          <LeafGrid className="h-6 w-10 text-leaf/60" size="small" />
        </div>
      </div>
    </footer>
  )
}
