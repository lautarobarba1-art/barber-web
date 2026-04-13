import { useEffect } from "react"
import { useLocation } from "react-router-dom"

/**
 * En una SPA el scroll no se reinicia al navegar. Al cambiar de ruta, vuelve arriba.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" })
  }, [pathname])

  return null
}
