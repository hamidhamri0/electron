import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useVerifyEmail } from '@renderer/hooks/useAuth'

export default function VerificationEmail() {
  console.log('VerificationEmail')
  const { mutate, isPending: isLoading, error, data } = useVerifyEmail()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      mutate(token)
    } else {
      navigate('/')
    }
    return () => {}
  }, [token])

  console.log(isLoading, error)

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-md mx-auto mt-10">
        <CardContent className="flex flex-col items-center justify-center gap-4 p-4">
          {isLoading ? (
            <div className="flex flex-col items-center">
              <Loader className="animate-spin h-8 w-8 text-primary" />
              <p className="mt-2 text-primary">Verifying your email...</p>
            </div>
          ) : data ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-green-600">{data?.message}</h2>
              <p className="mt-2">Redirecting to home...</p>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600">Verification Failed</h2>
              {error?.response?.data?.message ? (
                <p className="mt-2">{error?.response?.data?.message}</p>
              ) : null}
              <Button variant="outline" onClick={() => navigate('/')}>
                Go to Home
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
