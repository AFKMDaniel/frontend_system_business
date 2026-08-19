import { useTranslation } from '@/shared/i18n'

export function ForbiddenPage() {
  const { t } = useTranslation()
  return <main>{t('forbidden.title')}</main>
}
