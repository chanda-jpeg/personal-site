/**
 * ---------------------------------------------------------------------------
 *  Chanda Persaud — personal site content
 * ---------------------------------------------------------------------------
 *  TEMPLATE CHECKLIST (search for "TODO" to find every slot):
 *    1. EMAIL + PHONE — set the two constants below.
 *    2. SOCIALS — add LinkedIn / X / Instagram / Dribbble to `site.socials`.
 *    3. Location, timezone, availability — in `site`.
 *    4. Bio, intro, headline — in `site` (currently template copy).
 *    5. Timeline — replace the placeholder roles.
 *    6. Skills — keep, rename or re-level to match you.
 *    7. GitHub work — generated automatically; run `npm run scrape` to refresh.
 *       Extra case studies that are not repos go in `manualProjects`.
 * ---------------------------------------------------------------------------
 */

import { githubProjects, githubStats } from './projects.generated'

/* --- contact details: the only two things you must fill in --------------- */

// TODO: your email address
const EMAIL = 'hello@example.com'
// TODO: your phone number (555-01xx is a reserved fake range — replace it)
const PHONE = '+1 (555) 010-0000'
const PHONE_HREF = PHONE.replace(/[^\d+]/g, '')

export type Social = { label: string; handle: string; href: string }
export type Project = {
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
}
export type Skill = { name: string; level: number; note: string }
export type NowItem = { label: string; value: string }

export const site = {
  name: 'Chanda Persaud',
  initials: 'CP',
  location: 'Remote', // TODO: your city
  timezone: 'UTC', // TODO: e.g. 'Europe/London', 'America/Toronto'
  email: EMAIL,
  phone: PHONE,
  phoneHref: PHONE_HREF,
  availability: 'Available for new work', // TODO: your real availability
  headline: ['Interfaces', 'with a pulse.'],
  intro:
    'I build software and interfaces, and this page is where the work lives. The project cards below are generated straight from my GitHub, so what you see is what I have actually shipped.',
  roleWords: ['developer', 'builder', 'problem solver', 'learner', 'Chanda Persaud'],
  bio: [
    'I am Chanda Persaud. This site is my working home on the web: the projects above are pulled from my GitHub, so nothing here is theoretical — it is code I have pushed.',
    'TODO: replace these paragraphs with your own story in src/config.ts — what you build, where you have worked, what you are learning, and the kind of problems you want next.',
  ],
  github: {
    // the handle the live Open Source panel and the scraper read
    username: 'chanda-jpeg',
    // the repository this site is published from
    repo: 'personal-site',
  },
  socials: [
    { label: 'GitHub', handle: '@chanda-jpeg', href: 'https://github.com/chanda-jpeg' },
    { label: 'Email', handle: EMAIL, href: `mailto:${EMAIL}` },
    // TODO: fill in the rest, then delete these examples
    // { label: 'LinkedIn', handle: 'in/chanda-persaud', href: 'https://www.linkedin.com/in/chanda-persaud/' },
    // { label: 'X', handle: '@handle', href: 'https://x.com/handle' },
    // { label: 'Instagram', handle: '@handle', href: 'https://instagram.com/handle' },
  ] as Social[],
  now: [
    { label: 'building', value: 'This site' },
    { label: 'next up', value: 'Your project?' },
    { label: 'based in', value: 'Remote' },
  ] as NowItem[],
}

/* --- work: scraped from GitHub, plus anything you add by hand ----------- */

export const stats = githubStats

// TODO: add case studies that are not on GitHub. Copy the shape below.
export const manualProjects: Project[] = [
  // {
  //   id: 'example',
  //   title: 'Project name',
  //   tagline: 'One line on what it does.',
  //   year: '2026',
  //   role: 'Design + build',
  //   stack: ['React', 'TypeScript'],
  //   body: 'A paragraph on the problem, your approach and the result.',
  //   highlights: ['Something measurable', 'Something interesting', 'Something shipped'],
  //   href: 'https://example.com',
  //   accent: 'var(--accent)',
  // },
]

export const projects: Project[] = [...githubProjects, ...manualProjects]

/* --- capability: TODO rename/re-level to match you ---------------------- */

export const skills: Skill[] = [
  { name: 'Frontend development', level: 85, note: 'React, TypeScript, modern CSS.' },
  { name: 'Backend & APIs', level: 72, note: 'Endpoints, data models, integrations.' },
  { name: 'UI & interaction design', level: 70, note: 'Prototypes in code, not in slides.' },
  { name: 'Tooling & automation', level: 68, note: 'Builds, scripts, GitHub Actions.' },
  { name: 'Testing & debugging', level: 65, note: 'Reproduce, fix, then prove it.' },
  { name: 'Accessibility & performance', level: 62, note: 'Keyboard first, budget second.' },
]

/* --- timeline: TODO replace with your real history --------------------- */

export const timeline = [
  {
    year: '2025 — now',
    title: 'Add your current role',
    place: 'Company · City',
    body: 'One sentence on what you do and what you shipped. Edit `timeline` in src/config.ts.',
  },
  {
    year: '20XX — 20XX',
    title: 'Add a previous role',
    place: 'Company · City',
    body: 'What you owned, what changed because of you.',
  },
  {
    year: '20XX — 20XX',
    title: 'Add education or a milestone',
    place: 'School / project',
    body: 'A course, a qualification, or the first thing you built that worked.',
  },
]

/* --- palette presets offered in the Colour section ---------------------- */

export const palettes = [
  { id: 'aubergine', name: 'Aubergine / Chartreuse', swatches: ['#0E0B12', '#D8FF4B', '#FF6A45'] },
  { id: 'copper', name: 'Ink / Copper', swatches: ['#0A0F14', '#FF9E64', '#7BD9C8'] },
  { id: 'moss', name: 'Moss / Lilac', swatches: ['#0C110E', '#D9C2FF', '#9FD8A2'] },
] as const

export type PaletteId = (typeof palettes)[number]['id']
