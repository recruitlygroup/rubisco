// Runs automatically AFTER `vite build` (see the "postbuild" script in
// package.json).
//
// WHY THIS EXISTS
// The site is a client-rendered React SPA: <title>, canonical, Open Graph
// tags and JSON-LD are written by react-helmet-async only after JavaScript
// runs. Googlebot executes JS, but Bing, social-preview bots (WhatsApp,
// Facebook, LinkedIn, X) and most AI crawlers do not, so they would see the
// generic homepage metadata on every URL.
//
// WHAT IT DOES
// For each new SEO landing page it writes dist/<route>/index.html, a copy of
// the built SPA shell with:
//   - the page's own <title>, meta description, canonical, Open Graph and
//     Twitter tags, and JSON-LD injected into <head>
//   - a plain-HTML outline (h1, intro, headings, FAQ, internal links) inside
//     <div id="root">
// When the browser loads the page, React mounts and replaces the outline with
// the full interactive page (createRoot clears the container), so visitors
// get the normal experience. Cloudflare Pages serves an existing static file
// before the `/* /index.html 200` rule in public/_redirects, so no routing
// change is needed.
//
// Everything is generated from the SAME data and schema builders the React
// pages use (src/content/seoPages.js, src/lib/schemas.js), so it cannot drift.
//
// SAFETY: this script never edits an existing file in dist/ except by adding
// new <route>/index.html files, and any failure only logs a warning (exit 0)
// so a prerender problem can never block a deploy.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { SITE_URL, SITE_NAME, formatTitle } from '../src/lib/site.js'
import { parseFrontmatter } from '../src/lib/frontmatter.js'
import {
  TRAINING_MODULES,
  destinations,
  trainingHub,
  employersPage,
  agritechPage,
} from '../src/content/seoPages.js'
import {
  trainingHubSchema,
  trainingCountrySchema,
  employersSchema,
  agritechSchema,
} from '../src/lib/schemas.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const distDir = path.join(root, 'dist')
const postsDir = path.join(root, 'src/content/posts')

const esc = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

// ---- published post titles, for internal links ------------------------------
function loadPostTitles() {
  const titles = new Map()
  if (!existsSync(postsDir)) return titles
  for (const file of readdirSync(postsDir).filter((f) => f.endsWith('.md'))) {
    const { data } = parseFrontmatter(readFileSync(path.join(postsDir, file), 'utf8'))
    if (data.published === false) continue
    titles.set(data.slug || file.replace(/\.md$/, ''), data.title || file)
  }
  return titles
}

