import { useState } from 'react'
import { site } from '../config'
import { useClock } from '../hooks'
import { Arrow, Check, Copy, Reveal } from './ui'

type CopyTarget = 'email' | 'phone' | null

export function Contact() {
  const [copied, setCopied] = useState<CopyTarget>(null)

  const copy = async (kind: Exclude<CopyTarget, null>) => {
    const value = kind === 'email' ? site.email : site.phone
    try {
      await navigator.clipboard.writeText(value)
      setCopied(kind)
      window.setTimeout(() => setCopied(null), 2200)
    } catch {
      window.location.href = kind === 'email' ? `mailto:${site.email}` : `tel:${site.phoneHref}`
    }
  }

  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="contact">
          <div>
            <Reveal className="section__index" style={{ marginBottom: '1.2rem' }}>
              06 — Contact
            </Reveal>
            <Reveal i={1}>
              <h2 className="contact__title">
                Got something <em>worth</em> making?
              </h2>
            </Reveal>
            <Reveal i={2}>
              <p className="section__lede" style={{ marginTop: '1.2rem' }}>
                Email or call — whichever you prefer. I reply fastest to a short paragraph about the
                problem, not a deck.
              </p>
            </Reveal>

            <Reveal i={3}>
              <div className="contact__lines">
                <a className="contact__line" href={`mailto:${site.email}`}>
                  <span className="mono">Email</span>
                  <span className="contact__value">{site.email}</span>
                  <Arrow />
                </a>
                <a className="contact__line" href={`tel:${site.phoneHref}`}>
                  <span className="mono">Phone</span>
                  <span className="contact__value">{site.phone}</span>
                  <Arrow />
                </a>
              </div>
            </Reveal>

            <Reveal i={4}>
              <div className="contact__copies">
                <button
                  className={`contact__copy${copied === 'email' ? ' is-done' : ''}`}
                  onClick={() => copy('email')}
                  aria-live="polite"
                >
                  {copied === 'email' ? <Check /> : <Copy />}
                  {copied === 'email' ? 'email copied' : 'copy email'}
                </button>
                <button
                  className={`contact__copy${copied === 'phone' ? ' is-done' : ''}`}
                  onClick={() => copy('phone')}
                  aria-live="polite"
                >
                  {copied === 'phone' ? <Check /> : <Copy />}
                  {copied === 'phone' ? 'number copied' : 'copy number'}
                </button>
              </div>
            </Reveal>
          </div>

          <Reveal i={2}>
            <div className="socials">
              {site.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                >
                  <span className="socials__label">{social.label}</span>
                  <span className="socials__handle">
                    {social.handle} <Arrow size={11} />
                  </span>
                </a>
              ))}
              <div className="socials__add">
                <span className="socials__label" style={{ color: 'var(--muted)' }}>
                  More links
                </span>
                <span className="socials__handle">add in src/config.ts →</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  const time = useClock(site.timezone)

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <span className="footer__clock">
          <i /> {site.location} · {time}
        </span>
        <span>Built with React, no tracking, and a live GitHub API.</span>
        <a className="to-top" href="#top">
          back to top ↑
        </a>
      </div>
    </footer>
  )
}
