'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from '@/lib/i18n'
import type { Lang, T } from '@/lib/i18n'

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: T }

const I18nContext = createContext<Ctx>({
  lang: 'no',
  setLang: () => {},
  t: translations.no,
})

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('no')

  useEffect(() => {
    const stored = localStorage.getItem('tolfa_lang') as Lang | null
    if (stored === 'en' || stored === 'no') setLangState(stored)
  }, [])

  function setLang(l: Lang) {
    setLangState(l)
    localStorage.setItem('tolfa_lang', l)
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
