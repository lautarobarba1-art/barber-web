import { startTransition, useCallback, useEffect, useMemo, useState } from "react"
import {
  cancelBookingRequest,
  fetchMyBookings,
  fetchTakenTimes,
  rescheduleBookingRequest,
} from "../api/bookingsApi.js"
import { useAuth } from "../hooks/useAuth.js"
import {
  getBookingDates,
  getSlotsForBarber,
  toISODate,
} from "../data/schedule.js"
import { filterPast, filterUpcoming } from "../utils/booking-utils.js"
import { formatDateLong, formatPrice } from "../utils/formatters.js"
import { services } from "../data/services.js"

export default function MisTurnos() {
  const { user } = useAuth()
  const [allBookings, setAllBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState("")

  const refreshList = useCallback(async () => {
    if (!user) return
    try {
      const list = await fetchMyBookings()
      setAllBookings(list)
      setLoadError("")
    } catch (e) {
      setLoadError(e.message)
    }
  }, [user])

  useEffect(() => {
    if (!user) return
    fetchMyBookings()
      .then((list) => {
        setAllBookings(list)
        setLoadError("")
      })
      .catch((e) => setLoadError(e.message))
      .finally(() => startTransition(() => setLoading(false)))
  }, [user])

  const upcoming = useMemo(
    () => (user ? filterUpcoming(allBookings, user.id) : []),
    [allBookings, user],
  )
  const past = useMemo(
    () => (user ? filterPast(allBookings, user.id) : []),
    [allBookings, user],
  )

  const [editingId, setEditingId] = useState(null)
  const [nextDate, setNextDate] = useState(null)
  const [nextTime, setNextTime] = useState(null)
  const [rescheduleError, setRescheduleError] = useState("")
  const [bookedRemote, setBookedRemote] = useState([])

  const todayISO = toISODate(new Date())
  const bookingDates = getBookingDates(todayISO, 14)

  const editing = upcoming.find((b) => b.id === editingId)

  useEffect(() => {
    if (!editing || !nextDate) {
      startTransition(() => setBookedRemote([]))
      return
    }
    let cancelled = false
    fetchTakenTimes(editing.barberId, nextDate, editing.id).then((times) => {
      if (!cancelled) startTransition(() => setBookedRemote(times))
    })
    return () => {
      cancelled = true
    }
  }, [editing, nextDate])

  const slotOptions = useMemo(() => {
    if (!editing || !nextDate) return []
    return getSlotsForBarber(editing.barberId, nextDate, bookedRemote)
  }, [editing, nextDate, bookedRemote])

  const effectiveTime =
    nextTime && slotOptions.includes(nextTime) ? nextTime : null

  function startEdit(b) {
    setEditingId(b.id)
    setNextDate(b.date)
    setNextTime(b.time)
    setRescheduleError("")
  }

  async function applyReschedule() {
    if (!user || !editing || !nextDate || !effectiveTime) return
    try {
      await rescheduleBookingRequest(editing.id, nextDate, effectiveTime)
      setEditingId(null)
      await refreshList()
    } catch (e) {
      setRescheduleError(e.message ?? "No se pudo reprogramar.")
    }
  }

  if (!user) return null

  return (
    <div className="page-enter mx-auto max-w-[1920px] px-5 py-12 md:px-10 md:py-16 lg:px-20">
      <h1 className="font-display mb-6 border-b border-black/10 pb-4 text-4xl font-normal uppercase tracking-[0.02em] text-black md:text-5xl">
        Mis turnos
      </h1>
      <p className="mb-10 max-w-[48ch] text-[12px] leading-relaxed tracking-[0.18em] text-black/50 md:mb-12 md:text-[13px]">
        Próximos turnos confirmados e historial reciente.
      </p>

      {loading ? (
        <p className="muted">Cargando…</p>
      ) : loadError ? (
        <p className="field-error" role="alert">
          {loadError}
        </p>
      ) : null}

      <section aria-labelledby="upcoming-title">
        <h2
          id="upcoming-title"
          className="font-display mb-4 text-2xl font-normal uppercase tracking-[0.04em] text-black"
        >
          Próximos
        </h2>
        {!loading && upcoming.length === 0 ? (
          <div className="empty-state">No tenés turnos próximos.</div>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {upcoming.map((b) => {
              const price = services.find((s) => s.id === b.serviceId)?.price
              return (
                <li key={b.id} className="booking-row">
                  <div>
                    <strong>{b.serviceName}</strong> · {b.barberName}
                    <div className="muted">
                      {formatDateLong(b.date)} · {b.time}
                      {price != null ? (
                        <>
                          {" · "}
                          <span className="font-price text-[12px] font-light tracking-[0.12em] text-black/70">
                            {formatPrice(price)}
                          </span>
                        </>
                      ) : null}
                    </div>
                    {editingId === b.id ? (
                      <div style={{ marginTop: "1rem" }}>
                        <p className="muted" style={{ marginBottom: "0.5rem" }}>
                          Nueva fecha y hora
                        </p>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
                            gap: "6px",
                            marginBottom: "0.75rem",
                          }}
                        >
                          {bookingDates.map((d) => {
                            const [yy, mm, dd] = d.split("-").map(Number)
                            const day = new Date(yy, mm - 1, dd).getDay()
                            const isSel = nextDate === d
                            return (
                              <button
                                key={d}
                                type="button"
                                className={`day-cell${isSel ? " is-selected" : ""}`}
                                onClick={() => {
                                  setNextDate(d)
                                  setNextTime(null)
                                }}
                              >
                                <span
                                  className="calendar-day-label"
                                  style={{ display: "block", marginBottom: "4px" }}
                                >
                                  {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"][day]}
                                </span>
                                {dd}
                              </button>
                            )
                          })}
                        </div>
                        {nextDate ? (
                          <div className="time-slots" role="list">
                            {slotOptions.map((t) => (
                              <button
                                key={t}
                                type="button"
                                className={`time-slot${effectiveTime === t ? " is-selected" : ""}`}
                                onClick={() => setNextTime(t)}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        ) : null}
                        {rescheduleError ? (
                          <p className="field-error" role="alert">
                            {rescheduleError}
                          </p>
                        ) : null}
                        <div className="booking-row__actions" style={{ marginTop: "0.75rem" }}>
                          <button type="button" className="btn btn-primary" onClick={applyReschedule}>
                            Guardar cambios
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() => setEditingId(null)}
                          >
                            Cancelar edición
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                  {editingId !== b.id ? (
                    <div className="booking-row__actions">
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => startEdit(b)}
                      >
                        Reprogramar
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={async () => {
                          try {
                            await cancelBookingRequest(b.id)
                            await refreshList()
                          } catch (e) {
                            console.error(e)
                          }
                        }}
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : null}
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <section style={{ marginTop: "3rem" }} aria-labelledby="past-title">
        <h2
          id="past-title"
          className="font-display mb-4 text-2xl font-normal uppercase tracking-[0.04em] text-black"
        >
          Historial
        </h2>
        {!loading && past.length === 0 ? (
          <div className="empty-state">Sin turnos pasados todavía.</div>
        ) : (
          <ul className="hours-list" style={{ maxWidth: "560px" }}>
            {past.map((b) => (
              <li key={b.id}>
                <span>
                  {b.serviceName} · {b.barberName}
                </span>
                <span>
                  {formatDateLong(b.date)} · {b.time}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
