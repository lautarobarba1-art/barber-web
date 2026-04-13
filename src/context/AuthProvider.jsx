import { startTransition, useCallback, useEffect, useMemo, useState } from "react"
import { fetchMe, loginRequest, registerRequest } from "../api/authApi.js"
import { clearSessionStorage, getStoredSession } from "../api/http.js"
import { KEYS, loadJSON, saveJSON } from "../utils/storage.js"
import { AuthContext } from "./auth-context.js"

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [sessionChecked, setSessionChecked] = useState(false)

  useEffect(() => {
    const s = loadJSON(KEYS.SESSION, null)
    if (!s?.token) {
      startTransition(() => setSessionChecked(true))
      return
    }
    fetchMe()
      .then((u) => {
        setUser({
          id: u.id,
          name: u.name,
          email: u.email,
          token: s.token,
        })
      })
      .catch(() => {
        clearSessionStorage()
        setUser(null)
      })
      .finally(() => startTransition(() => setSessionChecked(true)))
  }, [])

  const login = useCallback(async (email, password) => {
    const result = await loginRequest(email, password)
    if (result.ok) setUser(result.user)
    return result
  }, [])

  const register = useCallback(async (name, email, password) => {
    const result = await registerRequest(name, email, password)
    if (result.ok) setUser(result.user)
    return result
  }, [])

  const logout = useCallback(() => {
    clearSessionStorage()
    setUser(null)
  }, [])

  const refreshSession = useCallback(async () => {
    const s = getStoredSession()
    if (!s?.token) {
      setUser(null)
      return
    }
    try {
      const u = await fetchMe()
      const next = {
        id: u.id,
        name: u.name,
        email: u.email,
        token: s.token,
      }
      setUser(next)
      saveJSON(KEYS.SESSION, { token: s.token, user: next })
    } catch {
      clearSessionStorage()
      setUser(null)
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      sessionChecked,
      login,
      register,
      logout,
      refreshSession,
    }),
    [user, sessionChecked, login, register, logout, refreshSession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
