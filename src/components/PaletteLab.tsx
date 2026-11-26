import { palettes, type PaletteId } from '../config'
import { Reveal, SectionHead } from './ui'

export function PaletteLab({
  palette,
  onPalette,
}: {
  palette: PaletteId
  onPalette: (id: PaletteId) => void
}) {
  return (
    <section className="section" id="palette">
      <div className="container">
        <SectionHead
          index="05 — Colour"
          title={
            <>
              Pick the <em>mood</em>.
            </>
          }
          lede="Three niche schemes, each built around an unlikely pair rather than another slate-and-blue. Switching is instant, and your choice is remembered next visit."
        />

        <div className="palettes" role="group" aria-label="Colour scheme">
          {palettes.map((p, i) => (
            <Reveal key={p.id} i={i}>
              <button
                className={`palette${palette === p.id ? ' is-on' : ''}`}
                onClick={() => onPalette(p.id)}
                aria-pressed={palette === p.id}
              >
                <span className="palette__swatches" aria-hidden="true">
                  {p.swatches.map((color) => (
                    <i key={color} style={{ background: color }} />
                  ))}
                </span>
                <span className="palette__name">{p.name}</span>
                <span className="palette__state">
                  {palette === p.id ? '● active' : '○ apply'}
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal i={3}>
          <p className="palette-note">
            Every scheme is defined as CSS custom properties on the document root, so one attribute
            (<code>data-palette</code>) re-skins the whole page — grain, cursor and gradients
            included. Add your own by appending to <code>palettes</code> in{' '}
            <code>src/config.ts</code> and a matching block in <code>src/styles.css</code>.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
