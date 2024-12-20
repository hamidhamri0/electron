export interface User {
  id: string
  fullname: string
  email: string
}

export type Message = {
  id: string
  message: string
  role: 'user' | 'model'
}

export type Chat = {
  id: number
  title: string
  keywords: string[]
  created_at: Date
  last_message: Date
}

export type ChatsData = {
  data: Chat[]
  next: boolean
}
