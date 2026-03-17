'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getSession, logout } from '@/lib/auth'
import { useI18n } from '@/components/I18nProvider'
import { CLASSIC_URL } from '@/lib/config'
import type { Member } from '@/lib/types'

export default function NavBar() {
  const pathname = usePathname()
  const router = useRouter()
  const { t, lang, setLang } = useI18n()
  const [member, setMember] = useState<Member | null>(null)

  useEffect(() => {
    setMember(getSession())
  }, [pathname])

  function handleLogout() {
    logout()
    router.push('/login')
  }

  const navLinks = [
    { href: '/calendar', label: t.nav.calendar, external: false },
    ...(member
      ? [
          { href: '/bookings', label: t.nav.myBookings, external: false },
          ...((member.privmask & 0x80) !== 0
            ? [{ href: `${CLASSIC_URL}/s/booking/admin.php`, label: t.nav.administration, external: true }]
            : []),
        ]
      : []),
  ]

  return (
    <>
      {/* Version toggle banner */}
      <div className="bg-[#253551] text-white text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white/20 px-2 py-0.5 font-semibold tracking-wide">
            {t.nav.newDesignBadge}
          </span>
          <span className="text-white/70 hidden sm:inline">
            {lang === 'no'
              ? 'Du ser den nye designen — samme system, ny innpakning'
              : "You're viewing the new design — same system, new look"}
          </span>
        </div>
        <a
          href={
            member
              ? `${CLASSIC_URL}/api/autologin.php?pid=${member.id}&redirect=/s/booking/month.php`
              : `${CLASSIC_URL}/s/booking/month.php`
          }
          className="flex items-center gap-1 text-white/90 hover:text-white underline underline-offset-2"
        >
          {t.nav.switchToClassic} →
        </a>
      </div>

      {/* Main nav */}
      <nav className="border-b border-gray-200 bg-white shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">

            {/* Left: Logo */}
            <div className="w-40 flex-shrink-0">
              <Link href="/calendar">
                <Image
                  src="/tolfa_logo.png"
                  alt="Centro studi Italo-Norvegese a Tolfa"
                  width={140}
                  height={76}
                  className="object-contain"
                  priority
                />
              </Link>
            </div>

            {/* Center: nav links */}
            <div className="flex flex-1 items-center justify-center gap-8">
              {navLinks.map(l => (
                l.external ? (
                  <a
                    key={l.href}
                    href={l.href}
                    className="text-sm font-medium tracking-wide transition-colors text-gray-500 hover:text-[#253551] whitespace-nowrap"
                  >
                    {l.label}
                  </a>
                ) : (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`text-sm font-medium tracking-wide transition-colors whitespace-nowrap ${
                      pathname.startsWith(l.href)
                        ? 'text-[#253551] border-b-2 border-[#253551] pb-0.5'
                        : 'text-gray-500 hover:text-[#253551]'
                    }`}
                  >
                    {l.label}
                  </Link>
                )
              ))}
            </div>

            {/* Right: language, name, logout */}
            <div className="w-40 flex-shrink-0 flex items-center justify-end gap-3 whitespace-nowrap">
              {/* Language toggle */}
              <div className="flex items-center rounded-full border border-gray-200 bg-gray-50 p-0.5 text-xs font-medium">
                <button
                  onClick={() => setLang('no')}
                  className={`rounded-full px-2.5 py-1 transition-colors ${
                    lang === 'no'
                      ? 'bg-white shadow-sm text-gray-900'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  NO
                </button>
                <button
                  onClick={() => setLang('en')}
                  className={`rounded-full px-2.5 py-1 transition-colors ${
                    lang === 'en'
                      ? 'bg-white shadow-sm text-gray-900'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  EN
                </button>
              </div>

              {member ? (
                <>
                  <span className="text-sm font-medium text-gray-700">{member.family}</span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-400 hover:text-[#253551] transition-colors"
                  >
                    {t.nav.logout}
                  </button>
                </>
              ) : (
                <Link href="/login" className="text-sm text-gray-500 hover:text-[#253551]">
                  {t.nav.login}
                </Link>
              )}
            </div>

          </div>
        </div>
      </nav>
    </>
  )
}
