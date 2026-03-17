import type { Entry, Slot } from '@/lib/types'
import { BOOKING_TYPE_COLORS } from '@/lib/types'
import { formatNOK } from '@/lib/pricing'
import { useI18n } from '@/components/I18nProvider'

type Props = { entry: Entry; slot: Slot; isPast: boolean }

export default function BookingCard({ entry, slot, isPast }: Props) {
  const { t } = useI18n()
  const nights = Math.round(
    (new Date(entry.end_time).getTime() - new Date(entry.start_time).getTime()) / 86400000
  )
  const balance = entry.amount_due - entry.amount_res

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('nb-NO', {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  }

  return (
    <div className={`rounded-xl border bg-white p-5 shadow-sm transition-opacity ${isPast ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900">{slot.name}</span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium border ${BOOKING_TYPE_COLORS[entry.type]}`}>
              {t.calendar.typeLabels[entry.type]}
            </span>
            {isPast && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                {t.bookings.pastBadge}
              </span>
            )}
            {entry.type === 'W' && !isPast && (
              <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700 font-medium">
                {t.bookings.waitingList}
              </span>
            )}
          </div>

          <div className="text-sm text-gray-600">
            {formatDate(entry.start_time)} → {formatDate(entry.end_time)}
            <span className="ml-2 text-gray-400">
              ({nights} {nights === 1 ? t.bookings.night : t.bookings.nights})
            </span>
          </div>

          <div className="mt-1 text-sm text-gray-500">
            {entry.adult} {entry.adult === 1 ? t.bookings.adult : t.bookings.adults}
            {entry.child12 > 0 ? ` · ${entry.child12} ${t.bookings.children}` : ''}
          </div>

          {entry.comment && (
            <div className="mt-1.5 text-xs text-gray-400 italic">"{entry.comment}"</div>
          )}
        </div>

        {entry.amount_due > 0 && (
          <div className="text-right shrink-0">
            <div className="text-sm font-semibold text-gray-900">{formatNOK(entry.amount_due)}</div>
            {balance > 0 && !isPast ? (
              <div className="text-xs text-orange-600 mt-0.5">
                {formatNOK(balance)} {t.bookings.outstanding}
              </div>
            ) : (
              <div className="text-xs text-green-600 mt-0.5">{t.bookings.paid}</div>
            )}
          </div>
        )}
      </div>

      {!isPast && entry.type !== 'W' && (
        <div className="mt-4 flex gap-2 border-t border-gray-100 pt-4">
          <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            {t.bookings.edit}
          </button>
          <button className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors">
            {t.bookings.cancel}
          </button>
        </div>
      )}
    </div>
  )
}
