import { KEYS, loadJSON, removeKey } from "../utils/storage.js"
import { apiUrl } from "./config.js"

export function getStoredSession() {
  return loadJSON(KEYS.SESSION, null)
}

/**
 * @param {string} path ej. /api/auth/login
 * @param {RequestInit} [options]
 */
export async function apiFetch(path, options = {}) {
  const session = getStoredSession()
  const headers = new Headers(options.headers)
  if (!headers.has("Content-Type") && options.body != null) {
    headers.set("Content-Type", "application/json")
  }
  if (session?.token) {
    headers.set("Authorization", `Bearer ${session.token}`)
  }

  const url = apiUrl(path)
  const res = await fetch(url, { ...options, headers })
  const text = await res.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = { error: text || "Respuesta inválida" }
  }
  if (!res.ok) {
    const msg = data?.error || res.statusText || "Error de red"
    const err = new Error(msg)
    err.status = res.status
    throw err
  }
  return data
}

export function clearSessionStorage() {
  removeKey(KEYS.SESSION)
}
