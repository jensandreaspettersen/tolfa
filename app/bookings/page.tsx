import BookingsPageClient from '@/components/BookingsPageClient'
import { getAreasAndSlots, getBookingsForMember } from '@/lib/api'
import { CURRENT_MEMBER } from '@/lib/mock-data'

export default async function BookingsPage() {
  const [{ slots }, entries] = await Promise.all([
    getAreasAndSlots(),
    getBookingsForMember(CURRENT_MEMBER.id),
  ])

  return (
    <BookingsPageClient
      entries={entries}
      slots={slots}
      memberName={CURRENT_MEMBER.family}
    />
  )
}
