import { site } from '../config'

const links = [
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'github', label: 'GitHub' },
  { id: 'contact', label: 'Contact' },
]

export function Nav({
  active,
  progress,
  onOpenPalette,
}: {
  active: string
  progress: number
  onOpenPalette: () => void
}) {
  return (
    <header className="nav">
      <div className="nav__inner">
        <a className="brand" href="#top" aria-label={`${site.name} — back to top`}>
          <span className="brand__mark">{site.initials}</span>
          <span>
            {site.name}
            <span style={{ color: 'var(--muted)' }}> / design engineer</span>
          </span>
        </a>

        <nav className="nav__links" aria-label="Sections">
          {links.map((link) => (
            <a
              key={link.id}
              className={`nav__link${active === link.id ? ' is-active' : ''}`}
              href={`#${link.id}`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <button className="kbd" onClick={onOpenPalette} aria-label="Open command palette">
            <span className="kbd__cap">⌘</span>
            <span className="kbd__cap">K</span>
          </button>
          <a className="kbd" href={`mailto:${site.email}`} style={{ paddingInline: '0.7rem' }}>
            Say hi
          </a>
        </div>
      </div>
      <div className="nav__progress" aria-hidden="true">
        <span style={{ width: `${progress * 100}%` }} />
      </div>
    </header>
  )
}
