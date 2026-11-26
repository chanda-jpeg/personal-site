import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { projects, type Project } from '../config'
import { Arrow, Close, Reveal, SectionHead } from './ui'

function WorkCard({ project, index, onOpen }: { project: Project; index: number; onOpen: () => void }) {
  const ref = useRef<HTMLButtonElement>(null)

  const onMove = (e: ReactPointerEvent) => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    el.style.setProperty('--mx', `${px * 100}%`)
    el.style.setProperty('--my', `${py * 100}%`)
    el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 5}deg) rotateY(${(px - 0.5) * 5}deg) translateY(-3px)`
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = ''
  }

  return (
    <button
      ref={ref}
      className="work-card"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onClick={onOpen}
      aria-label={`Open case study: ${project.title}`}
    >
      <div className="work-card__top">
        <span>0{index + 1} / {project.year}</span>
        <span>{project.role}</span>
      </div>
      <h3 className="work-card__title">{project.title}</h3>
      <p className="work-card__tagline">{project.tagline}</p>
      <div className="chips">
        {project.stack.map((tech) => (
          <span className="chip" key={tech}>
            {tech}
          </span>
        ))}
      </div>
      <div className="work-card__foot">
        <span>Case study</span>
        <span className="work-card__open">
          Read <Arrow size={12} />
        </span>
      </div>
    </button>
  )
}

function CaseModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    document.body.classList.add('is-locked')
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('is-locked')
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="case-title">
      <div className="modal__backdrop" onClick={onClose} />
      <div className="modal__panel">
        <button className="modal__close" onClick={onClose} aria-label="Close case study" ref={closeRef}>
          <Close />
        </button>
        <p className="modal__eyebrow">
          {project.year} — {project.role}
        </p>
        <h3 className="modal__title" id="case-title">
          {project.title}
        </h3>
        <div className="chips">
          {project.stack.map((tech) => (
            <span className="chip" key={tech}>
              {tech}
            </span>
          ))}
        </div>
        <p className="modal__body">{project.body}</p>
        <ul className="modal__list">
          {project.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
        <div className="modal__actions">
          <a className="btn btn--solid" href={project.href} target="_blank" rel="noreferrer">
            View the project <Arrow />
          </a>
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export function Work() {
  const [open, setOpen] = useState<Project | null>(null)

  return (
    <section className="section" id="work">
      <div className="container">
        <SectionHead
          index="02 — Selected work"
          title={
            <>
              Things I built and <em>kept</em> building.
            </>
          }
          lede="Four projects that survived the graveyard of side quests. Each card opens a short case study."
        />

        <div className="work__grid">
          {projects.map((project, i) => (
            <Reveal key={project.id} i={i}>
              <WorkCard project={project} index={i} onOpen={() => setOpen(project)} />
            </Reveal>
          ))}
        </div>
      </div>

      {open ? <CaseModal project={open} onClose={() => setOpen(null)} /> : null}
    </section>
  )
}
