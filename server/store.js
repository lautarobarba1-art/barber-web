import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dirname, "data")
const storePath = process.env.STORE_PATH || join(dataDir, "store.json")

/** @typedef {{ id: number, name: string, email: string, password_hash: string, created_at: string }} UserRow */
/** @typedef {{ id: string, user_id: number, service_id: number, service_name: string, barber_id: number, barber_name: string, date: string, time: string, status: string, created_at: string }} BookingRow */
/** @typedef {{ users: UserRow[], bookings: BookingRow[] }} Store */

function defaultStore() {
  return { users: [], bookings: [] }
}

/** @param {Store} data */
export function writeStore(data) {
  mkdirSync(dirname(storePath), { recursive: true })
  writeFileSync(storePath, JSON.stringify(data, null, 2), "utf8")
}

export function readStore() {
  try {
    if (!existsSync(storePath)) {
      mkdirSync(dirname(storePath), { recursive: true })
      const empty = defaultStore()
      writeStore(empty)
      return empty
    }
    const raw = readFileSync(storePath, "utf8")
    const data = JSON.parse(raw)
    if (!Array.isArray(data.users)) data.users = []
    if (!Array.isArray(data.bookings)) data.bookings = []
    return data
  } catch {
    return defaultStore()
  }
}

export function nextUserId(users) {
  if (!users.length) return 1
  return Math.max(...users.map((u) => u.id)) + 1
}
