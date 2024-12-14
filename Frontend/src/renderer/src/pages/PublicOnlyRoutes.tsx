import { useAuthStatus } from '@renderer/hooks/useAuth'
import { Navigate, Outlet } from 'react-router-dom'
import LoadingCenter from '@renderer/components/LoadingCenter'

export const PublicOnlyRoutes = () => {
  console.log('PublicOnlyRoutes')
  const { isLoading, data: user } = useAuthStatus()

  if (isLoading) {
    return <LoadingCenter />
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
