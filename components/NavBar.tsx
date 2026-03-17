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
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMember(getSession())
  }, [pathname])

  useEffect(() => {
    setMenuOpen(false)
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
        <span className="rounded-full bg-white/20 px-2 py-0.5 font-semibold tracking-wide">
          {t.nav.newDesignBadge}
        </span>
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
            <div className="flex-shrink-0">
              <Link href="/calendar">
                <Image
                  src="/tolfa_logo.png"
                  alt="Centro studi Italo-Norvegese a Tolfa"
                  width={120}
                  height={65}
                  className="object-contain"
                  priority
                />
              </Link>
            </div>

            {/* Center: nav links — desktop only */}
            <div className="hidden sm:flex flex-1 items-center justify-center gap-8">
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

            {/* Right: language + user — desktop only */}
            <div className="hidden sm:flex flex-shrink-0 items-center justify-end gap-3 whitespace-nowrap w-40">
              <div className="flex items-center rounded-full border border-gray-200 bg-gray-50 p-0.5 text-xs font-medium">
                <button
                  onClick={() => setLang('no')}
                  className={`rounded-full px-2.5 py-1 transition-colors ${
                    lang === 'no' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  NO
                </button>
                <button
                  onClick={() => setLang('en')}
                  className={`rounded-full px-2.5 py-1 transition-colors ${
                    lang === 'en' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'
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

            {/* Mobile: hamburger button */}
            <div className="flex sm:hidden flex-1 justify-end">
              <button
                onClick={() => setMenuOpen(o => !o)}
                className="p-2 text-gray-500 hover:text-[#253551]"
                aria-label="Meny"
              >
                {menuOpen ? (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="sm:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2">
            <div className="flex flex-col gap-1">
              {navLinks.map(l => (
                l.external ? (
                  <a
                    key={l.href}
                    href={l.href}
                    className="px-2 py-3 text-base font-medium text-gray-600 hover:text-[#253551]"
                  >
                    {l.label}
                  </a>
                ) : (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`px-2 py-3 text-base font-medium border-b border-gray-50 ${
                      pathname.startsWith(l.href)
                        ? 'text-[#253551]'
                        : 'text-gray-600 hover:text-[#253551]'
                    }`}
                  >
                    {l.label}
                  </Link>
                )
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
              {/* Language toggle */}
              <div className="flex items-center rounded-full border border-gray-200 bg-gray-50 p-0.5 text-xs font-medium">
                <button
                  onClick={() => setLang('no')}
                  className={`rounded-full px-3 py-1.5 transition-colors ${
                    lang === 'no' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'
                  }`}
                >
                  NO
                </button>
                <button
                  onClick={() => setLang('en')}
                  className={`rounded-full px-3 py-1.5 transition-colors ${
                    lang === 'en' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'
                  }`}
                >
                  EN
                </button>
              </div>
              {member ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">{member.family}</span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-400 hover:text-[#253551]"
                  >
                    {t.nav.logout}
                  </button>
                </div>
              ) : (
                <Link href="/login" className="text-sm font-medium text-[#253551]">
                  {t.nav.login}
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
