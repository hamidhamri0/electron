export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  status?: 'online' | 'offline'
  lastSeen?: Date
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
  status: 'sent' | 'delivered' | 'read'
}

export interface Chat {
  id: string
  participants: User[]
  lastMessage?: Message
  unreadCount: number
}
