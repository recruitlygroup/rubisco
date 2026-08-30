# Rubisco Tech

Marketing site for Rubisco Tech — software, sensors and systems for dairy
and grain farms. Built with React + Vite + Tailwind CSS, deployed on
Cloudflare Pages.

## Stack

- **Vite + React** — fast dev server, static production bundle
- **Tailwind CSS v4** — design tokens live in `src/index.css` under `@theme`
- **React Router** — client-side routing (`/`, `/projects`, `/blog`, `/about`, `/contact`)
- **Markdown content** — blog posts and projects are plain `.md` files with
  frontmatter in `src/content/`, no CMS required
- **Cloudflare Pages** — static hosting + CDN

## Local development

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## Build

```bash
npm run build
```

Outputs a static site to `dist/`.

## Deploy to Cloudflare Pages

**Option A — Git integration (recommended):**

1. Push this repo to GitHub.
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**.
3. Select this repo. Build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Deploy. Every push to `main` redeploys automatically.

**Option B — CLI:**

```bash
npm install -g wrangler   # if not already installed
wrangler login
npm run deploy
```

## Adding a blog post

Drop a new markdown file in `src/content/blog/`, e.g. `src/content/blog/my-post.md`:

```markdown
---
title: "Post title"
date: "2026-01-15"
excerpt: "One or two sentences for the blog index card."
---

Body content in markdown.
```

It appears automatically on `/blog` — no build config changes needed.

## Adding a project

Same pattern in `src/content/projects/`. See existing files for the
frontmatter fields used on the project cards and detail pages.

## Project structure

```
src/
  components/    Reusable UI: Header, Footer, LeafGrid (signature motif)
  layouts/       SiteLayout wraps every page with header + footer
  pages/         One file per route
  content/       Markdown source for blog posts and projects
  lib/           Small utilities (scroll-reveal hook, markdown loader)
  index.css      Design tokens (palette, type) + Tailwind import
```
