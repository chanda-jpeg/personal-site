import { useState } from 'react'
import { site } from '../config'
import { useClock } from '../hooks'
import { Arrow, Check, Copy, Reveal } from './ui'

export function Contact() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      window.location.href = `mailto:${site.email}`
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
                I take on two or three engagements a quarter: product interfaces, design systems,
                and the occasional unreasonably ambitious prototype. Send a paragraph, not a deck.
              </p>
            </Reveal>
            <Reveal i={3}>
              <a className="contact__mail" href={`mailto:${site.email}`}>
                {site.email} <Arrow />
              </a>
            </Reveal>
            <Reveal i={4}>
              <button
                className={`contact__copy${copied ? ' is-done' : ''}`}
                onClick={copy}
                aria-live="polite"
              >
                {copied ? <Check /> : <Copy />}
                {copied ? 'address copied' : 'copy address'}
              </button>
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
        <span>
          Built with React, no tracking, and a live GitHub API.
        </span>
        <a className="to-top" href="#top">
          back to top ↑
        </a>
      </div>
    </footer>
  )
}
