'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Entry, Slot } from '@/lib/types'
import { BOOKING_TYPE_CELL } from '@/lib/types'
import { getDaysInMonth, isoDate, getEntryForCell } from '@/lib/calendar-utils'
import { useI18n } from '@/components/I18nProvider'

type Props = {
  year: number
  month: number
  slots: Slot[]
  entries: Entry[]
}

type Popover = { entry: Entry; slotName: string; x: number; y: number }

const LEGEND_TYPES = ['M', 'B', 'X', 'S', 'W', 'K'] as const

export default function CalendarGrid({ year, month, slots, entries }: Props) {
  const router = useRouter()
  const { t } = useI18n()
  const [popover, setPopover] = useState<Popover | null>(null)
  const days = getDaysInMonth(year, month)
  const today = new Date().toISOString().slice(0, 10)

  function handleCellClick(e: React.MouseEvent, slot: Slot, day: number, entry: Entry | undefined) {
    if (entry) {
      const rect = (e.target as HTMLElement).getBoundingClientRect()
      setPopover({ entry, slotName: slot.name, x: rect.left + rect.width / 2, y: rect.top })
      return
    }
    router.push(`/booking/new?slot=${slot.id}&date=${isoDate(year, month, day)}`)
  }

  return (
    <div className="relative" onClick={() => setPopover(null)}>
      {/* Legend */}
      <div className="mb-4 flex flex-wrap gap-2">
        {LEGEND_TYPES.map(type => (
          <span
            key={type}
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border border-gray-200 bg-white`}
          >
            <span className={`h-2 w-2 rounded-full ${BOOKING_TYPE_CELL[type].split(' ')[0]}`} />
            {t.calendar.typeLabels[type]}
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium bg-white border border-gray-200">
          <span className="h-2 w-2 rounded-full bg-white border border-gray-300" />
          {t.calendar.available}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left font-medium text-gray-500 border-b border-r border-gray-200 min-w-[120px]">
                {t.calendar.room}
              </th>
              {Array.from({ length: days }, (_, i) => i + 1).map(day => {
                const date = new Date(year, month - 1, day)
                const dow = date.getDay()
                const isWeekend = dow === 0 || dow === 6
                const dateStr = isoDate(year, month, day)
                const isToday = dateStr === today
                return (
                  <th
                    key={day}
                    className={`px-0.5 py-2 text-center font-medium border-b border-gray-100 min-w-[44px] ${
                      isToday
                        ? 'bg-[#253551] text-white'
                        : isWeekend
                        ? 'text-gray-500 bg-gray-50/80'
                        : 'text-gray-400'
                    }`}
                  >
                    <div className="text-sm">{day}</div>
                    <div className="text-[11px] font-normal">{t.days[dow]}</div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {slots.map((slot, si) => (
              <tr key={slot.id} className={si % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}>
                <td className="sticky left-0 z-10 px-4 py-3 font-semibold text-gray-700 border-r border-gray-200 bg-inherit whitespace-nowrap text-sm">
                  {slot.name}
                  <span className="ml-1.5 font-normal text-gray-400">({slot.capacity})</span>
                </td>
                {Array.from({ length: days }, (_, i) => i + 1).map(day => {
                  const dateStr = isoDate(year, month, day)
                  const entry = getEntryForCell(entries, slot.id, dateStr)
                  const isPast = dateStr < today
                  return (
                    <td
                      key={day}
                      onClick={e => { e.stopPropagation(); handleCellClick(e, slot, day, entry) }}
                      className={`border border-gray-100 cursor-pointer transition-colors ${
                        entry
                          ? BOOKING_TYPE_CELL[entry.type]
                          : isPast
                          ? 'bg-gray-50 hover:bg-gray-100'
                          : 'hover:bg-[#253551]/5'
                      }`}
                      style={{ height: 44 }}
                      title={
                        entry
                          ? `${entry.family} — ${t.calendar.typeLabels[entry.type]}`
                          : t.calendar.clickToBook
                      }
                    >
                      {entry && entry.start_time === dateStr && (
                        <div className="px-1 truncate text-xs font-medium leading-tight text-gray-700 pt-1.5">
                          {entry.family}
                        </div>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popover */}
      {popover && (
        <div
          className="fixed z-50 w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-xl
            sm:w-60
            max-sm:bottom-4 max-sm:left-1/2 max-sm:-translate-x-1/2"
          style={
            typeof window !== 'undefined' && window.innerWidth >= 640
              ? {
                  left: Math.min(popover.x - 120, window.innerWidth - 256),
                  top: popover.y - 8,
                  transform: 'translateY(-100%)',
                }
              : undefined
          }
          onClick={e => e.stopPropagation()}
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="font-semibold text-gray-900">{popover.entry.family}</span>
            <button onClick={() => setPopover(null)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
          </div>
          <div className="space-y-1 text-sm text-gray-600">
            <div><span className="text-gray-400">{t.calendar.room}:</span> {popover.slotName}</div>
            <div><span className="text-gray-400">{t.booking.checkIn}:</span> {popover.entry.start_time}</div>
            <div><span className="text-gray-400">{t.booking.checkOut}:</span> {popover.entry.end_time}</div>
            <div><span className="text-gray-400">Type:</span> {t.calendar.typeLabels[popover.entry.type]}</div>
            <div>
              <span className="text-gray-400">{t.booking.adults}:</span>{' '}
              {popover.entry.adult}
              {popover.entry.child12 > 0 ? ` + ${popover.entry.child12} ${t.bookings.children}` : ''}
            </div>
            {popover.entry.comment && (
              <div className="italic text-gray-400">"{popover.entry.comment}"</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
