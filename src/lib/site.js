// Central place for site-wide constants used in SEO tags, the sitemap
// generator, and social share metadata. Update SITE_URL once the site's
// real production domain is confirmed.
export const SITE_URL = 'https://rubisco.tech'
export const SITE_NAME = 'Rubisco Tech'
export const DEFAULT_DESCRIPTION =
  'Rubisco Tech builds software, sensors and systems for dairy and grain farms.'

export const CONTACT_EMAIL = 'hello@rubisco.tech'

// Registered office. Field operations are additionally based out of
// Sindhuli -- that's surfaced separately in the footer/contact copy, not
// folded into this structured address.
export const REGISTERED_ADDRESS = {
  streetAddress: 'Suryabinayak-04',
  addressLocality: 'Bhaktapur',
  addressCountry: 'NP',
}

// Sitewide Organization structured data (schema.org/Organization), rendered
// once via <Seo jsonLd={ORGANIZATION_JSON_LD} /> in SiteLayout so every page
// carries it. Keep this in sync with REGISTERED_ADDRESS / CONTACT_EMAIL
// above rather than hardcoding values a second time.
export const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  description: DEFAULT_DESCRIPTION,
  email: CONTACT_EMAIL,
  address: {
    '@type': 'PostalAddress',
    ...REGISTERED_ADDRESS,
  },
}
