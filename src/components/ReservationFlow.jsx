import { useEffect, useMemo, useState } from "react"
import { createBooking, fetchTakenTimes } from "../api/bookingsApi.js"
import { services } from "../data/services.js"
import { team } from "../data/team.js"
import {
  getBookingDates,
  getSlotsForBarber,
  toISODate,
} from "../data/schedule.js"
import { formatDateLong, formatPrice } from "../utils/formatters.js"
import { useAuth } from "../hooks/useAuth.js"
import EditorialGrain from "./EditorialGrain.jsx"

const WEEKDAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

const STEPS = [
  { id: 1, label: "Servicio" },
  { id: 2, label: "Barbero" },
  { id: 3, label: "Día y hora" },
  { id: 4, label: "Confirmar" },
]

const dayCellClass = (active) =>
  [
    "min-h-[5.5rem] rounded-none border px-2 py-3 text-left text-[11px] font-medium uppercase tracking-[0.12em] transition-opacity duration-500",
    active
      ? "border-black bg-black text-[#f2f1ec]"
      : "border-black/15 bg-transparent text-black/70 hover:opacity-80",
  ].join(" ")

const slotBtnClass = (active) =>
  [
    "rounded-none border px-3 py-2 font-mono text-[11px] transition-opacity duration-500",
    active
      ? "border-black bg-black text-[#f2f1ec]"
      : "border-black/15 bg-transparent text-black/70 hover:opacity-80",
  ].join(" ")

