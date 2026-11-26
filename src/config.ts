/**
 * ---------------------------------------------------------------------------
 *  EDIT ME — every word, link and number on the site lives in this file.
 * ---------------------------------------------------------------------------
 *  The two things to change first:
 *    1. github.username  -> your GitHub handle (the live panel reads its API)
 *    2. name / role / email / location / links
 * ---------------------------------------------------------------------------
 */

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

export const site = {
  name: 'Chanda',
  initials: 'CJ',
  location: 'Remote',
  timezone: 'UTC',
  email: 'hello@example.com',
  availability: 'Open for select projects — Q1 2027',
  headline: ['Interfaces', 'with a pulse.'],
  intro:
    'I design and build tactile web experiences — the kind you can feel under the cursor. Currently turning dense product problems into calm, fast, slightly odd interfaces.',
  roleWords: ['design engineer', 'type nerd', 'motion tinkerer', 'prototyper', 'frontend lead'],
  bio: [
    'I am a design engineer working where interface design meets frontend architecture. Eight years in, I still start every project the same way: a single interaction, stripped to its bones, until it feels obvious.',
    'Most of my work lives in the browser and in the awkward space between design systems and product teams — design tokens that survive contact with real features, motion that explains instead of decorates, and accessibility treated as craft rather than compliance.',
  ],
  github: {
    // <-- your handle; the Open Source panel pulls this profile + repos live
    username: 'chanda-jpeg',
    // the repository this site is published from
    repo: 'personal-site',
  },
  socials: [
    { label: 'GitHub', handle: '@chanda-jpeg', href: 'https://github.com/chanda-jpeg' },
    { label: 'Email', handle: 'hello@example.com', href: 'mailto:hello@example.com' },
  ] as Social[],
}

export const stats = [
  { value: 8, suffix: '+', label: 'years shipping' },
  { value: 42, suffix: '', label: 'products launched' },
  { value: 120, suffix: 'k', label: 'users touched' },
  { value: 9, suffix: '', label: 'OSS libraries' },
]

export const projects: Project[] = [
  {
    id: 'sextant',
    title: 'Sextant',
    tagline: 'A type-scale playground for people who argue about leading.',
    year: '2025',
    role: 'Design + build',
    stack: ['React', 'Canvas', 'Variable fonts', 'Vite'],
    accent: 'var(--accent)',
    body:
      'Sextant is a browser instrument for composing modular scales. Drag a single root size and the whole ladder re-tunes in real time, with optical corrections per step instead of blind math. Every scale exports as CSS custom properties, Tailwind config or a Figma-ready JSON, and the preview can run any variable font dropped onto the page.',
    highlights: ['11k scales composed by visitors', 'Zero-dependency renderer', 'Exports CSS, TW + JSON'],
    href: 'https://github.com',
  },
  {
    id: 'lowlight',
    title: 'Lowlight',
    tagline: 'A focus timer that listens back.',
    year: '2024',
    role: 'Product design, frontend',
    stack: ['Web Audio', 'Svelte', 'IndexedDB'],
    accent: 'var(--accent-2)',
    body:
      'Lowlight began as a fix for my own worst habit: opening a timer app and immediately opening six other tabs. Instead of progress rings and streak guilt, it plays a slowly evolving drone built from a single noise buffer, fading with your session. One gesture starts, one gesture stops, and the history is a quiet grain of dots rather than a dashboard.',
    highlights: ['Generative audio, no assets', '12 min median session', 'Offline-first'],
    href: 'https://github.com',
  },
  {
    id: 'atlas',
    title: 'Atlas of Small Things',
    tagline: 'A scroll-driven story about the bakeries holding a city together.',
    year: '2024',
    role: 'Interaction, data viz',
    stack: ['SVG', 'Scroll timeline', 'D3 scales'],
    accent: 'var(--accent)',
    body:
      'A long-form piece for a local food magazine: 28 bakeries, their opening hours, ovens and footfall, plotted as an unfolding map that responds to scroll position. Diagrams unlock in sequence, and the map keeps a stable projection so readers can compare neighbourhoods instead of re-learning a legend each section.',
    highlights: ['28 mapped ovens', 'No chart library', 'Reduced-motion variant'],
    href: 'https://github.com',
  },
  {
    id: 'grain',
    title: 'Grain',
    tagline: 'Film grain for the DOM, at a framerate you can live with.',
    year: '2023',
    role: 'Open source maintainer',
    stack: ['WebGL', 'Shaders', 'TypeScript'],
    accent: 'var(--accent-2)',
    body:
      'Six kilobytes of shader that gives flat interfaces a little analogue tooth without shipping a 4 MB video loop. Grain runs on a single fullscreen quad, respects prefers-reduced-motion, exposes density and size as CSS variables, and pauses entirely when the tab is hidden.',
    highlights: ['6 kB min+gzip', '60 fps on integrated GPUs', 'Used in 300+ sites'],
    href: 'https://github.com',
  },
]

export const skills: Skill[] = [
  { name: 'Interface & interaction design', level: 95, note: 'Prototypes in code, not in slides.' },
  { name: 'React / TypeScript architecture', level: 92, note: 'State that outlives the sprint.' },
  { name: 'Motion & micro-interactions', level: 90, note: 'Easing as a form of explanation.' },
  { name: 'Design systems & tokens', level: 88, note: 'One source of truth, enforced.' },
  { name: 'WebGL & generative visuals', level: 76, note: 'Shaders for texture, not spectacle.' },
  { name: 'Accessibility & performance', level: 89, note: 'Keyboard first, budget second.' },
]

export const timeline = [
  { year: '2023 — now', title: 'Independent design engineer', place: 'Lisbon / remote', body: 'Product interfaces for seed-stage teams, plus a small studio practice in type and tooling.' },
  { year: '2020 — 2023', title: 'Lead design engineer, Fathom', place: 'Berlin', body: 'Built the design system behind an analytics suite; cut time-to-first-chart from four days to an afternoon.' },
  { year: '2018 — 2020', title: 'Frontend engineer, Studio Kern', place: 'Porto', body: 'Award-winning editorial sites and museum interactives with a five-person team.' },
]

export const palettes = [
  { id: 'aubergine', name: 'Aubergine / Chartreuse', swatches: ['#0E0B12', '#D8FF4B', '#FF6A45'] },
  { id: 'copper', name: 'Ink / Copper', swatches: ['#0A0F14', '#FF9E64', '#7BD9C8'] },
  { id: 'moss', name: 'Moss / Lilac', swatches: ['#0C110E', '#D9C2FF', '#9FD8A2'] },
] as const

export type PaletteId = (typeof palettes)[number]['id']
