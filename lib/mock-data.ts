import type { Area, Slot, Member, Entry, CostRate } from './types'

export const AREAS: Area[] = [
  { id: 1, name: 'Haus' },
  { id: 2, name: 'Villa' },
  { id: 3, name: 'Venteliste' },
]

// V1–V8 in Haus, T1–T4 in Villa, X1–X5 waiting list
export const SLOTS: Slot[] = [
  { id: 1,  area_id: 1, name: 'V1',   capacity: 4 },
  { id: 2,  area_id: 1, name: 'V2',   capacity: 4 },
  { id: 3,  area_id: 1, name: 'V3',   capacity: 3 },
  { id: 4,  area_id: 1, name: 'V4',   capacity: 4 },
  { id: 5,  area_id: 1, name: 'V5',   capacity: 2 },
  { id: 6,  area_id: 1, name: 'V6',   capacity: 4 },
  { id: 7,  area_id: 1, name: 'V7',   capacity: 3 },
  { id: 8,  area_id: 1, name: 'V8',   capacity: 2 },
  { id: 9,  area_id: 2, name: 'T1',   capacity: 5 },
  { id: 10, area_id: 2, name: 'T2',   capacity: 4 },
  { id: 11, area_id: 2, name: 'T2.1', capacity: 3 },
  { id: 12, area_id: 2, name: 'T3',   capacity: 4 },
  { id: 13, area_id: 2, name: 'T4',   capacity: 2 },
  { id: 14, area_id: 3, name: 'X1',   capacity: 4 },
  { id: 15, area_id: 3, name: 'X2',   capacity: 4 },
  { id: 16, area_id: 3, name: 'X3',   capacity: 3 },
  { id: 17, area_id: 3, name: 'X4',   capacity: 4 },
  { id: 18, area_id: 3, name: 'X5',   capacity: 2 },
]

export const CURRENT_MEMBER: Member = {
  id: 42,
  username: 'hansen',
  family: 'Hansen',
  email: 'anna@hansen.no',
  privmask: 0x83, // see, book, admin
}

export const MEMBERS: Member[] = [
  CURRENT_MEMBER,
  { id: 7,  username: 'olsen', family: 'Olsen', email: 'olsen@example.com', privmask: 0x03 },
  { id: 12, username: 'berg',  family: 'Berg',  email: 'berg@example.com',  privmask: 0x03 },
  { id: 19, username: 'dahl',  family: 'Dahl',  email: 'dahl@example.com',  privmask: 0x87 },
]

