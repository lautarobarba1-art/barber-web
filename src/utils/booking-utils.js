/** @param {{ date: string, time: string }} b */
export function bookingDateTime(b) {
  const [y, m, d] = b.date.split("-").map(Number)
  const dt = new Date(y, m - 1, d)
  const [hh, mm] = b.time.split(":").map(Number)
  dt.setHours(hh, mm, 0, 0)
  return dt
}

export function filterUpcoming(bookings, userId) {
  const now = new Date()
  return bookings
    .filter((b) => b.userId === userId && b.status === "confirmado")
    .filter((b) => bookingDateTime(b) >= now)
    .sort((a, b) => bookingDateTime(a) - bookingDateTime(b))
}

export function filterPast(bookings, userId) {
  const now = new Date()
  return bookings
    .filter((b) => b.userId === userId && b.status === "confirmado")
    .filter((b) => bookingDateTime(b) < now)
    .sort((a, b) => bookingDateTime(b) - bookingDateTime(a))
}
