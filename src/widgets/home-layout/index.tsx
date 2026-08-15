import { Outlet } from 'react-router-dom'

import { Layout } from '@/widgets/layout'

export function HomeLayout() {
  return (
    <Layout title="Home">
      <Outlet />
    </Layout>
  )
}
