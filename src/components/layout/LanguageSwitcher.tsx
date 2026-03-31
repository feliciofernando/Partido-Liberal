'use client'

import { useTranslation } from '@/lib/i18n'
import { Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useTranslation()

  const toggleLocale = () => {
    setLocale(locale === 'pt' ? 'en' : 'pt')
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLocale}
      className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md px-2.5 py-1.5"
      aria-label={t.lang.label}
    >
      <Globe className="w-4 h-4" />
      <span className="font-semibold">{locale === 'pt' ? 'PT' : 'EN'}</span>
    </Button>
  )
}
