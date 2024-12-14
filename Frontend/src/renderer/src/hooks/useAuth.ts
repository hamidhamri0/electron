import { authApi } from '@renderer/axios/api'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'

type User = {
  id: string
  email: string
  fullname: string
  email_confirmed: boolean
  createdAt: string
}

export const useAuthStatus = () => {
  return useQuery({
    queryKey: ['authStatus'],
    queryFn: async () => {
      console.log('RUN')
      const { data } = await authApi.get<User>('/me', {
        withCredentials: true // Important for sending cookies
      })
      return data
    }
  })
}

export const useLogin = () => {
  const navigate = useNavigate()
  return useMutation<
    { message: string },
    AxiosError<{ message: string }>,
    {
      email: string
      password: string
    }
  >({
    mutationFn: async (credentials) => {
      const { data } = await authApi.post('/login', credentials, {
        withCredentials: true
      })
      return data
    },
    mutationKey: ['login'],
    onSuccess: () => {
      navigate('/')
    }
  })
}

export const useSignup = () => {
  const navigate = useNavigate()
  return useMutation<
    string,
    AxiosError<{ message: string }>,
    {
      email: string
      password: string
      fullname: string
    }
  >({
    mutationKey: ['signup'],
    mutationFn: async (credentials) => {
      await authApi.post('/signup', credentials, {
        withCredentials: true
      })
      return credentials.email
    },
    onSuccess: (email) => {
      navigate(
        `/verify-email?${new URLSearchParams({
          email
        })}`
      )
    }
  })
}

export const useLogout = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const { data } = await authApi.post(
        '/logout',
        {},
        {
          withCredentials: true
        }
      )
      return data
    },
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: ['authStatus']
      })
      navigate('/signin')
    }
  })
}

export const useVerifyEmail = () => {
  const navigate = useNavigate()
  return useMutation<{ message: string }, AxiosError<{ message: string }>, string>({
    mutationFn: async (token) => {
      const { data } = await authApi.post(`/confirm-email/${token}`)
      return data
    },
    onSuccess: () => {
      navigate('/')
    }
  })
}
