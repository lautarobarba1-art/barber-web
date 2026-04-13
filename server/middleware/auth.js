import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production"

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

export function authRequired(req, res, next) {
  const h = req.headers.authorization || ""
  const m = h.match(/^Bearer\s+(.+)$/i)
  const token = m?.[1]
  if (!token) {
    return res.status(401).json({ error: "No autorizado." })
  }
  const payload = verifyToken(token)
  if (!payload?.sub) {
    return res.status(401).json({ error: "Token inválido o expirado." })
  }
  req.userId = Number(payload.sub)
  next()
}
