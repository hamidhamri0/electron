import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { useLogin } from '@renderer/hooks/useAuth'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

type SignInForm = z.infer<typeof schema>

function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignInForm>({
    resolver: zodResolver(schema)
  })
  const { mutate: login, error } = useLogin()

  const onSubmit = async (data: SignInForm) => {
    login({
      email: data.email,
      password: data.password
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Sign In</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className="w-full px-3 py-2 border rounded"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block mb-1">
              Password
            </label>
            <input
              {...register('password')}
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>
          <button type="submit" className="w-full bg-gray-900 text-white py-2 rounded">
            Sign In
          </button>
          {error?.response?.data?.message ? (
            <p className="text-red-500 text-sm">{error.response.data.message}</p>
          ) : null}
        </form>
        <p className="mt-4 text-center">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-gray-900 font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignIn
