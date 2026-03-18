'use client'

import Link from 'next/link'
import CalendarGrid from '@/components/CalendarGrid'
import { useI18n } from '@/components/I18nProvider'
import type { Slot, Entry } from '@/lib/types'

type Tab = 'all' | 'villa' | 'tower' | 'waiting'

function filterSlotsByTab(slots: Slot[], tab: Tab): Slot[] {
  if (tab === 'villa')   return slots.filter(s => s.name.startsWith('V'))
  if (tab === 'tower')   return slots.filter(s => s.name.startsWith('T'))
  if (tab === 'waiting') return slots.filter(s => s.name.startsWith('X'))
  return slots
}

type Props = { year: number; month: number; tab: Tab; slots: Slot[]; entries: Entry[] }

export default function CalendarPageClient({ year, month, tab, slots, entries }: Props) {
  const { t } = useI18n()
  const filteredSlots = filterSlotsByTab(slots, tab)

  const prevMonth = month === 1  ? { year: year - 1, month: 12 } : { year, month: month - 1 }
  const nextMonth = month === 12 ? { year: year + 1, month: 1  } : { year, month: month + 1 }
  const now = new Date()

  const tabs: { id: Tab; label: string }[] = [
    { id: 'all',     label: t.calendar.tabs.all },
    { id: 'villa',   label: t.calendar.tabs.villa },
    { id: 'tower',   label: t.calendar.tabs.tower },
    { id: 'waiting', label: t.calendar.tabs.waiting },
  ]

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl text-gray-900">
            {t.months[month - 1]} {year}
          </h1>
          <p className="text-sm text-gray-500">{t.calendar.clickToBook}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/calendar/${prevMonth.year}/${prevMonth.month}?tab=${tab}`}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            ← {t.monthsShort[prevMonth.month - 1]}
          </Link>
          <Link
            href={`/calendar/${now.getFullYear()}/${now.getMonth() + 1}?tab=${tab}`}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {t.calendar.today}
          </Link>
          <Link
            href={`/calendar/${nextMonth.year}/${nextMonth.month}?tab=${tab}`}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {t.monthsShort[nextMonth.month - 1]} →
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-1 border-b border-gray-200 overflow-x-auto scrollbar-none">
        {tabs.map(({ id, label }) => (
          <Link
            key={id}
            href={`/calendar/${year}/${month}?tab=${id}`}
            className={`px-5 py-2.5 text-base font-medium border-b-2 transition-colors -mb-px whitespace-nowrap ${
              id === tab
                ? 'border-[#253551] text-[#253551]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      <CalendarGrid year={year} month={month} slots={filteredSlots} entries={entries} />
    </div>
  )
}
