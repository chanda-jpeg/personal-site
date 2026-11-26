import { useEffect, useRef } from 'react'
import { useFinePointer } from '../hooks'

/** A lagging ring + instant dot. Skipped on touch and reduced-motion setups. */
export function Cursor() {
  const fine = useFinePointer()
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!fine) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const soft = { ...target }
    let raf = 0
    let visible = false

    const move = (e: PointerEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      if (!visible) {
        visible = true
        if (dot.current) dot.current.style.opacity = '1'
        if (ring.current) ring.current.style.opacity = '1'
      }
      if (dot.current) {
        dot.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
      }
      const hot = (e.target as HTMLElement | null)?.closest(
        'a, button, [data-cursor="hot"], input, select',
      )
      ring.current?.classList.toggle('is-hot', Boolean(hot))
    }

    const loop = () => {
      soft.x += (target.x - soft.x) * 0.14
      soft.y += (target.y - soft.y) * 0.14
      if (ring.current) {
        ring.current.style.transform = `translate3d(${soft.x}px, ${soft.y}px, 0)`
      }
      raf = requestAnimationFrame(loop)
    }

    const leave = () => {
      visible = false
      if (dot.current) dot.current.style.opacity = '0'
      if (ring.current) ring.current.style.opacity = '0'
    }

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
      cancelAnimationFrame(raf)
    }
  }, [fine])

  if (!fine) return null

  return (
    <>
      <div ref={ring} className="cursor cursor--ring" style={{ opacity: 0 }} aria-hidden="true" />
      <div ref={dot} className="cursor cursor--dot" style={{ opacity: 0 }} aria-hidden="true" />
    </>
  )
}
