// JSON-LD builders for the SEO landing pages.
//
// Plain JS (no JSX) so the same builders run in the browser (via <Seo
// jsonLd={...} />) and in Node (scripts/prerender-seo-pages.js), which keeps
// the prerendered HTML and the live page in lock-step.
//
// Every builder returns one { '@context', '@graph' } object. All graphs point
// at the same Organization @id that SiteLayout already emits sitewide
// (see ORGANIZATION_JSON_LD in site.js), so Google sees ONE Rubisco entity
// rather than several look-alikes.
//
// NOTE ON TYPES: schema.org has no "RecruitmentAgency" type. The correct
// equivalent for a placement business is "EmploymentAgency", used below.
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_DESCRIPTION,
  CONTACT_EMAIL,
  REGISTERED_ADDRESS,
  ORGANIZATION_ID,
} from './site.js'
import { TRAINING_MODULES, destinations, trainingHub } from '../content/seoPages.js'

const CONTEXT = 'https://schema.org'
const abs = (path) => `${SITE_URL}${path}`
const orgRef = { '@id': ORGANIZATION_ID }
const SERVED_COUNTRIES = ['New Zealand', 'Austria', 'Canada', 'Ireland']

function organizationNode(type) {
  return {
    '@type': type,
    '@id': ORGANIZATION_ID,
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    email: CONTACT_EMAIL,
    address: { '@type': 'PostalAddress', ...REGISTERED_ADDRESS },
  }
}

function breadcrumbNode(path, trail) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${abs(path)}#breadcrumb`,
    itemListElement: trail.map((step, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: step.name,
      item: abs(step.path),
    })),
  }
}

function webPageNode({ path, name, description, type = 'WebPage', extra = {} }) {
  return {
    '@type': type,
    '@id': `${abs(path)}#webpage`,
    url: abs(path),
    name,
    description,
    inLanguage: 'en',
    isPartOf: { '@type': 'WebSite', url: SITE_URL, name: SITE_NAME },
    breadcrumb: { '@id': `${abs(path)}#breadcrumb` },
    ...extra,
  }
}

const graph = (nodes) => ({ '@context': CONTEXT, '@graph': nodes })

// ---- /training -------------------------------------------------------------
export function trainingHubSchema() {
  const path = trainingHub.path
  return graph([
    organizationNode('EducationalOrganization'),
    webPageNode({
      path,
      type: 'CollectionPage',
      name: trainingHub.h1,
      description: trainingHub.seoDescription,
      extra: {
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: destinations.map((d, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: abs(`/training/${d.slug}`),
            name: `Practical dairy farm training for ${d.name}`,
          })),
        },
      },
    }),
    breadcrumbNode(path, [
      { name: 'Home', path: '/' },
      { name: 'Training', path },
    ]),
  ])
}

// ---- /training/<country> ---------------------------------------------------
export function trainingCountrySchema(destination) {
  const path = `/training/${destination.slug}`
  const courseId = `${abs(path)}#course`

  return graph([
    organizationNode('EducationalOrganization'),
    {
      '@type': 'Course',
      '@id': courseId,
      name: `Practical Dairy Farm Training for ${destination.name}`,
      description: destination.intro,
      url: abs(path),
      provider: orgRef,
      inLanguage: 'en',
      educationalLevel: 'Vocational',
      teaches: destination.priorityModules.map((m) => TRAINING_MODULES[m.id].title),
      audience: { '@type': 'Audience', audienceType: 'Aspiring dairy farm workers' },
    },
    webPageNode({
      path,
      name: destination.h1,
      description: destination.seoDescription,
      extra: { about: { '@id': courseId } },
    }),
    breadcrumbNode(path, [
      { name: 'Home', path: '/' },
      { name: 'Training', path: trainingHub.path },
      { name: destination.name, path },
    ]),
  ])
}

// ---- /hire-herd-managers ---------------------------------------------------
export function employersSchema(page) {
  const path = page.path
  const serviceId = `${abs(path)}#service`
  const areaServed = SERVED_COUNTRIES.map((name) => ({ '@type': 'Country', name }))

  return graph([
    { ...organizationNode('EmploymentAgency'), areaServed },
    {
      '@type': 'Service',
      '@id': serviceId,
      name: 'Dairy farm workforce recruitment',
      serviceType: 'Dairy farm staff recruitment and placement',
      description: page.intro,
      url: abs(path),
      provider: orgRef,
      areaServed,
      audience: { '@type': 'BusinessAudience', audienceType: 'Dairy farm owners and employers' },
    },
    webPageNode({
      path,
      name: page.h1,
      description: page.seoDescription,
      extra: { about: { '@id': serviceId } },
    }),
    breadcrumbNode(path, [
      { name: 'Home', path: '/' },
      { name: 'Hire herd managers', path },
    ]),
  ])
}

// ---- /agritech-solutions ---------------------------------------------------
// Deliberately no `offers`, `aggregateRating` or `operatingSystem`: Rubisco
// has not supplied pricing, reviews or a platform list, and structured data
// must never invent them. Add them here once they are real and visible on
// the page.
export function agritechSchema(page) {
  const path = page.path
  const softwareId = `${abs(path)}#software`

  return graph([
    organizationNode('Organization'),
    {
      '@type': 'SoftwareApplication',
      '@id': softwareId,
      name: page.appName,
      description: page.appDescription,
      url: abs(path),
      applicationCategory: 'BusinessApplication',
      featureList: page.features,
      inLanguage: ['ne', 'en'],
      author: orgRef,
      publisher: orgRef,
    },
    webPageNode({
      path,
      name: page.h1,
      description: page.seoDescription,
      extra: { about: { '@id': softwareId } },
    }),
    breadcrumbNode(path, [
      { name: 'Home', path: '/' },
      { name: 'AgriTech solutions', path },
    ]),
  ])
}
