/** Base time slots (HH:mm) used to build availability */
const BASE_TIMES = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
]

/**
 * @typedef {{ barberId: number, date: string, times: string[] }} ScheduleEntry
 */

/** Static examples matching the prompt shape */
export const scheduleExamples = [
  { barberId: 1, date: "2026-04-15", times: BASE_TIMES },
  { barberId: 2, date: "2026-04-15", times: BASE_TIMES.filter((_, i) => i % 2 === 0) },
]

function pad(n) {
  return String(n).padStart(2, "0")
}

/** @param {string} iso YYYY-MM-DD */
export function parseISODate(iso) {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, m - 1, d)
}

/** @param {Date} date */
export function toISODate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/**
 * Next N calendar days from start (local), excluding Sundays (closed).
 * @param {string} startISO
 * @param {number} count
 */
export function getBookingDates(startISO, count = 14) {
  const start = parseISODate(startISO)
  const out = []
  const cur = new Date(start)
  while (out.length < count) {
    if (cur.getDay() !== 0) {
      out.push(toISODate(cur))
    }
    cur.setDate(cur.getDate() + 1)
  }
  return out
}

/**
 * Barber-specific slot subset (simulate different agendas).
 * @param {number} barberId
 */
function timesForBarber(barberId) {
  if (barberId === 2) return BASE_TIMES.filter((_, i) => i % 2 === 0)
  if (barberId === 3) return BASE_TIMES.filter((_, i) => i % 3 !== 0)
  return [...BASE_TIMES]
}

/**
 * Returns available times for barber on date (mock: same pattern per weekday).
 * @param {number} barberId
 * @param {string} dateISO
 * @param {string[]} [booked] times already taken
 */
export function getSlotsForBarber(barberId, dateISO, booked = []) {
  const d = parseISODate(dateISO)
  const day = d.getDay()
  if (day === 0) return []
  let times = timesForBarber(barberId)
  if (day === 6) {
    times = times.filter((t) => parseInt(t, 10) < 14 || t === "14:00")
  }
  const taken = new Set(booked)
  return times.filter((t) => !taken.has(t))
}
