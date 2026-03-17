'use client'

import { useSearchParams } from 'next/navigation'
import BookingForm from '@/components/BookingForm'
import { useI18n } from '@/components/I18nProvider'
import type { Slot } from '@/lib/types'

export default function BookingPageClient({ slots }: { slots: Slot[] }) {
  const { t } = useI18n()
  const searchParams = useSearchParams()
  const slot = searchParams.get('slot')
  const date = searchParams.get('date')
  const slotId = slot ? parseInt(slot) : undefined

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">{t.booking.title}</h1>
        <p className="text-sm text-gray-500">
          {date ? `${t.booking.starting} ${date}` : t.booking.chooseDates}
        </p>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <BookingForm initialSlotId={slotId} initialDate={date ?? undefined} slots={slots} />
      </div>
    </div>
  )
}
