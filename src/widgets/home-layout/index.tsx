import { Outlet } from 'react-router-dom'

import { useTranslation } from '@/shared/i18n'
import { Layout } from '@/widgets/layout'

export function HomeLayout() {
  const { t } = useTranslation()

  return (
    <Layout title={t('home.title')}>
      <Outlet />
    </Layout>
  )
}
