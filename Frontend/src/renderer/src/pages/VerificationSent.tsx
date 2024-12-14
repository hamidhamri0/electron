import { Mail } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Navigate, useSearchParams } from 'react-router-dom'

export default function VerificationSent() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email')
  if (!email) {
    return <Navigate to="/signin" />
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="max-w-md w-full p-8 space-y-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="p-3 bg-primary/10 rounded-full">
            <Mail className="h-12 w-12 text-primary" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight">Verify your email</h1>

          <p className="text-muted-foreground max-w-sm">
            We&rsquo;ve sent a verification link to your email address {email}. Please check your
            inbox and click the link to verify your account.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-green-600 text-center">Verification email has been resent!</p>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            Didn&apos;t receive an email? Check your spam folder or contact{' '}
            <a href="mailto:support@example.com" className="text-primary hover:underline">
              support
            </a>
          </p>
        </div>
      </Card>
    </div>
  )
}
