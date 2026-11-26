import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { palettes, site, type PaletteId } from '../config'

type Cmd = {
  id: string
  label: string
  hint: string
  icon: string
  keywords: string
  run: () => void
}

export function CommandPalette({
  open,
  onClose,
  onPalette,
}: {
  open: boolean
  onClose: () => void
  onPalette: (id: PaletteId) => void
}) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const commands = useMemo<Cmd[]>(() => {
    const go = (id: string) => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    return [
      { id: 'work', label: 'Go to Selected work', hint: 'section', icon: '↘', keywords: 'projects case studies', run: () => go('work') },
      { id: 'about', label: 'Go to About', hint: 'section', icon: '↘', keywords: 'bio timeline', run: () => go('about') },
      { id: 'skills', label: 'Go to Capability', hint: 'section', icon: '↘', keywords: 'skills tools stack', run: () => go('skills') },
      { id: 'github', label: 'Go to GitHub panel', hint: 'live api', icon: '↘', keywords: 'repos open source', run: () => go('github') },
      { id: 'palette', label: 'Go to Colour lab', hint: 'theme', icon: '↘', keywords: 'palette colours scheme', run: () => go('palette') },
      { id: 'contact', label: 'Go to Contact', hint: 'email', icon: '↘', keywords: 'hire mail', run: () => go('contact') },
      {
        id: 'copy-email',
        label: 'Copy email address',
        hint: site.email,
        icon: '⧉',
        keywords: 'clipboard mail contact',
        run: () => {
          void navigator.clipboard?.writeText(site.email)
        },
      },
      {
        id: 'github-profile',
        label: `Open github.com/${site.github.username}`,
        hint: 'new tab',
        icon: '↗',
        keywords: 'github profile repos',
        run: () => window.open(`https://github.com/${site.github.username}`, '_blank', 'noreferrer'),
      },
      ...palettes.map<Cmd>((p) => ({
        id: `palette-${p.id}`,
        label: `Use ${p.name}`,
        hint: 'colour',
        icon: '◐',
        keywords: `palette theme colour ${p.id}`,
        run: () => onPalette(p.id),
      })),
    ]
  }, [onPalette])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter((c) => `${c.label} ${c.hint} ${c.keywords}`.toLowerCase().includes(q))
  }, [commands, query])

  useEffect(() => {
    if (!open) return
    setQuery('')
    setSelected(0)
    document.body.classList.add('is-locked')
    const t = window.setTimeout(() => inputRef.current?.focus(), 30)
    return () => {
      window.clearTimeout(t)
      document.body.classList.remove('is-locked')
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    setSelected(0)
  }, [query])

  if (!open) return null

  const runAt = (index: number) => {
    const cmd = filtered[index]
    if (!cmd) return
    cmd.run()
    onClose()
  }

  const onKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = (selected + 1) % Math.max(filtered.length, 1)
      setSelected(next)
      scrollSelected(next)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = (selected - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1)
      setSelected(prev)
      scrollSelected(prev)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      runAt(selected)
    }
  }

  const scrollSelected = (index: number) => {
    const list = listRef.current
    const item = list?.children[index] as HTMLElement | undefined
    item?.scrollIntoView({ block: 'nearest' })
  }

  return (
    <div className="cmdk" role="dialog" aria-modal="true" aria-label="Command palette">
      <div className="cmdk__backdrop" onClick={onClose} />
      <div className="cmdk__panel">
        <div className="cmdk__field">
          <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>›</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Jump to a section, copy the email, switch colours…"
            aria-label="Search commands"
            role="combobox"
            aria-expanded="true"
            aria-controls="cmdk-list"
            aria-activedescendant={filtered[selected] ? `cmd-${filtered[selected].id}` : undefined}
          />
          <span className="cmdk__hint">esc</span>
        </div>

        <ul className="cmdk__list" id="cmdk-list" role="listbox" ref={listRef}>
          {filtered.map((cmd, i) => (
            <li key={cmd.id} role="option" aria-selected={i === selected} id={`cmd-${cmd.id}`}>
              <button
                className="cmdk__item"
                aria-selected={i === selected}
                onMouseEnter={() => setSelected(i)}
                onClick={() => runAt(i)}
              >
                <span className="cmdk__ico">{cmd.icon}</span>
                {cmd.label}
                <small>{cmd.hint}</small>
              </button>
            </li>
          ))}
          {!filtered.length ? (
            <li className="cmdk__none">No command matches “{query}”.</li>
          ) : null}
        </ul>

        <div className="cmdk__foot">
          <span>↑↓ navigate</span>
          <span>↵ run</span>
          <span>⌘K toggle</span>
        </div>
      </div>
    </div>
  )
}
