import { enUS, ru } from 'date-fns/locale'
import type { Locale } from 'date-fns/locale'

const LOCALES: Record<string, Locale> = {
  en: enUS,
  ru,
}

export function getDateLocale(language: string): Locale {
  const base = language.split('-')[0]
  return LOCALES[base] ?? enUS
}
