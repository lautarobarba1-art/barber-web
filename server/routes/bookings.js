import { randomUUID } from "node:crypto"
import { Router } from "express"
import { readStore, writeStore } from "../store.js"
import { authRequired } from "../middleware/auth.js"

export const bookingsRouter = Router()

function rowToBooking(row) {
  return {
    id: row.id,
    userId: row.user_id,
    serviceId: row.service_id,
    serviceName: row.service_name,
    barberId: row.barber_id,
    barberName: row.barber_name,
    date: row.date,
    time: row.time,
    status: row.status,
    createdAt: row.created_at,
  }
}

bookingsRouter.get("/taken", (req, res) => {
  const barberId = Number(req.query.barberId)
  const date = req.query.date
  const exclude = req.query.excludeBookingId || null
  if (!barberId || !date) {
    return res.status(400).json({ error: "barberId y date son obligatorios." })
  }
  const store = readStore()
  const times = store.bookings
    .filter(
      (b) =>
        b.barber_id === barberId &&
        b.date === date &&
        b.status === "confirmado" &&
        b.id !== exclude,
    )
    .map((b) => b.time)
  res.json({ times })
})

bookingsRouter.get("/", authRequired, (req, res) => {
  const store = readStore()
  const rows = store.bookings
    .filter((b) => b.user_id === req.userId)
    .sort((a, b) => {
      const da = `${a.date}T${a.time}`
      const db = `${b.date}T${b.time}`
      return da.localeCompare(db)
    })
  res.json({ bookings: rows.map(rowToBooking) })
})

bookingsRouter.post("/", authRequired, (req, res) => {
  const b = req.body || {}
  const {
    serviceId,
    serviceName,
    barberId,
    barberName,
    date,
    time,
  } = b
  if (
    serviceId == null ||
    !serviceName ||
    barberId == null ||
    !barberName ||
    !date ||
    !time
  ) {
    return res.status(400).json({ error: "Faltan datos del turno." })
  }
  const store = readStore()
  const clash = store.bookings.some(
    (x) =>
      x.barber_id === Number(barberId) &&
      x.date === String(date) &&
      x.time === String(time) &&
      x.status === "confirmado",
  )
  if (clash) {
    return res.status(409).json({ error: "Ese horario ya está ocupado." })
  }
  const id = randomUUID()
  const created_at = new Date().toISOString()
  const row = {
    id,
    user_id: req.userId,
    service_id: Number(serviceId),
    service_name: String(serviceName),
    barber_id: Number(barberId),
    barber_name: String(barberName),
    date: String(date),
    time: String(time),
    status: "confirmado",
    created_at,
  }
  store.bookings.push(row)
  writeStore(store)
  res.status(201).json({ booking: rowToBooking(row) })
})

bookingsRouter.patch("/:id/cancel", authRequired, (req, res) => {
  const id = req.params.id
  const store = readStore()
  const idx = store.bookings.findIndex((b) => b.id === id && b.user_id === req.userId)
  if (idx === -1) {
    return res.status(404).json({ error: "Turno no encontrado." })
  }
  if (store.bookings[idx].status !== "confirmado") {
    return res.status(400).json({ error: "El turno no se puede cancelar." })
  }
  store.bookings[idx] = { ...store.bookings[idx], status: "cancelado" }
  writeStore(store)
  res.json({ ok: true })
})

bookingsRouter.patch("/:id/reschedule", authRequired, (req, res) => {
  const id = req.params.id
  const { date, time } = req.body || {}
  if (!date || !time) {
    return res.status(400).json({ error: "Fecha y hora requeridas." })
  }
  const store = readStore()
  const idx = store.bookings.findIndex(
    (b) => b.id === id && b.user_id === req.userId && b.status === "confirmado",
  )
  if (idx === -1) {
    return res.status(404).json({ error: "Turno no encontrado." })
  }
  const current = store.bookings[idx]
  const clash = store.bookings.some(
    (b) =>
      b.barber_id === current.barber_id &&
      b.date === String(date) &&
      b.time === String(time) &&
      b.status === "confirmado" &&
      b.id !== id,
  )
  if (clash) {
    return res.status(409).json({ error: "Horario ocupado." })
  }
  store.bookings[idx] = {
    ...current,
    date: String(date),
    time: String(time),
  }
  writeStore(store)
  res.json({ booking: rowToBooking(store.bookings[idx]) })
})
