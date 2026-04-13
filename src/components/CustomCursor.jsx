import { useEffect, useRef, useState } from "react"
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js"

const INTERACTIVE_SELECTOR = [
  "a[href]",
  "button",
  '[role="button"]',
  '[role="tab"]',
  "summary",
  "input:not([type='hidden'])",
  "textarea",
  "select",
  "label[for]",
  ".btn-editorial",
  ".btn-editorial-solid",
  ".btn-hero-primary",
  ".btn-hero-ghost",
  "[data-cursor-hover]",
].join(", ")

/**
 * Cursor editorial (solo pointer fino + escritorio). Respeta prefers-reduced-motion.
 */
export default function CustomCursor() {
  const reduced = usePrefersReducedMotion()
  const [active, setActive] = useState(false)
  const [hover, setHover] = useState(false)
  const rootRef = useRef(null)
  const pos = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })
  const rafRef = useRef(0)

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)")
    const wide = window.matchMedia("(min-width: 1024px)")
    const sync = () => {
      setActive(wide.matches && fine.matches && !reduced)
    }
    sync()
    wide.addEventListener("change", sync)
    fine.addEventListener("change", sync)
    return () => {
      wide.removeEventListener("change", sync)
      fine.removeEventListener("change", sync)
    }
  }, [reduced])

  useEffect(() => {
    if (!active) {
      document.documentElement.classList.remove("has-custom-cursor")
      return
    }
    document.documentElement.classList.add("has-custom-cursor")

    const onMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY }
      const el = document.elementFromPoint(e.clientX, e.clientY)
      setHover(Boolean(el?.closest?.(INTERACTIVE_SELECTOR)))
    }

    const onLeave = () => {
      setHover(false)
    }

    const tick = () => {
      const k = 0.14
      pos.current.x += (target.current.x - pos.current.x) * k
      pos.current.y += (target.current.y - pos.current.y) * k
      const el = rootRef.current
      if (el) {
        el.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    window.addEventListener("mousemove", onMove, { passive: true })
    document.addEventListener("mouseleave", onLeave)
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      document.documentElement.classList.remove("has-custom-cursor")
      window.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseleave", onLeave)
      cancelAnimationFrame(rafRef.current)
    }
  }, [active])

  if (!active) return null

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed left-0 top-0 z-10050 -translate-x-1/2 -translate-y-1/2 will-change-transform"
      aria-hidden
    >
      <div className="relative flex h-10 w-10 items-center justify-center">
        <span
          className={`absolute rounded-full border border-[#0a0a0a]/30 bg-transparent transition-[width,height,border-color] duration-300 ease-out ${
            hover ? "h-10 w-10 border-[#0a0a0a]/50" : "h-7 w-7"
          }`}
        />
        <span className="relative z-1 h-1 w-1 rounded-full bg-[#0a0a0a]" />
      </div>
    </div>
  )
}
