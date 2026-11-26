import type { CSSProperties, ReactNode } from 'react'

export function Reveal({
  children,
  i = 0,
  className = '',
  style,
}: {
  children: ReactNode
  i?: number
  className?: string
  style?: CSSProperties
}) {
  return (
    <div
      data-reveal
      className={className}
      style={{ ...style, '--i': i } as CSSProperties}
    >
      {children}
    </div>
  )
}

export function SectionHead({
  index,
  title,
  lede,
}: {
  index: string
  title: ReactNode
  lede?: string
}) {
  return (
    <header className="section__head">
      <Reveal className="section__index">{index}</Reveal>
      <div>
        <Reveal i={1}>
          <h2 className="section__title">{title}</h2>
        </Reveal>
        {lede ? (
          <Reveal i={2}>
            <p className="section__lede">{lede}</p>
          </Reveal>
        ) : null}
      </div>
    </header>
  )
}

export function Arrow({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4 12L12 4M12 4H5.5M12 4v6.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Star() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 1.5l1.9 4.1 4.4.6-3.2 3.1.8 4.4L8 11.6 4.1 13.7l.8-4.4L1.7 6.2l4.4-.6L8 1.5z" />
    </svg>
  )
}

export function Fork() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="4" cy="3" r="1.7" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="12" cy="3" r="1.7" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="8" cy="13" r="1.7" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4 4.7v1.6c0 1 .8 1.8 1.8 1.8h4.4c1 0 1.8-.8 1.8-1.8V4.7M8 8.1V11.3" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

export function Refresh() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M13.5 8a5.5 5.5 0 1 1-1.7-4M13.5 2v3.2h-3.2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Copy() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="5.5" y="5.5" width="8" height="8" rx="1.6" stroke="currentColor" strokeWidth="1.3" />
      <path d="M10.5 5.5v-1a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h1" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}

export function Check() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8.5l3.2 3.2L13 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Close() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.5 3.5l9 9m0-9l-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function DownArrow() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 3v10M3.8 8.8L8 13l4.2-4.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
