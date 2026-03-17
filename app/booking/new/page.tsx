import { Suspense } from 'react'
import BookingPageClient from './BookingPageClient'
import { getAreasAndSlots } from '@/lib/api'

export default async function NewBookingPage() {
  const { slots } = await getAreasAndSlots()

  return (
    <Suspense>
      <BookingPageClient slots={slots} />
    </Suspense>
  )
}
