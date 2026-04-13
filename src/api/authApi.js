import { apiFetch } from "./http.js"
import { KEYS, saveJSON } from "../utils/storage.js"

/**
 * @returns {{ ok: true, user: object } | { ok: false, error: string }}
 */
export async function loginRequest(email, password) {
  try {
    const data = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
    const user = {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      token: data.token,
    }
    saveJSON(KEYS.SESSION, { token: data.token, user })
    return { ok: true, user }
  } catch (e) {
    return { ok: false, error: e.message }
  }
}

/**
 * @returns {{ ok: true, user: object } | { ok: false, error: string }}
 */
export async function registerRequest(name, email, password) {
  try {
    const data = await apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    })
    const user = {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      token: data.token,
    }
    saveJSON(KEYS.SESSION, { token: data.token, user })
    return { ok: true, user }
  } catch (e) {
    return { ok: false, error: e.message }
  }
}

export async function fetchMe() {
  const data = await apiFetch("/api/auth/me")
  return data.user
}
