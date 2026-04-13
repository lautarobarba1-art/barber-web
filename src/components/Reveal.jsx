import { useEffect, useRef, useState } from "react"
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js"

/**
 * Anima la entrada al entrar en el viewport (translate + fade).
 */
export default function Reveal({ children, className = "", delay = 0, threshold = 0.1 }) {
  const ref = useRef(null)
  const [revealed, setRevealed] = useState(false)
  const reducedMotion = usePrefersReducedMotion()
  const visible = revealed || reducedMotion

  useEffect(() => {
    if (reducedMotion) return
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true)
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold, rootMargin: "0px 0px -5% 0px" }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [reducedMotion, threshold])

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "reveal-visible" : ""} ${className}`.trim()}
      style={delay > 0 && visible ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
