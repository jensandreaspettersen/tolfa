import type { BookingType } from './types'
import { COST_RATES, isHighSeason } from './mock-data'

export function computeCost(
  type: BookingType,
  startDate: string,
  endDate: string,
  adults: number,
  children: number,
): number {
  const rate = COST_RATES.find(r => r.type === type)
  if (!rate || type === 'K') return 0

  const nights = Math.round(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000
  )
  if (nights <= 0) return 0

  const high = isHighSeason(startDate)
  const adultRate = high ? rate.adult_high : rate.adult_low
  const childRate = high ? rate.child_high : rate.child_low

  return (adults * adultRate + children * childRate) * nights
}

export function formatNOK(amount: number): string {
  return `kr ${amount.toLocaleString('nb-NO')}`
}
