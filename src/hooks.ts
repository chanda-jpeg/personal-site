import { useCallback, useEffect, useRef, useState } from 'react'
import type { PaletteId } from './config'

/* --------------------------------------------------------------- persisted */

export function usePersisted<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw === null ? initial : (JSON.parse(raw) as T)
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* private mode / quota — not worth a toast */
    }
  }, [key, value])

  return [value, setValue] as const
}

/* ------------------------------------------------------------ scroll reveal */

export function useReveal() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (!('IntersectionObserver' in window)) {
      nodes.forEach((n) => n.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            io.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])
}

/* ------------------------------------------------------------ active section */

export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? '')
  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))
    if (!sections.length || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.2, 0.6] },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [ids])
  return active
}

/* ------------------------------------------------------------------ scroll */

export function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])
  return progress
}

/* -------------------------------------------------------------------- clock */

export function useClock(timeZone: string) {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () => {
      try {
        setTime(
          new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone,
          }).format(new Date()),
        )
      } catch {
        setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
      }
    }
    tick()
    const id = window.setInterval(tick, 20_000)
    return () => window.clearInterval(id)
  }, [timeZone])
  return time
}

/* -------------------------------------------------------------- count-up */

export function useCountUp(target: number, run: boolean, duration = 1200) {
  const [value, setValue] = useState(target)
  const started = useRef(false)

  useEffect(() => {
    if (!run || started.current) return
    started.current = true
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target)
      return
    }
    setValue(0)
    const start = performance.now()
    let frame = 0
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(target * eased))
      if (t < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [run, target, duration])

  return value
}

/* ------------------------------------------------------------------ pointer */

export function useFinePointer() {
  const [fine, setFine] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    const update = () => setFine(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return fine
}

/* --------------------------------------------------------------- github api */

export type GhProfile = {
  login: string
  name: string | null
  avatar_url: string
  html_url: string
  bio: string | null
  company: string | null
  location: string | null
  blog: string | null
  public_repos: number
  followers: number
  following: number
  created_at: string
}

export type GhRepo = {
  id: number
  name: string
  html_url: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  topics?: string[]
  fork: boolean
  archived: boolean
  pushed_at: string
  homepage: string | null
}

export type GhState = {
  status: 'idle' | 'loading' | 'ready' | 'error'
  profile: GhProfile | null
  repos: GhRepo[]
  error: string | null
  cached: boolean
  fetchedAt: number | null
}

const CACHE_TTL = 10 * 60 * 1000

function cacheKey(user: string) {
  return `gh-cache:v1:${user.toLowerCase()}`
}

function readCache(user: string): { profile: GhProfile; repos: GhRepo[]; at: number } | null {
  try {
    const raw = sessionStorage.getItem(cacheKey(user))
    if (!raw) return null
    const parsed = JSON.parse(raw) as { profile: GhProfile; repos: GhRepo[]; at: number }
    if (!parsed.at || Date.now() - parsed.at > CACHE_TTL) return null
    return parsed
  } catch {
    return null
  }
}

export function useGitHub(username: string) {
  const [state, setState] = useState<GhState>({
    status: 'idle',
    profile: null,
    repos: [],
    error: null,
    cached: false,
    fetchedAt: null,
  })

  const load = useCallback(
    async (force = false) => {
      const user = username.trim()
      if (!user) return
      if (!force) {
        const hit = readCache(user)
        if (hit) {
          setState({
            status: 'ready',
            profile: hit.profile,
            repos: hit.repos,
            error: null,
            cached: true,
            fetchedAt: hit.at,
          })
          return
        }
      }

      setState((prev) => ({ ...prev, status: 'loading', error: null }))
      const controller = new AbortController()
      const timeout = window.setTimeout(() => controller.abort(), 12_000)

      try {
        const headers = { Accept: 'application/vnd.github+json' }
        const [profileRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${encodeURIComponent(user)}`, {
            headers,
            signal: controller.signal,
          }),
          fetch(
            `https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=100&sort=pushed`,
            { headers, signal: controller.signal },
          ),
        ])

        if (profileRes.status === 404) {
          throw new Error(`No GitHub account called “${user}”. Check the handle for typos.`)
        }
        if (profileRes.status === 403 || reposRes.status === 403) {
          throw new Error(
            'GitHub’s unauthenticated rate limit is used up for this hour. The panel will recover on its own — try again shortly.',
          )
        }
        if (!profileRes.ok) throw new Error(`GitHub responded with ${profileRes.status}.`)

        const profile = (await profileRes.json()) as GhProfile
        const repos = reposRes.ok
          ? ((await reposRes.json()) as GhRepo[]).filter((r) => !r.fork && !r.archived)
          : []

        const sorted = [...repos].sort(
          (a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime(),
        )

        try {
          sessionStorage.setItem(
            cacheKey(user),
            JSON.stringify({ profile, repos: sorted, at: Date.now() }),
          )
        } catch {
          /* storage full — ignore */
        }

        setState({
          status: 'ready',
          profile,
          repos: sorted,
          error: null,
          cached: false,
          fetchedAt: Date.now(),
        })
      } catch (err) {
        const message =
          err instanceof DOMException && err.name === 'AbortError'
            ? 'GitHub took too long to answer. Retry in a moment.'
            : err instanceof Error
              ? err.message
              : 'Something went wrong talking to GitHub.'
        setState((prev) => ({ ...prev, status: 'error', error: message }))
      } finally {
        window.clearTimeout(timeout)
      }
    },
    [username],
  )

  useEffect(() => {
    void load(false)
  }, [load])

  return { ...state, refresh: () => load(true) }
}

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diff / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.round(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.round(months / 12)}y ago`
}
