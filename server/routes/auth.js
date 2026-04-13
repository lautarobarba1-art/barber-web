import { Router } from "express"
import bcrypt from "bcryptjs"
import { nextUserId, readStore, writeStore } from "../store.js"
import { authRequired, signToken, verifyToken } from "../middleware/auth.js"

export const authRouter = Router()

authRouter.post("/register", (req, res) => {
  const { name, email, password } = req.body || {}
  if (!name?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ error: "Datos incompletos." })
  }
  if (String(password).length < 6) {
    return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres." })
  }
  const emailNorm = String(email).trim().toLowerCase()
  const store = readStore()
  if (store.users.some((u) => u.email === emailNorm)) {
    return res.status(409).json({ error: "Ese email ya está registrado." })
  }
  const hash = bcrypt.hashSync(String(password), 10)
  const created_at = new Date().toISOString()
  const id = nextUserId(store.users)
  const user = { id, name: name.trim(), email: emailNorm, password_hash: hash, created_at }
  store.users.push(user)
  writeStore(store)
  const publicUser = { id: user.id, name: user.name, email: user.email }
  const token = signToken({ sub: String(publicUser.id) })
  res.status(201).json({ user: { ...publicUser, token }, token })
})

authRouter.post("/login", (req, res) => {
  const { email, password } = req.body || {}
  if (!email?.trim() || !password) {
    return res.status(400).json({ error: "Email y contraseña requeridos." })
  }
  const emailNorm = String(email).trim().toLowerCase()
  const store = readStore()
  const row = store.users.find((u) => u.email === emailNorm)
  if (!row || !bcrypt.compareSync(String(password), row.password_hash)) {
    return res.status(401).json({ error: "Email o contraseña incorrectos." })
  }
  const user = { id: row.id, name: row.name, email: row.email }
  const token = signToken({ sub: String(user.id) })
  res.json({ user: { ...user, token }, token })
})

authRouter.get("/me", authRequired, (req, res) => {
  const store = readStore()
  const row = store.users.find((u) => u.id === req.userId)
  if (!row) {
    return res.status(404).json({ error: "Usuario no encontrado." })
  }
  const h = req.headers.authorization || ""
  const m = h.match(/^Bearer\s+(.+)$/i)
  const token = m?.[1] || ""
  res.json({ user: { id: row.id, name: row.name, email: row.email, token } })
})

authRouter.get("/verify", (req, res) => {
  const h = req.headers.authorization || ""
  const m = h.match(/^Bearer\s+(.+)$/i)
  const token = m?.[1]
  if (!token) return res.status(401).json({ ok: false })
  const payload = verifyToken(token)
  res.json({ ok: Boolean(payload?.sub) })
})
