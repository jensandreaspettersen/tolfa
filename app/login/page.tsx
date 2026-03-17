'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/lib/auth'
import { useI18n } from '@/components/I18nProvider'

export default function LoginPage() {
  const router = useRouter()
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) {
      setError(t.login.fillBoth)
      return
    }
    login(email, password)
    router.push('/calendar')
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-2xl font-semibold text-gray-900">{t.login.title}</h1>
        <p className="mb-8 text-sm text-gray-500">{t.login.subtitle}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{t.login.email}</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t.login.emailPlaceholder}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#253551] focus:ring-2 focus:ring-[#253551]/10"
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{t.login.password}</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={t.login.passwordPlaceholder}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#253551] focus:ring-2 focus:ring-[#253551]/10"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#253551] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1e2c43] transition-colors"
          >
            {t.login.submit}
          </button>
        </form>
      </div>
    </div>
  )
}
