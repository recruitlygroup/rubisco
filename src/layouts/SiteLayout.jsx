import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import Seo from '../components/Seo.jsx'
import { ORGANIZATION_JSON_LD } from '../lib/site.js'

export default function SiteLayout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      {/* Sitewide Organization structured data. Individual pages still
          render their own <Seo> with page-specific title/description/etc;
          this just adds the schema.org block that should appear on every
          page regardless of route. */}
      <Seo jsonLd={ORGANIZATION_JSON_LD} />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-milk"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
