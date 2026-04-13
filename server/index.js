import cors from "cors"
import express from "express"
import { authRouter } from "./routes/auth.js"
import { bookingsRouter } from "./routes/bookings.js"

const app = express()
const PORT = Number(process.env.PORT) || 3000

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || true,
    credentials: true,
  }),
)
app.use(express.json())

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "barberia-api" })
})

app.use("/api/auth", authRouter)
app.use("/api/bookings", bookingsRouter)

app.use((err, _req, res, next) => {
  void next
  console.error(err)
  res.status(500).json({ error: "Error interno del servidor." })
})

app.listen(PORT, () => {
  console.log(`API barbería en http://localhost:${PORT}`)
})
