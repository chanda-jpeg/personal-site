#!/usr/bin/env node
/**
 * Scrape a GitHub profile into the data the site renders.
 *
 *   npm run scrape              # uses GITHUB_USER, or the handle below
 *   GITHUB_USER=someone npm run scrape
 *   GITHUB_TOKEN=... npm run scrape   # optional, raises the rate limit
 *
 * Writes src/projects.generated.ts with:
 *   - githubProjects : one work card per public, non-fork, non-archived repo
 *   - githubStats    : real numbers for the About counters
 *
 * Re-run it whenever your GitHub changes. Manual case studies stay in
 * src/config.ts, so generated and handwritten work can coexist.
 */
import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const USER = process.env.GITHUB_USER || process.argv[2] || 'chanda-jpeg'
const OUT = fileURLToPath(new URL('../src/projects.generated.ts', import.meta.url))

const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'personal-site-scraper',
}
if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
}

async function api(path) {
  const res = await fetch(`https://api.github.com${path}`, { headers })
  if (!res.ok) {
    const hint =
      res.status === 404
        ? ` — no such user (${USER})?`
        : res.status === 403
          ? ' — rate limited; set GITHUB_TOKEN and retry'
          : ''
    throw new Error(`GET ${path} → ${res.status}${hint}`)
  }
  return res.json()
}

const titleCase = (slug) =>
  slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')

function displayName(repo) {
  let name = repo.name
  if (name.startsWith('https-github.com-')) {
    name = name.slice('https-github.com-'.length)
    name = name.replace(new RegExp(`^${USER}-`), '')
  }
  return titleCase(name)
}

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`

async function main() {
  console.log(`Scraping github.com/${USER} …`)
  const [user, repos] = await Promise.all([
    api(`/users/${USER}`),
    api(`/users/${USER}/repos?per_page=100&sort=pushed`),
  ])

  const usable = repos
    .filter((repo) => !repo.fork && !repo.archived)
    .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))

  const projects = usable.map((repo, i) => {
    const title = displayName(repo)
    const stack = [repo.language, ...(repo.topics ?? [])].filter(Boolean).slice(0, 4)
    const description = repo.description?.trim()

    return {
      id: repo.name.toLowerCase(),
      title,
      tagline:
        description ||
        `A ${repo.language ?? 'code'} repository in progress — add a GitHub description to fill this in.`,
      year: String(new Date(repo.created_at).getFullYear()),
      role: 'GitHub repository',
      stack: stack.length ? stack : ['Source'],
      body:
        description ||
        `${title} is a public repository on github.com/${USER}. It has no description yet, so this case study is a placeholder: add one on GitHub and re-run \`npm run scrape\`, or write a manual entry in src/config.ts.`,
      highlights: [
        repo.language ? `${repo.language} codebase` : 'No language detected yet',
        plural(repo.stargazers_count, 'star') + ` · ${plural(repo.forks_count, 'fork')}`,
        `Last push ${fmtDate(repo.pushed_at)}`,
      ],
      href: repo.homepage || repo.html_url,
      accent: i % 2 === 0 ? 'var(--accent)' : 'var(--accent-2)',
      repo: repo.name,
    }
  })

  const languages = [...new Set(usable.map((r) => r.language).filter(Boolean))]
  const stars = usable.reduce((sum, r) => sum + r.stargazers_count, 0)
  const years = Math.max(
    1,
    new Date().getFullYear() - new Date(user.created_at).getFullYear(),
  )

  const file = `/**
 * AUTO-GENERATED — do not edit by hand.
 * Source: github.com/${USER}
 * Generated: ${new Date().toISOString()}
 * Refresh with: npm run scrape
 */
export type GeneratedProject = {
  id: string
  title: string
  tagline: string
  year: string
  role: string
  stack: string[]
  body: string
  highlights: string[]
  href: string
  accent: string
  repo: string
}

export const githubProjects: GeneratedProject[] = ${JSON.stringify(projects, null, 2)}

export const githubStats: { value: number; suffix: string; label: string }[] = ${JSON.stringify(
    [
      { value: usable.length, suffix: '', label: 'public repos' },
      { value: stars, suffix: '', label: 'stars earned' },
      { value: languages.length, suffix: '', label: 'languages' },
      { value: years, suffix: 'yr', label: 'on GitHub' },
    ],
    null,
    2,
  )}
`

  await writeFile(OUT, file, 'utf8')
  console.log(
    `Wrote ${projects.length} project(s) and 4 stats from ${usable.length} repo(s) → src/projects.generated.ts`,
  )
}

main().catch((err) => {
  console.error(`Scrape failed: ${err.message}`)
  process.exit(1)
})
