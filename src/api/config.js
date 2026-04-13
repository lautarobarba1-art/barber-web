/**
 * Base URL del backend (sin /api final). Vacío = mismo origen (proxy Vite en dev).
 * Producción: `VITE_API_URL=https://tu-dominio.com`
 */
export function apiUrl(path) {
  const base = import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? ""
  const p = path.startsWith("/") ? path : `/${path}`
  if (!base) return p
  return `${base}${p}`
}