export const ENTRIES: Entry[] = [
  // March 2026 — Haus
  { id: 1,  slot_id: 1,  pid: 7,  family: 'Olsen',  start_time: '2026-03-02', end_time: '2026-03-07', type: 'M', adult: 2, child12: 0, child00: 0, amount_due: 3200, amount_res: 3200, comment: '' },
  { id: 2,  slot_id: 2,  pid: 12, family: 'Berg',   start_time: '2026-03-05', end_time: '2026-03-10', type: 'B', adult: 2, child12: 2, child00: 0, amount_due: 4800, amount_res: 2400, comment: 'Tar med barn' },
  { id: 3,  slot_id: 4,  pid: 19, family: 'Dahl',   start_time: '2026-03-08', end_time: '2026-03-15', type: 'S', adult: 8, child12: 0, child00: 0, amount_due: 9600, amount_res: 9600, comment: 'Årlig seminar' },
  { id: 4,  slot_id: 3,  pid: 42, family: 'Hansen', start_time: '2026-03-14', end_time: '2026-03-19', type: 'M', adult: 2, child12: 0, child00: 0, amount_due: 3200, amount_res: 1600, comment: '' },
  { id: 5,  slot_id: 6,  pid: 7,  family: 'Olsen',  start_time: '2026-03-20', end_time: '2026-03-25', type: 'X', adult: 3, child12: 0, child00: 0, amount_due: 4200, amount_res: 0,    comment: 'Venner på besøk' },
  { id: 6,  slot_id: 5,  pid: 12, family: 'Berg',   start_time: '2026-03-22', end_time: '2026-03-28', type: 'W', adult: 2, child12: 1, child00: 0, amount_due: 3600, amount_res: 0,    comment: '' },
  // March 2026 — Villa
  { id: 7,  slot_id: 9,  pid: 19, family: 'Dahl',   start_time: '2026-03-08', end_time: '2026-03-15', type: 'S', adult: 6, child12: 0, child00: 0, amount_due: 7200, amount_res: 7200, comment: 'Seminar gruppe 2' },
  { id: 8,  slot_id: 10, pid: 7,  family: 'Olsen',  start_time: '2026-03-20', end_time: '2026-03-25', type: 'X', adult: 2, child12: 0, child00: 0, amount_due: 2800, amount_res: 0,    comment: '' },
  { id: 9,  slot_id: 11, pid: 12, family: 'Berg',   start_time: '2026-03-22', end_time: '2026-03-29', type: 'W', adult: 2, child12: 1, child00: 0, amount_due: 3600, amount_res: 0,    comment: '' },
  // April 2026 — Haus
  { id: 10, slot_id: 1,  pid: 12, family: 'Berg',   start_time: '2026-04-01', end_time: '2026-04-06', type: 'B', adult: 2, child12: 1, child00: 1, amount_due: 4200, amount_res: 4200, comment: '' },
  { id: 11, slot_id: 2,  pid: 19, family: 'Dahl',   start_time: '2026-04-03', end_time: '2026-04-09', type: 'M', adult: 1, child12: 0, child00: 0, amount_due: 2400, amount_res: 2400, comment: '' },
  { id: 12, slot_id: 4,  pid: 7,  family: 'Olsen',  start_time: '2026-04-10', end_time: '2026-04-17', type: 'K', adult: 4, child12: 0, child00: 0, amount_due: 0,    amount_res: 0,    comment: 'Spesialarrangement' },
  { id: 13, slot_id: 6,  pid: 42, family: 'Hansen', start_time: '2026-04-18', end_time: '2026-04-24', type: 'M', adult: 2, child12: 0, child00: 0, amount_due: 3200, amount_res: 0,    comment: '' },
  { id: 14, slot_id: 3,  pid: 12, family: 'Berg',   start_time: '2026-04-20', end_time: '2026-04-25', type: 'Y', adult: 2, child12: 0, child00: 0, amount_due: 3200, amount_res: 1600, comment: '' },
  // May 2026
  { id: 15, slot_id: 1,  pid: 7,  family: 'Olsen',  start_time: '2026-05-01', end_time: '2026-05-08', type: 'M', adult: 2, child12: 0, child00: 0, amount_due: 4000, amount_res: 4000, comment: '' },
  { id: 16, slot_id: 9,  pid: 42, family: 'Hansen', start_time: '2026-05-15', end_time: '2026-05-22', type: 'B', adult: 2, child12: 2, child00: 0, amount_due: 5600, amount_res: 2800, comment: 'Tar med barna' },
  { id: 17, slot_id: 2,  pid: 19, family: 'Dahl',   start_time: '2026-05-20', end_time: '2026-05-27', type: 'S', adult: 6, child12: 0, child00: 0, amount_due: 7200, amount_res: 7200, comment: '' },
  // Past — Feb/Jan 2026
  { id: 18, slot_id: 3,  pid: 42, family: 'Hansen', start_time: '2026-02-10', end_time: '2026-02-15', type: 'M', adult: 2, child12: 0, child00: 0, amount_due: 3200, amount_res: 3200, comment: '' },
  { id: 19, slot_id: 1,  pid: 7,  family: 'Olsen',  start_time: '2026-01-05', end_time: '2026-01-10', type: 'M', adult: 2, child12: 0, child00: 0, amount_due: 3200, amount_res: 3200, comment: '' },
]

export const COST_RATES: CostRate[] = [
  { type: 'M', label: 'Member',           adult_low: 320, adult_high: 480, child_low: 160, child_high: 240 },
  { type: 'B', label: 'Family',           adult_low: 360, adult_high: 520, child_low: 180, child_high: 260 },
  { type: 'A', label: 'Family (assoc.)',  adult_low: 380, adult_high: 540, child_low: 190, child_high: 270 },
  { type: 'X', label: 'Friends',          adult_low: 400, adult_high: 560, child_low: 200, child_high: 280 },
  { type: 'Y', label: 'Friends (assoc.)', adult_low: 420, adult_high: 580, child_low: 210, child_high: 290 },
  { type: 'Z', label: 'Solo',             adult_low: 300, adult_high: 440, child_low: 150, child_high: 220 },
  { type: 'S', label: 'Seminar',          adult_low: 280, adult_high: 400, child_low: 140, child_high: 200 },
  { type: 'K', label: 'Special',          adult_low: 0,   adult_high: 0,   child_low: 0,   child_high: 0   },
  { type: 'W', label: 'Waiting list',     adult_low: 320, adult_high: 480, child_low: 160, child_high: 240 },
]

export function isHighSeason(dateStr: string): boolean {
  const d = new Date(dateStr)
  const m = d.getMonth() + 1
  const day = d.getDate()
  return (m === 9 && day >= 20) || m === 10 || (m === 10 && day <= 20)
}
