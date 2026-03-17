import { redirect } from 'next/navigation'
import CalendarPageClient from '@/components/CalendarPageClient'
import { getAreasAndSlots, getBookingsForMonth } from '@/lib/api'

type Params = { slug?: string[] }
type Tab = 'all' | 'villa' | 'tower' | 'waiting'

const VALID_TABS: Tab[] = ['all', 'villa', 'tower', 'waiting']

export default async function CalendarPage({ params, searchParams }: {
  params: Promise<Params>
  searchParams: Promise<{ tab?: string }>
}) {
  const { slug } = await params
  const { tab: tabParam } = await searchParams

  const now = new Date()
  const year  = slug?.[0] ? parseInt(slug[0]) : now.getFullYear()
  const month = slug?.[1] ? parseInt(slug[1]) : now.getMonth() + 1

  if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
    redirect('/calendar')
  }

  const [{ slots }, entries] = await Promise.all([
    getAreasAndSlots(),
    getBookingsForMonth(year, month),
  ])

  const tab: Tab = VALID_TABS.includes(tabParam as Tab) ? (tabParam as Tab) : 'all'

  return (
    <CalendarPageClient
      year={year} month={month} tab={tab}
      slots={slots} entries={entries}
    />
  )
}
