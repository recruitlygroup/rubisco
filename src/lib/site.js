// Central place for site-wide constants used in SEO tags, the sitemap
// generator, the prerender step and social share metadata.
//
// Brand rule: the public brand is "Rubisco" (never "Rubisco Tech").
export const SITE_URL = 'https://rubisco.com.np'
export const SITE_NAME = 'Rubisco'
export const DEFAULT_DESCRIPTION =
  'Rubisco trains and places dairy farm professionals internationally, and builds software, sensors and systems for dairy and grain farms.'

export const CONTACT_EMAIL = 'info@rubisco.com.np'

// Registered office. Field operations are additionally based out of
// Sindhuli -- that's surfaced separately in the footer/contact copy, not
// folded into this structured address.
export const REGISTERED_ADDRESS = {
  streetAddress: 'Suryabinayak-04',
  addressLocality: 'Bhaktapur',
  addressCountry: 'NP',
}

// Stable @id so every page-level JSON-LD graph (training, employers,
// agritech) can point at the same Organization entity that SiteLayout
// emits sitewide.
export const ORGANIZATION_ID = `${SITE_URL}/#organization`

// Same "<title> — Rubisco" formatting <Seo> applies at runtime. The
// prerender script imports this so static <title> tags match exactly.
export function formatTitle(title) {
  return title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — agri-tech & dairy-tech`
}

// Sitewide Organization structured data (schema.org/Organization), rendered
// once via <Seo jsonLd={ORGANIZATION_JSON_LD} /> in SiteLayout so every page
// carries it. Keep this in sync with REGISTERED_ADDRESS / CONTACT_EMAIL
// above rather than hardcoding values a second time.
export const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: SITE_NAME,
  url: SITE_URL,
  description: DEFAULT_DESCRIPTION,
  email: CONTACT_EMAIL,
  address: {
    '@type': 'PostalAddress',
    ...REGISTERED_ADDRESS,
  },
}
