// Minimal frontmatter parser/serializer for blog post markdown files.
//
// Deliberately hand-rolled instead of pulling in a YAML library: the
// frontmatter schema here is small and fixed (title, slug, date, excerpt,
// tags, categories, published), and this same file gets duplicated into
// functions/_lib/frontmatter.js for the Cloudflare Pages Functions runtime,
// where keeping dependencies minimal matters.
//
// Format:
//
//   ---
//   title: Some title
//   slug: some-title
//   date: 2026-01-01
//   excerpt: A short summary.
//   tags: offline-first, hardware
//   categories: Engineering
//   published: true
//   ---
//   Markdown body starts here.

const LIST_FIELDS = new Set(['tags', 'categories'])
const BOOLEAN_FIELDS = new Set(['published'])

export function parseFrontmatter(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw)
  if (!match) {
    return { data: {}, body: raw.trim() }
  }

  const [, frontmatterBlock, body] = match
  const data = {}

  for (const line of frontmatterBlock.split(/\r?\n/)) {
    if (!line.trim()) continue
    const separatorIndex = line.indexOf(':')
    if (separatorIndex === -1) continue

    const key = line.slice(0, separatorIndex).trim()
    let value = line.slice(separatorIndex + 1).trim()

    // Strip matching surrounding quotes, if present.
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    if (LIST_FIELDS.has(key)) {
      data[key] = value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    } else if (BOOLEAN_FIELDS.has(key)) {
      data[key] = value.toLowerCase() === 'true'
    } else {
      data[key] = value
    }
  }

  return { data, body: body.trim() }
}

function escapeFrontmatterValue(value) {
  const str = String(value)
  // Quote if the value contains characters that would otherwise break the
  // simple `key: value` line format.
  if (/[:#]/.test(str) || str !== str.trim()) {
    return `"${str.replace(/"/g, '\\"')}"`
  }
  return str
}

export function serializeFrontmatter(data, body) {
  const lines = ['---']
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) continue
    if (LIST_FIELDS.has(key)) {
      lines.push(`${key}: ${(value || []).join(', ')}`)
    } else if (BOOLEAN_FIELDS.has(key)) {
      lines.push(`${key}: ${value ? 'true' : 'false'}`)
    } else {
      lines.push(`${key}: ${escapeFrontmatterValue(value)}`)
    }
  }
  lines.push('---')
  lines.push('')
  lines.push(body.trim())
  lines.push('')
  return lines.join('\n')
}
