'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { BookingType, Slot } from '@/lib/types'
import { BOOKING_TYPE_COLORS } from '@/lib/types'
import { CURRENT_MEMBER } from '@/lib/mock-data'
import { computeCost, formatNOK } from '@/lib/pricing'
import { createBooking } from '@/lib/api'
import { useI18n } from '@/components/I18nProvider'

type Props = { initialSlotId?: number; initialDate?: string; slots: Slot[] }

const BOOKABLE_TYPES: BookingType[] = ['M', 'B', 'A', 'X', 'Y', 'Z', 'S']

export default function BookingForm({ initialSlotId, initialDate, slots }: Props) {
  const router = useRouter()
  const { t } = useI18n()
  const today = new Date().toISOString().slice(0, 10)

  const [slotId, setSlotId]         = useState(initialSlotId ?? slots[0]?.id ?? 1)
  const [startDate, setStartDate]   = useState(initialDate ?? today)
  const [endDate, setEndDate]       = useState(() => {
    const d = new Date(initialDate ?? today)
    d.setDate(d.getDate() + 7)
    return d.toISOString().slice(0, 10)
  })
  const [type, setType]             = useState<BookingType>('M')
  const [adults, setAdults]         = useState(2)
  const [children, setChildren]     = useState(0)
  const [comment, setComment]       = useState('')
  const [submitted, setSubmitted]   = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]           = useState('')

  const slot = slots.find(s => s.id === slotId) ?? slots[0]
  const cost = computeCost(type, startDate, endDate, adults, children)
  const nights = Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000)

  useEffect(() => {
    if (startDate >= endDate) {
      const d = new Date(startDate)
      d.setDate(d.getDate() + 1)
      setEndDate(d.toISOString().slice(0, 10))
    }
  }, [startDate, endDate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (adults < 1) { setError(t.booking.atLeastOneAdult); return }
    setError('')
    setSubmitting(true)
    try {
      await createBooking({
        slot_id: slotId,
        pid: CURRENT_MEMBER.id,
        family: CURRENT_MEMBER.family,
        start_time: startDate,
        end_time: endDate,
        type,
        adult: adults,
        child12: children,
        child00: 0,
        amount_due: cost,
        amount_res: 0,
        comment,
      })
      setSubmitted(true)
      setTimeout(() => router.push('/bookings'), 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : t.booking.conflict)
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-3 text-4xl">✓</div>
        <h2 className="text-xl font-semibold text-gray-900">{t.booking.confirmed}</h2>
        <p className="mt-1 text-sm text-gray-500">{t.booking.redirecting}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">{t.booking.room}</label>
        <select
          value={slotId}
          onChange={e => setSlotId(Number(e.target.value))}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#253551] focus:outline-none focus:ring-2 focus:ring-[#253551]/10"
        >
          {slots.map(s => (
            <option key={s.id} value={s.id}>
              {s.name} ({t.booking.capacity} {s.capacity})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">{t.booking.checkIn}</label>
          <input type="date" value={startDate} min={today}
            onChange={e => setStartDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#253551] focus:outline-none focus:ring-2 focus:ring-[#253551]/10"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">{t.booking.checkOut}</label>
          <input type="date" value={endDate} min={startDate}
            onChange={e => setEndDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#253551] focus:outline-none focus:ring-2 focus:ring-[#253551]/10"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">{t.booking.bookingType}</label>
        <div className="flex flex-wrap gap-2">
          {BOOKABLE_TYPES.map(btype => (
            <button
              key={btype}
              type="button"
              onClick={() => setType(btype)}
              className={`rounded-full px-3 py-1 text-sm font-medium border transition-colors ${
                type === btype
                  ? BOOKING_TYPE_COLORS[btype]
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {t.calendar.typeLabels[btype]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">{t.booking.adults}</label>
          <input type="number" min={1} max={slot.capacity} value={adults}
            onChange={e => setAdults(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#253551] focus:outline-none focus:ring-2 focus:ring-[#253551]/10"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">{t.booking.children}</label>
          <input type="number" min={0} max={slot.capacity} value={children}
            onChange={e => setChildren(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#253551] focus:outline-none focus:ring-2 focus:ring-[#253551]/10"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          {t.booking.comment} <span className="text-gray-400">({t.booking.optional})</span>
        </label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={3}
          placeholder={t.booking.commentPlaceholder}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#253551] focus:outline-none focus:ring-2 focus:ring-[#253551]/10 resize-none"
        />
      </div>

      {/* Cost summary */}
      <div className={`rounded-xl border p-4 ${error ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {error ? (
              <span className="text-red-600 font-medium">{error}</span>
            ) : (
              <>
                {adults} {adults === 1 ? t.bookings.adult : t.bookings.adults}
                {children > 0 ? ` + ${children} ${t.bookings.children}` : ''}
                {' · '}
                {nights} {nights === 1 ? t.booking.night : t.booking.nights}
              </>
            )}
          </div>
          {!error && (
            <div className="text-lg font-semibold text-gray-900">{formatNOK(cost)}</div>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          {t.booking.cancel}
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 bg-[#253551] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1e2c43] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? '…' : t.booking.confirm}
        </button>
      </div>
    </form>
  )
}
