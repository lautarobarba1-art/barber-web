const PREFIX = "barberia_"

export const KEYS = {
  USERS: `${PREFIX}users`,
  SESSION: `${PREFIX}session`,
  BOOKINGS: `${PREFIX}bookings`,
}

export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw == null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function removeKey(key) {
  localStorage.removeItem(key)
}
