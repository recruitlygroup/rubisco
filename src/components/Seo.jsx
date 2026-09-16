import { Helmet } from 'react-helmet-async'
import { SITE_URL, SITE_NAME, DEFAULT_DESCRIPTION } from '../lib/site.js'

/**
 * Renders per-page <title>, meta description, canonical URL, Open Graph /
 * Twitter card tags, and (optionally) JSON-LD structured data. Drop one of
 * these near the top of every route-level page component.
 *
 * `path` should be the route path starting with "/", e.g. "/blog/my-post".
 * `jsonLd` accepts a single schema.org object or an array of them -- each
 * is rendered as its own <script type="application/ld+json"> tag.
 */
export default function Seo({ title, description = DEFAULT_DESCRIPTION, path = '/', image, jsonLd }) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — agri-tech & dairy-tech`
  const url = `${SITE_URL}${path}`
  const imageUrl = image ? (image.startsWith('http') ? image : `${SITE_URL}${image}`) : undefined
  const jsonLdEntries = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      {imageUrl && <meta property="og:image" content={imageUrl} />}

      <meta name="twitter:card" content={imageUrl ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}

      {jsonLdEntries.map((entry, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(entry)}
        </script>
      ))}
    </Helmet>
  )
}
