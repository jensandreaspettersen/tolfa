// Types mirroring the hrbs_* database tables

export type Area = {
  id: number
  name: string
}

export type Slot = {
  id: number
  area_id: number
  name: string
  capacity: number
}

export type Member = {
  id: number
  username: string
  family: string
  email: string
  privmask: number // bit flags: 0x01 see, 0x02 book, 0x04 edit, 0x80 admin
}

export type BookingType = 'M' | 'B' | 'A' | 'X' | 'Y' | 'Z' | 'S' | 'K' | 'W'

export type Entry = {
  id: number
  slot_id: number
  pid: number // member id
  family: string
  start_time: string // ISO date YYYY-MM-DD
  end_time: string   // ISO date YYYY-MM-DD
  type: BookingType
  adult: number
  child12: number  // children 0-12
  child00: number  // children under 2
  amount_due: number
  amount_res: number // amount paid/reserved
  comment: string
}

export type CostRate = {
  type: BookingType
  label: string
  adult_low: number
  adult_high: number
  child_low: number
  child_high: number
}

// UI helpers
export const BOOKING_TYPE_LABELS: Record<BookingType, string> = {
  M: 'Member',
  B: 'Family',
  A: 'Family (assoc.)',
  X: 'Friends',
  Y: 'Friends (assoc.)',
  Z: 'Solo',
  S: 'Seminar',
  K: 'Special',
  W: 'Waiting list',
}

export const BOOKING_TYPE_COLORS: Record<BookingType, string> = {
  M: 'bg-blue-100 text-blue-800 border-blue-200',
  B: 'bg-green-100 text-green-800 border-green-200',
  A: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  X: 'bg-orange-100 text-orange-800 border-orange-200',
  Y: 'bg-amber-100 text-amber-800 border-amber-200',
  Z: 'bg-sky-100 text-sky-800 border-sky-200',
  S: 'bg-purple-100 text-purple-800 border-purple-200',
  K: 'bg-red-100 text-red-800 border-red-200',
  W: 'bg-yellow-100 text-yellow-800 border-yellow-200',
}

export const BOOKING_TYPE_CELL: Record<BookingType, string> = {
  M: 'bg-blue-100 hover:bg-blue-200',
  B: 'bg-green-100 hover:bg-green-200',
  A: 'bg-emerald-100 hover:bg-emerald-200',
  X: 'bg-orange-100 hover:bg-orange-200',
  Y: 'bg-amber-100 hover:bg-amber-200',
  Z: 'bg-sky-100 hover:bg-sky-200',
  S: 'bg-purple-100 hover:bg-purple-200',
  K: 'bg-red-100 hover:bg-red-200',
  W: 'bg-yellow-100 hover:bg-yellow-200',
}
