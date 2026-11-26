import { useEffect, useRef } from 'react'
import { site } from '../config'
import { useClock, useFinePointer } from '../hooks'
import { Arrow } from './ui'

export function Hero() {
  const fine = useFinePointer()
  const section = useRef<HTMLElement>(null)
  const orbit = useRef<HTMLDivElement>(null)
  const blobA = useRef<HTMLDivElement>(null)
  const blobB = useRef<HTMLDivElement>(null)
  const time = useClock(site.timezone)

  useEffect(() => {
    if (!fine) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = section.current
    if (!el) return

    let raf = 0
    const onMove = (e: PointerEvent) => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const rect = el.getBoundingClientRect()
        const nx = (e.clientX - rect.left) / rect.width - 0.5
        const ny = (e.clientY - rect.top) / rect.height - 0.5
        if (orbit.current) {
          orbit.current.style.transform = `translate3d(${nx * 16}px, ${ny * 16}px, 0) rotateX(${-ny * 7}deg) rotateY(${nx * 9}deg)`
        }
        if (blobA.current) {
          blobA.current.style.transform = `translate3d(${nx * -46}px, ${ny * -34}px, 0)`
        }
        if (blobB.current) {
          blobB.current.style.transform = `translate3d(${nx * 38}px, ${ny * 30}px, 0)`
        }
      })
    }

    el.addEventListener('pointermove', onMove)
    return () => {
      el.removeEventListener('pointermove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [fine])

  return (
    <section className="hero" id="top" ref={section}>
      <div className="hero__bg" aria-hidden="true">
        <div className="blob blob--a" ref={blobA} />
        <div className="blob blob--b" ref={blobB} />
      </div>

      <div className="container">
        <div className="hero__grid">
          <div>
            <span className="eyebrow">
              <i className="pulse" />
              {site.availability}
            </span>

            <h1 className="display">
              <span>{site.headline[0]}</span>
              <span>
                {site.headline[1]}
                <span className="display__rule" aria-hidden="true" />
              </span>
            </h1>

            <p className="hero__intro">{site.intro}</p>

            <div className="hero__actions">
              <a className="btn btn--solid" href="#work">
                See the work <Arrow />
              </a>
              <a className="btn" href={`https://github.com/${site.github.username}`} target="_blank" rel="noreferrer">
                Live from GitHub <span className="btn__arrow">↗</span>
              </a>
            </div>

            <div className="hero__meta">
              <span>
                <i /> {site.location}
              </span>
              <span>
                <i /> {time} local
              </span>
              <span>
                <i /> ⌘K to jump
              </span>
            </div>
          </div>

          <div className="hero__visual" aria-hidden="true">
            <div className="orbit" ref={orbit}>
              <div className="orbit__ring" />
              <div className="orbit__ring" />
              <div className="orbit__ring" />
              <div className="orbit__core">
                <span>{site.initials}</span>
              </div>
              <div className="orbit__sat" style={{ top: '6%', right: '18%' }} />
            </div>

            <div className="hero__card">
              <h4>Currently</h4>
              <ul>
                <li>
                  <span>building</span> <b>Sextant v2</b>
                </li>
                <li>
                  <span>reading</span> <b>The Craftsman</b>
                </li>
                <li>
                  <span>listening</span> <b>Yoshimura</b>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {[0, 1].map((copy) => (
            <span key={copy}>
              {site.roleWords.map((word) => (
                <span key={`${copy}-${word}`} style={{ marginRight: '2rem' }}>
                  {word}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
