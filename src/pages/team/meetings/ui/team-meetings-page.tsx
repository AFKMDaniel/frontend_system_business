import { useTranslation } from '@/shared/i18n'

export function TeamMeetingsPage() {
  const { t } = useTranslation()
  return <div>{t('comingSoon.meetings')}</div>
}
