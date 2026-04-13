import { useState } from "react"
import {
  validateEmail,
  validatePassword,
} from "../utils/auth.js"
import { useAuth } from "../hooks/useAuth.js"
import EditorialGrain from "./EditorialGrain.jsx"

export default function AuthModal({ isOpen, onClose }) {
  const { login, register } = useAuth()
  const [mode, setMode] = useState("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)

  if (!isOpen) return null

  function resetForm() {
    setError("")
    setSent(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    resetForm()
    if (!validateEmail(email)) {
      setError("Ingresá un email válido.")
      return
    }
    if (!validatePassword(password)) {
      setError("La contraseña debe tener al menos 6 caracteres.")
      return
    }
    setBusy(true)
    try {
      if (mode === "register") {
        if (!name.trim()) {
          setError("El nombre es obligatorio.")
          return
        }
        const r = await register(name, email, password)
        if (!r.ok) {
          setError(r.error)
          return
        }
      } else {
        const r = await login(email, password)
        if (!r.ok) {
          setError(r.error)
          return
        }
      }
      setSent(true)
      setTimeout(() => {
        onClose?.()
        setName("")
        setEmail("")
        setPassword("")
        setMode("login")
        setSent(false)
      }, 400)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-500 flex flex-col bg-[#f2f1ec]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <EditorialGrain />
      <div className="relative z-10 flex min-h-full flex-col">
        <div className="flex items-start justify-between border-b border-black/10 px-6 py-6 md:px-12 lg:px-20">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.45em] text-black/35">
              Acceso
            </p>
            <h2
              id="auth-modal-title"
              className="font-display mt-4 text-[clamp(1.75rem,5vw,3rem)] font-normal uppercase tracking-[0.02em] text-black"
            >
              {mode === "login" ? "Entrar" : "Registro"}
            </h2>
          </div>
          <button
            type="button"
            className="border border-black/15 bg-transparent px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-black/60 transition-opacity hover:opacity-70"
            onClick={onClose}
            aria-label="Cerrar"
          >
            Cerrar
          </button>
        </div>

        <div className="flex flex-1 flex-col px-6 pb-20 pt-10 md:px-12 md:pt-14 lg:px-20 lg:pl-28">
          <div className="mb-12 flex flex-wrap gap-3" role="tablist" aria-label="Modo de acceso">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "login"}
              className={`rounded-none border px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.35em] transition-opacity ${
                mode === "login"
                  ? "border-black bg-black text-[#f2f1ec]"
                  : "border-black/15 bg-transparent text-black/45 hover:opacity-80"
              }`}
              onClick={() => {
                setMode("login")
                setError("")
              }}
            >
              Login
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "register"}
              className={`rounded-none border px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.35em] transition-opacity ${
                mode === "register"
                  ? "border-black bg-black text-[#f2f1ec]"
                  : "border-black/15 bg-transparent text-black/45 hover:opacity-80"
              }`}
              onClick={() => {
                setMode("register")
                setError("")
              }}
            >
              Nuevo usuario
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate className="max-w-md">
            {mode === "register" && (
              <div className="mb-8">
                <label htmlFor="auth-name" className="mb-2 block text-[10px] uppercase tracking-[0.4em] text-black/40">
                  Nombre
                </label>
                <input
                  id="auth-name"
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-b border-black/15 bg-transparent py-3 text-[13px] tracking-[0.08em] text-black outline-none transition-opacity focus:border-black/40"
                />
              </div>
            )}
            <div className="mb-8">
              <label htmlFor="auth-email" className="mb-2 block text-[10px] uppercase tracking-[0.4em] text-black/40">
                Email
              </label>
              <input
                id="auth-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b border-black/15 bg-transparent py-3 text-[13px] tracking-[0.08em] text-black outline-none transition-opacity focus:border-black/40"
              />
            </div>
            <div className="mb-8">
              <label htmlFor="auth-password" className="mb-2 block text-[10px] uppercase tracking-[0.4em] text-black/40">
                Contraseña
              </label>
              <input
                id="auth-password"
                name="password"
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-black/15 bg-transparent py-3 text-[13px] tracking-[0.08em] text-black outline-none transition-opacity focus:border-black/40"
              />
            </div>
            {error ? (
              <p className="mb-6 text-[12px] tracking-wide text-black/55" role="alert">
                {error}
              </p>
            ) : null}
            {sent ? (
              <p className="mb-6 text-[11px] uppercase tracking-[0.35em] text-black/40" role="status">
                Listo.
              </p>
            ) : null}
            <button type="submit" className="btn-editorial-solid" disabled={busy}>
              {mode === "login" ? "Confirmar" : "Crear cuenta"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
