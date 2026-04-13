import { apiFetch } from "./http.js"

export async function fetchTakenTimes(barberId, dateISO, excludeBookingId) {
  const q = new URLSearchParams({
    barberId: String(barberId),
    date: dateISO,
  })
  if (excludeBookingId) q.set("excludeBookingId", excludeBookingId)
  const data = await apiFetch(`/api/bookings/taken?${q.toString()}`)
  return data.times || []
}

export async function fetchMyBookings() {
  const data = await apiFetch("/api/bookings")
  return data.bookings || []
}

export async function createBooking(payload) {
  const data = await apiFetch("/api/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  })
  return data.booking
}

export async function cancelBookingRequest(bookingId) {
  await apiFetch(`/api/bookings/${encodeURIComponent(bookingId)}/cancel`, {
    method: "PATCH",
    body: JSON.stringify({}),
  })
}

export async function rescheduleBookingRequest(bookingId, date, time) {
  const data = await apiFetch(`/api/bookings/${encodeURIComponent(bookingId)}/reschedule`, {
    method: "PATCH",
    body: JSON.stringify({ date, time }),
  })
  return data.booking
}
