import { useAppDispatch } from '@/app/providers/store'
import { logout } from '@/entities/user/auth-thunks'
import { Button } from '@/shared/ui/button'

export function DashboardPage() {
  const dispatch = useAppDispatch()

  const handleLogout = () => {
    void dispatch(logout())
  }

  return (
    <main className="flex min-h-dvh items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </main>
  )
}
