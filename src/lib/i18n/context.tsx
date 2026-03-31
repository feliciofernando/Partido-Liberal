'use client'

import { createContext, useContext, useState, useEffect, useSyncExternalStore, ReactNode, useCallback } from 'react'
import pt, { type Dictionary } from './locales/pt'
import en from './locales/en'

export type Locale = 'pt' | 'en'

const dictionaries: Record<Locale, Dictionary> = { pt, en }

interface I18nContextType {
  locale: Locale
  t: Dictionary
  setLocale: (locale: Locale) => void
  isRtl: boolean
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const STORAGE_KEY = 'pl-locale'

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'pt'
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null
    if (saved === 'pt' || saved === 'en') return saved
  } catch {}
  return 'pt'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale)

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = locale === 'pt' ? 'pt-AO' : 'en'
    }
  }, [locale, mounted])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    try {
      localStorage.setItem(STORAGE_KEY, newLocale)
    } catch {}
    document.documentElement.lang = newLocale === 'pt' ? 'pt-AO' : 'en'
  }, [])

  const t = dictionaries[locale]

  return (
    <I18nContext.Provider value={{ locale, t, setLocale, isRtl: false }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useTranslation must be used within I18nProvider')
  }
  return context
}
