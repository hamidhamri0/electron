import { useState } from 'react'

import {
  Phone,
  Video,
  Plus,
  ImageIcon,
  GiftIcon as Gif,
  Sticker,
  Send,
  Expand,
  FileArchiveIcon as Compress
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@radix-ui/react-avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import { useAuthStatus, useLogout } from '@renderer/hooks/useAuth'

interface Message {
  id: number
  text: string
  sender: string
  timestamp: string
}

function Home() {
  const [isFullMode, setIsFullMode] = useState(false)
  const [selectedChat, setSelectedChat] = useState<number | null>(null)
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Hey, how are you?', sender: 'them', timestamp: '4m ago' },
    { id: 2, text: "I'm good, thanks! How about you?", sender: 'you', timestamp: '3m ago' },
    { id: 3, text: 'Doing well, thanks for asking!', sender: 'them', timestamp: '2m ago' },
    { id: 4, text: "That's great to hear!", sender: 'you', timestamp: '1m ago' }
  ])

  // const navigate = useNavigate()
  const { data: user } = useAuthStatus()
  const { mutate: logout } = useLogout()

  const handleSignOut = () => {
    logout()
  }

  const toggleFullMode = () => {
    setIsFullMode(!isFullMode)
  }

  return (
    <div className="flex h-screen bg-[#1C1C1C] text-white">
      {/* Left Sidebar */}
      <motion.div
        className={`border-r flex flex-col`}
        initial={{ width: '33.333333%' }}
        animate={{
          width: isFullMode ? '0%' : '33.333333%',
          opacity: isFullMode ? 0 : 1,
          display: isFullMode ? 'none' : 'flex'
        }}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Chats</h1>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </Button>
          </div>
          <div className="relative mb-4">
            <Input
              type="search"
              placeholder="Search Messenger"
              className="w-full bg-gray-800 border-none"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 p-3 hover:bg-gray-800 cursor-pointer ${selectedChat === i ? 'bg-gray-700' : ''}`}
              onClick={() => setSelectedChat(i)}
            >
              <Avatar className="h-10 w-10">
                <img
                  src={`https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://fdczvxmwwjwpwbeeqcth.supabase.co/storage/v1/object/public/images/50dab922-5d48-4c6b-8725-7fd0755d9334/3a3f2d35-8167-4708-9ef0-bdaa980989f9.png`}
                  alt="User"
                  className="rounded-full"
                />
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">User {i + 1}</p>
                <p className="text-sm text-gray-400 truncate">Last message...</p>
              </div>
              <span className="text-xs text-gray-400">2m</span>
            </div>
          ))}
        </ScrollArea>
      </motion.div>

      {/* RIGHT SIDE*/}
      <div className={`flex-1 flex flex-col transition-all duration-300`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <img
                src="https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://fdczvxmwwjwpwbeeqcth.supabase.co/storage/v1/object/public/images/50dab922-5d48-4c6b-8725-7fd0755d9334/3a3f2d35-8167-4708-9ef0-bdaa980989f9.png"
                alt="Current chat"
                className="rounded-full"
              />
            </Avatar>
            <div>
              <h2 className="font-semibold">
                User {selectedChat !== null ? selectedChat + 1 : ''}
              </h2>
              <p className="text-sm text-gray-400">Active 4m ago</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" size="icon">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleFullMode}>
              {isFullMode ? <Compress className="h-5 w-5" /> : <Expand className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'you' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    message.sender === 'you' ? 'bg-[#8A2BE2] text-white' : 'bg-gray-700 text-white'
                  }`}
                >
                  <p>{message.text}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <Button variant="ghost" size="icon">
                <Plus className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <ImageIcon className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Gif className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Sticker className="h-5 w-5" />
              </Button>
            </div>
            <Input placeholder="Aa" className="flex-1 bg-gray-800 border-none" />
            <Button variant="ghost" size="icon">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
