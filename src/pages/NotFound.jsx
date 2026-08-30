import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Seo from '../components/Seo.jsx'

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" path="/404" />
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <section className="mx-auto max-w-2xl px-6 py-24 text-center sm:px-10">
        <p className="font-mono text-xs uppercase tracking-widest text-leaf">404</p>
        <h1 className="mt-3 font-display text-3xl font-medium text-ink">
          This field hasn&rsquo;t been planted yet.
        </h1>
        <Link to="/" className="mt-6 inline-block font-mono text-sm text-leaf hover:underline">
          Back to home
        </Link>
      </section>
    </>
  )
}
