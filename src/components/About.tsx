import { useEffect, useRef, useState } from 'react'
import { site, stats, timeline } from '../config'
import { useCountUp } from '../hooks'
import { Reveal, SectionHead } from './ui'

function Stat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) {
      setSeen(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const n = useCountUp(value, seen)

  return (
    <div className="stat" ref={ref}>
      <span className="stat__value">
        {n}
        {suffix}
      </span>
      <span className="stat__label">{label}</span>
    </div>
  )
}

export function About() {
  return (
    <section className="section" id="about">
      <div className="container">
        <SectionHead
          index="01 — About"
          title={
            <>
              Design engineer, <em>occasional</em> hermit.
            </>
          }
          lede="Half design, half engineering, permanently suspicious of anything that only looks good in a screenshot."
        />

        <div className="about">
          <div>
            <Reveal className="prose">
              {site.bio.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </Reveal>

            <Reveal i={1}>
              <div className="stats">
                {stats.map((s) => (
                  <Stat key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal i={2}>
            <ol className="timeline">
              {timeline.map((item) => (
                <li key={item.title}>
                  <span className="timeline__year">{item.year}</span>
                  <h3>{item.title}</h3>
                  <span className="timeline__place">{item.place}</span>
                  <p>{item.body}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
