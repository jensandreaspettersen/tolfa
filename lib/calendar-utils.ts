import type { Entry, Slot } from './types'

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

export function isoDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

// Returns entries that overlap a given day
export function getEntriesForDay(
  entries: Entry[],
  dateStr: string,
): Entry[] {
  return entries.filter(e => e.start_time <= dateStr && e.end_time > dateStr)
}

// For a given day and slot, return the booking if any
export function getEntryForCell(
  entries: Entry[],
  slotId: number,
  dateStr: string,
): Entry | undefined {
  return entries.find(
    e => e.slot_id === slotId && e.start_time <= dateStr && e.end_time > dateStr
  )
}

export function filterSlotsByArea(slots: Slot[], areaId: number): Slot[] {
  return slots.filter(s => s.area_id === areaId)
}

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
