import { useTranslation } from '@/shared/i18n'

export function TeamMembersPage() {
  const { t } = useTranslation()
  return <div>{t('comingSoon.members')}</div>
}
