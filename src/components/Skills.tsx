import type { CSSProperties } from 'react'
import { skills } from '../config'
import { Reveal, SectionHead } from './ui'

export function Skills() {
  return (
    <section className="section" id="skills">
      <div className="container">
        <SectionHead
          index="03 — Capability"
          title={
            <>
              The toolkit, <em>honestly</em> rated.
            </>
          }
          lede="Percentages are a silly metric, so read them as frequency of use rather than mastery. Hover a row for the caveat."
        />

        <div className="skills">
          {skills.map((skill, i) => (
            <div
              key={skill.name}
              className="skill"
              data-reveal
              style={{ '--i': i, '--level': `${skill.level}%` } as CSSProperties}
            >
              <span className="skill__num">{String(i + 1).padStart(2, '0')}</span>
              <span className="skill__name">{skill.name}</span>
              <span className="skill__note">{skill.note}</span>
              <span className="skill__bar">
                <span />
              </span>
            </div>
          ))}
        </div>

        <Reveal i={2}>
          <p className="palette-note" style={{ marginTop: '1.5rem' }}>
            Also fluent in: Figma variables, Storybook, Playwright, CI pipelines, and explaining to
            stakeholders why the button is 44px tall.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
