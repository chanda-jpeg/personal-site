import { useEffect, useState } from 'react'
import { site, type PaletteId } from './config'
import { useActiveSection, usePersisted, useReveal, useScrollProgress } from './hooks'
import { Cursor } from './components/Cursor'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Work } from './components/Work'
import { Skills } from './components/Skills'
import { GitHubPanel } from './components/GitHubPanel'
import { PaletteLab } from './components/PaletteLab'
import { Contact, Footer } from './components/Contact'
import { CommandPalette } from './components/CommandPalette'

const SECTION_IDS = ['top', 'work', 'about', 'skills', 'github', 'palette', 'contact']

export default function App() {
  const [palette, setPalette] = usePersisted<PaletteId>('kn:palette', 'aubergine')
  const [paletteOpen, setPaletteOpen] = useState(false)
  const progress = useScrollProgress()
  const active = useActiveSection(SECTION_IDS)

  useReveal()

  useEffect(() => {
    document.documentElement.dataset.palette = palette
  }, [palette])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <a className="skip" href="#work">
        Skip to work
      </a>
      <div className="grain" aria-hidden="true" />
      <Cursor />
      <Nav active={active} progress={progress} onOpenPalette={() => setPaletteOpen(true)} />

      <main>
        <Hero />
        <Work />
        <About />
        <Skills />
        <GitHubPanel />
        <PaletteLab palette={palette} onPalette={setPalette} />
        <Contact />
      </main>

      <Footer />
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onPalette={setPalette}
      />
      <span className="sr-only">Site owner: {site.name}</span>
    </>
  )
}
