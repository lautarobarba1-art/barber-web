import { forwardRef, useEffect, useRef, useState, useCallback } from "react"
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js"

/**
 * Reveal al scroll: opacidad + translateY (20px por defecto, suave).
 * `as` permite usar <section> u otro elemento semántico.
 */
const Reveal = forwardRef(function Reveal(
  {
    as = "div",
    children,
    className = "",
    delay = 0,
    threshold = 0.1,
    rootMargin = "0px 0px -6% 0px",
    style,
    ...rest
  },
  forwardedRef,
) {
  const As = as
  const localRef = useRef(null)
  const setRefs = useCallback(
    (node) => {
      localRef.current = node
      if (typeof forwardedRef === "function") forwardedRef(node)
      else if (forwardedRef) forwardedRef.current = node
    },
    [forwardedRef],
  )

  const [revealed, setRevealed] = useState(false)
  const reducedMotion = usePrefersReducedMotion()
  const visible = revealed || reducedMotion

  useEffect(() => {
    if (reducedMotion) return
    const el = localRef.current
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
      { threshold, rootMargin },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [reducedMotion, threshold, rootMargin])

  return (
    <As
      ref={setRefs}
      className={`reveal ${visible ? "reveal-visible" : ""} ${className}`.trim()}
      style={
        delay > 0 && visible
          ? { ...style, transitionDelay: `${delay}ms` }
          : style
      }
      {...rest}
    >
      {children}
    </As>
  )
})

export default Reveal