// ---- tiny HTML helpers -------------------------------------------------------
const ul = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`
const ol = (items) => `<ol>${items.map((i) => `<li>${i}</li>`).join('')}</ol>`
const link = (href, label) => `<a href="${esc(href)}">${esc(label)}</a>`
const faq = (faqs) =>
  `<dl>${faqs.map(({ q, a }) => `<dt>${esc(q)}</dt><dd>${esc(a)}</dd>`).join('')}</dl>`
const postLinks = (slugs, titles) =>
  ul(slugs.filter((s) => titles.has(s)).map((s) => link(`/blog/${s}`, titles.get(s))))
const wrap = (inner) =>
  `<article style="max-width:48rem;margin:0 auto;padding:2.5rem 1.5rem;font-family:system-ui,sans-serif;line-height:1.6">${inner}</article>`

// ---- outlines (plain-HTML mirrors of each page's content) --------------------
function hubOutline(titles) {
  return wrap(
    `<h1>${esc(trainingHub.h1)}</h1><p>${esc(trainingHub.intro)}</p>` +
      `<h2>Choose your destination</h2>` +
      ul(
        destinations.map(
          (d) => `${link(`/training/${d.slug}`, `Dairy farm training for ${d.name}`)} — ${esc(d.cardSummary)}`,
        ),
      ) +
      `<h2>${esc(trainingHub.howHeading)}</h2>` +
      ol(trainingHub.howSteps.map((s) => `<strong>${esc(s.title)}.</strong> ${esc(s.body)}`)) +
      `<h2>${esc(trainingHub.curriculumHeading)}</h2><p>${esc(trainingHub.curriculumIntro)}</p>` +
      ul(Object.values(TRAINING_MODULES).map((m) => `<strong>${esc(m.title)}.</strong> ${esc(m.summary)}`)) +
      `<h2>Frequently asked questions</h2>${faq(trainingHub.faqs)}` +
      `<h2>Related reading</h2>${postLinks(trainingHub.relatedPosts, titles)}` +
      `<p>${link('/hire-herd-managers', 'Hire trained dairy staff')} · ${link('/contact', 'Contact')}</p>`,
  )
}

function countryOutline(d, titles) {
  return wrap(
    `<p>${link('/training', 'Training')} / ${esc(d.name)}</p>` +
      `<h1>${esc(d.h1)}</h1><p>${esc(d.intro)}</p>` +
      `<h2>${esc(d.systemHeading)}</h2>${d.system.map((p) => `<p>${esc(p)}</p>`).join('')}` +
      `<h2>What we emphasise for ${esc(d.name)}</h2>` +
      ul(
        d.priorityModules.map(
          ({ id, why }) =>
            `<strong>${esc(TRAINING_MODULES[id].title)}.</strong> ${esc(TRAINING_MODULES[id].summary)} Why it matters here: ${esc(why)}`,
        ),
      ) +
      `<h2>${esc(d.dayHeading)}</h2>${ul(d.day.map(esc))}` +
      `<h2>Language</h2><p>${esc(d.languageNote)}</p>` +
      `<h2>Visas and requirements</h2><p>${esc(d.pathwayNote)}</p>` +
      `<h2>${esc(d.name)} training: common questions</h2>${faq(d.faqs)}` +
      `<h2>Reading for ${esc(d.name)}</h2>${postLinks(d.relatedPosts, titles)}` +
      `<h2>Other destinations</h2>` +
      ul(
        destinations
          .filter((o) => o.slug !== d.slug)
          .map((o) => link(`/training/${o.slug}`, `Dairy farm training for ${o.name}`)),
      ) +
      `<p>${link('/hire-herd-managers', 'I am a farm employer')}</p>`,
  )
}

function employersOutline(titles) {
  const p = employersPage
  return wrap(
    `<h1>${esc(p.h1)}</h1><p>${esc(p.intro)}</p>` +
      ul(p.highlights.map((h) => `<strong>${esc(h.title)}.</strong> ${esc(h.body)}`)) +
      `<h2>${esc(p.specHeading)}</h2><p>${esc(p.specIntro)}</p>` +
      ul(p.spec.map((r) => `<strong>${esc(r.area)}.</strong> ${esc(r.detail)}`)) +
      `<h2>${esc(p.rolesHeading)}</h2>${ul(p.roles.map(esc))}<p>${esc(p.rolesNote)}</p>` +
      `<h2>${esc(p.processHeading)}</h2>` +
      ol(p.process.map((s) => `<strong>${esc(s.title)}.</strong> ${esc(s.body)}`)) +
      `<h2>${esc(p.destinationsHeading)}</h2>` +
      ul(destinations.map((d) => link(`/training/${d.slug}`, d.name))) +
      `<h2>${esc(p.partnershipHeading)}</h2>` +
      ul(p.partnerships.map((s) => `<strong>${esc(s.title)}.</strong> ${esc(s.body)}`)) +
      `<h2>Employer questions</h2>${faq(p.faqs)}` +
      `<h2>Why employers hire this way</h2>${postLinks(p.relatedPosts, titles)}`,
  )
}

function agritechOutline(titles) {
  const p = agritechPage
  return wrap(
    `<h1>${esc(p.h1)}</h1><p>${esc(p.intro)}</p>` +
      `<h2>${esc(p.pillarsHeading)}</h2>` +
      ul(p.pillars.map((s) => `<strong>${esc(s.title)}.</strong> ${esc(s.body)}`)) +
      `<h2>${esc(p.principlesHeading)}</h2>` +
      ul(p.principles.map((s) => `<strong>${esc(s.title)}.</strong> ${esc(s.body)}`)) +
      `<h2>${esc(p.fitHeading)}</h2>${ul(p.fit.map(esc))}` +
      `<h2>${esc(p.workforceHeading)}</h2><p>${esc(p.workforceBody)}</p>` +
      `<h2>${esc(p.partnerHeading)}</h2>` +
      ul(p.partnerTracks.map((s) => `<strong>${esc(s.title)}.</strong> ${esc(s.body)}`)) +
      `<h2>Frequently asked questions</h2>${faq(p.faqs)}` +
      `<h2>Read more about how we build</h2>${postLinks(p.relatedPosts, titles)}` +
      `<p>${link('/projects', 'Projects')} · ${link('/training', 'Dairy training')}</p>`,
  )
}

// ---- head injection ------------------------------------------------------------
function headTags({ title, description, pathname, jsonLd }) {
  const fullTitle = formatTitle(title)
  const url = `${SITE_URL}${pathname}`
  // data-rh="true" is the marker react-helmet-async uses for the tags it
  // manages, so on first client render Helmet adopts/replaces these instead
  // of leaving duplicates behind.
  const tags = [
    `<title data-rh="true">${esc(fullTitle)}</title>`,
    `<meta data-rh="true" name="description" content="${esc(description)}" />`,
    `<link data-rh="true" rel="canonical" href="${esc(url)}" />`,
    `<meta data-rh="true" property="og:type" content="website" />`,
    `<meta data-rh="true" property="og:site_name" content="${esc(SITE_NAME)}" />`,
    `<meta data-rh="true" property="og:title" content="${esc(fullTitle)}" />`,
    `<meta data-rh="true" property="og:description" content="${esc(description)}" />`,
    `<meta data-rh="true" property="og:url" content="${esc(url)}" />`,
    `<meta data-rh="true" name="twitter:card" content="summary" />`,
    `<meta data-rh="true" name="twitter:title" content="${esc(fullTitle)}" />`,
    `<meta data-rh="true" name="twitter:description" content="${esc(description)}" />`,
    // "<" is escaped so a stray "</script>" in content can never break out.
    `<script data-rh="true" type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`,
  ]
  return tags.map((t) => `    ${t}`).join('\n')
}

function buildPage(template, page) {
  let html = template

  // Drop the generic tags baked into index.html so each page carries exactly
  // one title / description / og:* set.
  html = html
    .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
    .replace(/<meta\s+name="description"[^>]*>\s*/gi, '')
    .replace(/<meta\s+property="og:(?:title|description|type|url|site_name)"[^>]*>\s*/gi, '')

  if (!html.includes('</head>')) throw new Error('template has no </head>')
  html = html.replace('</head>', `${headTags(page)}\n  </head>`)

  if (html.includes('<div id="root"></div>')) {
    html = html.replace('<div id="root"></div>', `<div id="root">${page.outline}</div>`)
  } else {
    console.warn(`[prerender] ${page.pathname}: <div id="root"></div> not found; head tags only`)
  }
  return html
}

// ---- main ----------------------------------------------------------------------
function main() {
  const templatePath = path.join(distDir, 'index.html')
  if (!existsSync(templatePath)) {
    console.warn('[prerender] dist/index.html not found; skipping (run after `vite build`).')
    return
  }
  const template = readFileSync(templatePath, 'utf8')
  const titles = loadPostTitles()

  const pages = [
    {
      pathname: trainingHub.path,
      title: trainingHub.seoTitle,
      description: trainingHub.seoDescription,
      jsonLd: trainingHubSchema(),
      outline: hubOutline(titles),
    },
    ...destinations.map((d) => ({
      pathname: `/training/${d.slug}`,
      title: d.seoTitle,
      description: d.seoDescription,
      jsonLd: trainingCountrySchema(d),
      outline: countryOutline(d, titles),
    })),
    {
      pathname: employersPage.path,
      title: employersPage.seoTitle,
      description: employersPage.seoDescription,
      jsonLd: employersSchema(employersPage),
      outline: employersOutline(titles),
    },
    {
      pathname: agritechPage.path,
      title: agritechPage.seoTitle,
      description: agritechPage.seoDescription,
      jsonLd: agritechSchema(agritechPage),
      outline: agritechOutline(titles),
    },
  ]

  let written = 0
  for (const page of pages) {
    try {
      const html = buildPage(template, page)
      const outDir = path.join(distDir, page.pathname)
      mkdirSync(outDir, { recursive: true })
      writeFileSync(path.join(outDir, 'index.html'), html)
      written += 1
    } catch (error) {
      console.warn(`[prerender] WARNING: could not prerender ${page.pathname}: ${error.message}`)
    }
  }
  console.log(`[prerender] wrote ${written}/${pages.length} SEO pages into dist/`)
}

try {
  main()
} catch (error) {
  // Never fail the deploy over SEO prerendering.
  console.warn(`[prerender] WARNING: skipped (${error.message})`)
}
