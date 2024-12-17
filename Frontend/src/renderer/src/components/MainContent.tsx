import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Message } from '@/src/types'
import FormInput from '@renderer/components/FormInput'
import AiAvatar from '@renderer/components/icons/AiAvatar'
import { useCreateChat, useGetChatMessages, useStreamMessages } from '@renderer/hooks/useChat'
import useFullModeStore from '@renderer/store/fullModeStore'
import { useQueryClient } from '@tanstack/react-query'
import { Expand, FileArchiveIcon, ImageIcon, Loader2, Send } from 'lucide-react'
import { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { useNavigate, useParams } from 'react-router-dom'
import rehypeHighlight from 'rehype-highlight'

export default function MainContent() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { chatId } = useParams()
  const { mutateAsync: createChat } = useCreateChat()
  const { mutate: sendMessage } = useStreamMessages()
  const { data: messages } = useGetChatMessages(chatId as string, 1, 10, !!chatId)
  //   const { setMessages, messages } = useMessageStore((state) => state)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const { isFetching: loadingMessages } = useGetChatMessages(
    chatId as string,
    1,
    10,
    !!chatId && !messages.length
  )

  const handleSubmit = async (input: string) => {
    // Add the user message to the UI immediately
    const newMessage: Message = { id: String(Date.now()), role: 'user', message: input }
    const newMessages = [...messages, newMessage]
    queryClient.setQueryData(['messages', chatId], newMessages)

    try {
      if (!chatId) {
        const data = await createChat(input)
        const newChatId = data.id
        navigate(`/c/${newChatId}`)

        sendMessage({
          chatId: Number(newChatId),
          input
        })
      } else {
        sendMessage({
          chatId: Number(chatId),
          input
        })
      }
    } catch (error) {
      const ErrorMessage: Message = {
        id: String(Date.now()),
        role: 'model',
        message: 'Failed to send message. Please try again.'
      }
      const newMessages = [...messages, ErrorMessage]
      queryClient.setQueryData(['messages', chatId], newMessages)
    }
  }

  const { isFullMode, toggleFullMode } = useFullModeStore((state) => state)

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollableArea = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      ) as HTMLElement
      scrollableArea.scrollBy({
        top: scrollableArea.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [messages, chatId])

  return (
    <div className={`flex-1 flex flex-col transition-all duration-300`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <AiAvatar width={40} height={40} />
          <div>
            <h2 className="font-semibold">Abdelhamid AI</h2>
          </div>
        </div>
        <div>
          <Button variant="ghost" size="icon" onClick={toggleFullMode}>
            {isFullMode ? <FileArchiveIcon className="h-5 w-5" /> : <Expand className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 overflow-y-auto">
        {loadingMessages ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary text-white" />
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-12 h-12 text-gray-400"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-200">Welcome to Abdelhamid AI</h3>
              <p className="text-gray-400 max-w-sm">
                I&apos;m your personal AI assistant. Feel free to ask me anything - from coding help
                to general knowledge!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {messages.map((message, i) => (
              <div
                key={i}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role !== 'user' && <AiAvatar width={40} height={40} />}
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    message.role === 'user' ? 'bg-[#303030] text-white' : ' text-white'
                  }`}
                >
                  <div className="break-words whitespace-pre-wrap">
                    <ReactMarkdown
                      className="prose prose-invert max-w-none [&_*]:!text-current [&_pre]:!whitespace-pre-wrap [&_code]:!whitespace-pre-wrap"
                      rehypePlugins={[rehypeHighlight]} // Enable syntax highlighting
                    >
                      {message.message}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <Button variant="ghost" size="icon">
              <ImageIcon className="h-5 w-5" />
            </Button>
          </div>
          <FormInput handleSubmit={handleSubmit} />
          <Button type="submit" variant="ghost" size="icon">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
