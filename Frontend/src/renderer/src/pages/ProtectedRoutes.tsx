import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStatus } from '@renderer/hooks/useAuth'
import LoadingCenter from '@renderer/components/LoadingCenter'

export default function ProtectedRoutes() {
  const { isLoading, isError, data: user } = useAuthStatus()

  if (isLoading) {
    return <LoadingCenter />
  }

  if (isError || !user) {
    return <Navigate to="/signin" />
  }

  return (
    <>
      <Outlet />
    </>
  )
}