export default function ReservationFlow({
  isOpen,
  onClose,
  initialServiceId = null,
  initialBarberId = null,
  onNeedAuth,
}) {
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [serviceId, setServiceId] = useState(() => initialServiceId ?? null)
  const [barberId, setBarberId] = useState(() => initialBarberId ?? null)
  const [dateISO, setDateISO] = useState(null)
  const [time, setTime] = useState(null)
  const [done, setDone] = useState(false)
  const [takenRemote, setTakenRemote] = useState([])
  const [confirmError, setConfirmError] = useState("")
  const [confirmBusy, setConfirmBusy] = useState(false)

  const todayISO = useMemo(() => toISODate(new Date()), [])
  const bookingDates = useMemo(
    () => getBookingDates(todayISO, 14),
    [todayISO],
  )

  const service = services.find((s) => s.id === serviceId)
  const barber = team.find((b) => b.id === barberId)

  useEffect(() => {
    if (!barberId || !dateISO) {
      setTakenRemote([])
      return
    }
    let cancelled = false
    fetchTakenTimes(barberId, dateISO).then((times) => {
      if (!cancelled) setTakenRemote(times)
    })
    return () => {
      cancelled = true
    }
  }, [barberId, dateISO])

  const slotOptions = useMemo(() => {
    if (!barberId || !dateISO) return []
    return getSlotsForBarber(barberId, dateISO, takenRemote)
  }, [barberId, dateISO, takenRemote])

  const effectiveTime =
    time && slotOptions.includes(time) ? time : null

  async function handleConfirm() {
    setConfirmError("")
    if (!user) {
      onNeedAuth?.()
      return
    }
    if (!service || !barber || !dateISO || !effectiveTime) return
    setConfirmBusy(true)
    try {
      await createBooking({
        serviceId: service.id,
        serviceName: service.name,
        barberId: barber.id,
        barberName: barber.name,
        date: dateISO,
        time: effectiveTime,
      })
      setDone(true)
    } catch (e) {
      setConfirmError(e.message || "No se pudo confirmar el turno.")
    } finally {
      setConfirmBusy(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[400] flex flex-col bg-[#f2f1ec]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reservation-title"
    >
      <EditorialGrain />
      <div className="relative z-10 flex min-h-full flex-1 flex-col overflow-hidden">
        <div className="flex shrink-0 items-start justify-between border-b border-black/10 px-6 py-6 md:px-12 lg:px-20">
          <div className="max-w-[min(100%,42rem)]">
            <p className="text-[10px] font-medium uppercase tracking-[0.45em] text-black/35">
              Reserva
            </p>
            <h2
              id="reservation-title"
              className="font-display mt-4 text-[clamp(1.75rem,4.5vw,2.75rem)] font-normal uppercase leading-none tracking-[0.02em] text-black"
            >
              Turno
            </h2>
          </div>
          <button
            type="button"
            className="shrink-0 border border-black/15 bg-transparent px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-black/60 transition-opacity hover:opacity-70"
            onClick={onClose}
            aria-label="Cerrar"
          >
            Cerrar
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-24 pt-10 md:px-12 md:pt-12 lg:px-20 lg:pl-24">
          <div className="mb-12 flex flex-wrap gap-2" aria-label="Pasos">
            {STEPS.map((s) => (
              <span
                key={s.id}
                className={`text-[9px] font-medium uppercase tracking-[0.42em] ${
                  step === s.id ? "text-black" : "text-black/30"
                }`}
              >
                {String(s.id).padStart(2, "0")} — {s.label}
              </span>
            ))}
          </div>

          <div className="max-w-3xl">
            {done ? (
              <div className="max-w-md">
                <p className="mb-10 text-[12px] leading-[1.9] tracking-[0.18em] text-black/50">
                  Turno confirmado. Lo verás en <strong className="font-semibold text-black">Mis turnos</strong>.
                </p>
                <button type="button" className="btn-editorial-solid" onClick={onClose}>
                  Cerrar
                </button>
              </div>
            ) : (
              <>
                {step === 1 && (
                  <div>
                    <p className="mb-10 text-[11px] uppercase tracking-[0.35em] text-black/40">
                      Elegí un servicio
                    </p>
                    <ul className="space-y-3">
                      {services.map((s) => (
                        <li key={s.id}>
                          <button
                            type="button"
                            className={`flex w-full items-center justify-between rounded-none border px-5 py-4 text-left transition-opacity duration-500 ${
                              serviceId === s.id
                                ? "border-black bg-black text-[#f2f1ec]"
                                : "border-black/15 bg-transparent text-black hover:opacity-80"
                            }`}
                            onClick={() => setServiceId(s.id)}
                          >
                            <span className="text-[12px] font-semibold uppercase tracking-[0.14em]">
                              {s.name}
                            </span>
                            <span className="font-price text-[12px] font-light tracking-[0.12em] opacity-90">
                              {formatPrice(s.price)}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      className="btn-editorial-solid mt-12"
                      disabled={!serviceId}
                      onClick={() => setStep(2)}
                    >
                      Continuar
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <p className="mb-10 text-[11px] uppercase tracking-[0.35em] text-black/40">
                      Elegí barbero
                    </p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {team.map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          className={`rounded-none border px-5 py-6 text-left transition-opacity duration-500 ${
                            barberId === b.id
                              ? "border-black bg-black text-[#f2f1ec]"
                              : "border-black/15 bg-transparent text-black hover:opacity-80"
                          }`}
                          onClick={() => setBarberId(b.id)}
                        >
                          <span className="block text-[12px] font-bold uppercase tracking-[0.12em]">
                            {b.name}
                          </span>
                          <span
                            className={`mt-2 block text-[11px] tracking-[0.14em] ${
                              barberId === b.id ? "text-[#f2f1ec]/70" : "text-black/45"
                            }`}
                          >
                            {b.specialty}
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="mt-12 flex flex-wrap gap-3">
                      <button type="button" className="btn-editorial" onClick={() => setStep(1)}>
                        Atrás
                      </button>
                      <button
                        type="button"
                        className="btn-editorial-solid"
                        disabled={!barberId}
                        onClick={() => setStep(3)}
                      >
                        Continuar
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <p className="mb-10 text-[11px] uppercase tracking-[0.35em] text-black/40">
                      Día y hora
                    </p>
                    <div className="mb-10 grid grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-2">
                      {bookingDates.map((d) => {
                        const [yy, mm, dd] = d.split("-").map(Number)
                        const day = new Date(yy, mm - 1, dd).getDay()
                        const isSelected = dateISO === d
                        return (
                          <button
                            key={d}
                            type="button"
                            className={dayCellClass(isSelected)}
                            onClick={() => {
                              setDateISO(d)
                              setTime(null)
                            }}
                            aria-pressed={isSelected}
                            aria-label={`${WEEKDAYS[day]} ${dd}`}
                          >
                            <span className="mb-1 block text-[8px] uppercase tracking-[0.35em] opacity-70">
                              {WEEKDAYS[day]}
                            </span>
                            {dd}
                          </button>
                        )
                      })}
                    </div>

                    {dateISO ? (
                      <div className="mb-12">
                        <p className="mb-4 text-[10px] uppercase tracking-[0.4em] text-black/35">
                          {formatDateLong(dateISO)}
                        </p>
                        {slotOptions.length === 0 ? (
                          <p className="text-[12px] tracking-[0.12em] text-black/45">
                            Sin horarios ese día.
                          </p>
                        ) : (
                          <div className="flex flex-wrap gap-2" role="list">
                            {slotOptions.map((t) => (
                              <button
                                key={t}
                                type="button"
                                role="listitem"
                                className={slotBtnClass(effectiveTime === t)}
                                onClick={() => setTime(t)}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : null}

                    <div className="flex flex-wrap gap-3">
                      <button type="button" className="btn-editorial" onClick={() => setStep(2)}>
                        Atrás
                      </button>
                      <button
                        type="button"
                        className="btn-editorial-solid"
                        disabled={!dateISO || !effectiveTime}
                        onClick={() => setStep(4)}
                      >
                        Revisar
                      </button>
                    </div>
                  </div>
                )}

                {step === 4 && service && barber && dateISO && effectiveTime && (
                  <div>
                    <ul className="mb-10 space-y-4 border-t border-black/10 pt-8">
                      {[
                        ["Servicio", service.name],
                        ["Barbero", barber.name],
                        ["Fecha", formatDateLong(dateISO)],
                        ["Hora", effectiveTime],
                        ["Total", formatPrice(service.price)],
                      ].map(([k, v]) => (
                        <li
                          key={k}
                          className="flex justify-between gap-8 border-b border-black/10 pb-3 text-[11px] last:border-0"
                        >
                          <span className="uppercase tracking-[0.35em] text-black/35">{k}</span>
                          <span
                          className={`max-w-[60%] text-right text-[12px] tracking-[0.08em] text-black ${
                            k === "Total" ? "font-price font-light tracking-[0.14em]" : ""
                          }`}
                        >
                            {v}
                          </span>
                        </li>
                      ))}
                    </ul>
                    {!user ? (
                      <p className="mb-6 text-[12px] tracking-[0.1em] text-black/50" role="alert">
                        Necesitás iniciar sesión para confirmar.
                      </p>
                    ) : null}
                    {confirmError ? (
                      <p className="mb-6 text-[12px] tracking-wide text-black/55" role="alert">
                        {confirmError}
                      </p>
                    ) : null}
                    <div className="flex flex-wrap gap-3">
                      <button type="button" className="btn-editorial" onClick={() => setStep(3)}>
                        Atrás
                      </button>
                      <button
                        type="button"
                        className="btn-editorial-solid"
                        onClick={handleConfirm}
                        disabled={confirmBusy}
                      >
                        {user ? "Confirmar turno" : "Iniciar sesión"}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
