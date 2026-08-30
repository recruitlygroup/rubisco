// Runs before `vite build` (see the "prebuild" script in package.json) and
// writes public/sitemap.xml + public/robots.txt so they get copied into
// dist/ automatically. Re-run any time routes or content slugs change —
// happens automatically on every build.
import { writeFileSync, readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { projects } from '../src/content/projects.js'
import { parseFrontmatter } from '../src/lib/frontmatter.js'
import { SITE_URL } from '../src/lib/site.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const postsDir = path.join(root, 'src/content/posts')

const staticRoutes = ['/', '/about', '/projects', '/blog', '/contact', '/privacy', '/terms']

const postSlugs = readdirSync(postsDir)
  .filter((file) => file.endsWith('.md'))
  .map((file) => {
    const raw = readFileSync(path.join(postsDir, file), 'utf8')
    const { data } = parseFrontmatter(raw)
    return { slug: data.slug || file.replace(/\.md$/, ''), published: data.published !== false }
  })
  .filter((post) => post.published)
  .map((post) => `/blog/${post.slug}`)

const projectSlugs = projects.map((project) => `/projects/${project.slug}`)

const urls = [...staticRoutes, ...projectSlugs, ...postSlugs]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${SITE_URL}${url}</loc></url>`).join('\n')}
</urlset>
`

const robots = `User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${SITE_URL}/sitemap.xml
`

writeFileSync(path.join(root, 'public/sitemap.xml'), sitemap)
writeFileSync(path.join(root, 'public/robots.txt'), robots)

console.log(`sitemap.xml written with ${urls.length} URLs`)
