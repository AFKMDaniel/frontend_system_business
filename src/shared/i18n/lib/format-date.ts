import { format } from 'date-fns'

import { i18n } from '@/shared/i18n'
import { getDateLocale } from '@/shared/i18n/lib/date-locale'

export function formatDate(date: Date, pattern: string): string {
  return format(date, pattern, { locale: getDateLocale(i18n.language) })
}
