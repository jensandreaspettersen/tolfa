// Fetches real data from the PHP backend at localhost:8000.
// Falls back to static mock-data if the PHP server is unreachable.

import type { Area, Slot, Entry } from './types'
import { AREAS as MOCK_AREAS, SLOTS as MOCK_SLOTS, ENTRIES as MOCK_ENTRIES } from './mock-data'

const PHP_BASE = process.env.NEXT_PUBLIC_PHP_API ?? 'http://localhost:8000/api'

async function fetchJSON<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json() as Promise<T>
  } catch {
    return null
  }
}

export async function getAreasAndSlots(): Promise<{ areas: Area[]; slots: Slot[] }> {
  const data = await fetchJSON<{ areas: Area[]; slots: Slot[] }>(`${PHP_BASE}/areas.php`)
  if (!data) return { areas: MOCK_AREAS, slots: MOCK_SLOTS }
  // Normalise numeric strings from PHP to numbers
  return {
    areas: data.areas.map(a => ({ ...a, id: Number(a.id) })),
    slots: data.slots.map(s => ({ ...s, id: Number(s.id), area_id: Number(s.area_id), capacity: Number(s.capacity) })),
  }
}

export async function getBookingsForMonth(year: number, month: number): Promise<Entry[]> {
  const data = await fetchJSON<{ entries: Entry[] }>(
    `${PHP_BASE}/bookings.php?year=${year}&month=${month}`
  )
  if (!data) return MOCK_ENTRIES
  return data.entries.map(normaliseEntry)
}

export async function getBookingsForMember(pid: number): Promise<Entry[]> {
  const data = await fetchJSON<{ entries: Entry[] }>(
    `${PHP_BASE}/bookings.php?pid=${pid}`
  )
  if (!data) return MOCK_ENTRIES.filter(e => e.pid === pid)
  return data.entries.map(normaliseEntry)
}

export async function createBooking(payload: Omit<Entry, 'id'>): Promise<{ id: number }> {
  const res = await fetch(`${PHP_BASE}/bookings.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error ?? 'Booking failed')
  }
  return res.json()
}

function normaliseEntry(e: Entry): Entry {
  return {
    ...e,
    id:          Number(e.id),
    slot_id:     Number(e.slot_id),
    pid:         Number(e.pid),
    adult:       Number(e.adult),
    child12:     Number(e.child12),
    child00:     Number(e.child00),
    amount_due:  Number(e.amount_due),
    amount_res:  Number(e.amount_res),
  }
}
