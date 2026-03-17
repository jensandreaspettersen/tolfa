'use client'

import Link from 'next/link'
import BookingCard from '@/components/BookingCard'
import { useI18n } from '@/components/I18nProvider'
import type { Entry, Slot } from '@/lib/types'

type Props = { entries: Entry[]; slots: Slot[]; memberName: string }

export default function BookingsPageClient({ entries, slots, memberName }: Props) {
  const { t } = useI18n()
  const today = new Date().toISOString().slice(0, 10)

  const sorted = [...entries].sort((a, b) => b.start_time.localeCompare(a.start_time))
  const upcoming = sorted.filter(e => e.end_time >= today)
  const past     = sorted.filter(e => e.end_time <  today)

  function slotFor(slotId: number) {
    return slots.find(s => s.id === slotId)!
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{t.bookings.title}</h1>
          <p className="text-sm text-gray-500">{t.bookings.loggedInAs} {memberName}</p>
        </div>
        <Link
          href="/booking/new"
          className="bg-[#253551] px-4 py-2 text-sm font-medium text-white hover:bg-[#1e2c43] transition-colors"
        >
          {t.bookings.newBooking}
        </Link>
      </div>

      {upcoming.length > 0 ? (
        <section className="mb-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
            {t.bookings.upcoming}
          </h2>
          <div className="space-y-3">
            {upcoming.map(e => (
              <BookingCard key={e.id} entry={e} slot={slotFor(e.slot_id)} isPast={false} />
            ))}
          </div>
        </section>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-200 py-16 text-center">
          <p className="text-gray-400">{t.bookings.noUpcoming}</p>
          <Link href="/booking/new" className="mt-3 inline-block text-sm text-[#253551] hover:underline">
            {t.bookings.firstBooking}
          </Link>
        </div>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
            {t.bookings.past}
          </h2>
          <div className="space-y-3">
            {past.map(e => (
              <BookingCard key={e.id} entry={e} slot={slotFor(e.slot_id)} isPast />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
