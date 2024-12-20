import { streamReader } from '@/lib/stream'
import { ChatsData, Message } from '@/src/types'
import { chatApi } from '@renderer/axios/api'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'

export const useStreamMessages = () => {
  const queryClient = useQueryClient()
  const [, setSearchParams] = useSearchParams()
  return useMutation({
    mutationFn: async ({ input, chatId }: { input: string; chatId: string }) => {
      const response = await fetch('http://localhost:5000/api/chat/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ message: input, chatId })
      })

      if (!response.body) {
        throw new Error('ReadableStream not supported in this browser.')
      }

      queryClient.setQueryData<Message[]>(['messages', chatId], (prev = []) => {
        return [...prev, { id: crypto.randomUUID(), role: 'user', message: input }]
      })

      try {
        // Stream AI response
        let isFirstChunk = true
        for await (const chunk of streamReader(response)) {
          queryClient.setQueryData<Message[]>(['messages', chatId], (prev = []) => {
            prev
            if (isFirstChunk) {
              isFirstChunk = false
              return [...prev, { id: crypto.randomUUID(), role: 'model', message: chunk }]
            } else {
              const messages = [...prev]
              // Create a copy of the messages array
              const updatedMessages = [...messages]
              const lastMessage = { ...updatedMessages[updatedMessages.length - 1] } as Message

              // Update the last message
              lastMessage.message += chunk

              // Replace the last message with the updated one
              updatedMessages[updatedMessages.length - 1] = lastMessage

              return updatedMessages
            }
          })
        }
      } catch (err) {
        console.error('Error reading stream:', err)
      }
    },

    onSuccess() {
      setSearchParams((prev) => {
        prev.delete('new')
        return prev
      })
    }
  })
}

export const useGetChats = ({
  searchQuery,
  searchType
}: {
  searchQuery: string
  searchType: string
}) => {
  return useInfiniteQuery({
    queryKey: ['chats'],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await chatApi.get<ChatsData>(`/getChatsByUserId`, {
        params: {
          page: pageParam,
          limit: 3,
          type: searchType,
          search: searchQuery
        }
      })
      return data
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.next) {
        return undefined
      }
      // Use allPages.length + 1 to determine next page number
      return allPages.length + 1
    },
    initialPageParam: 1
  })
}
export const useCreateChat = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    mutationFn: async (title: string) => {
      const { data } = await chatApi.post(`/createChat`, {
        title
      })
      return data
    },
    onSuccess: (chat) => {
      const newChatId = chat.id
      console.log('NAVIGATING')
      navigate(`/c/${newChatId}?new=true`)
      queryClient.invalidateQueries({
        queryKey: ['chats']
      })
    }
  })
}

export const useGetChatMessages = (
  chatId: string | undefined,
  page: number,
  limit: number,
  enabled: boolean
) => {
  return useQuery({
    initialData: [],
    enabled,
    queryKey: ['messages', chatId],
    queryFn: async ({ signal }) => {
      const { data } = await chatApi.get<{
        data: Message[]
        next: boolean
      }>(`/getMessagesByChatId`, {
        signal,
        params: {
          chatId,
          page,
          limit
        }
      })
      const messages = data.data.map((message) => ({
        message: message.message,
        role: message.role
      }))
      return messages
    }
  })
}

export const useUpdateChatTitle = () => {
  const query = useQueryClient()
  return useMutation({
    mutationFn: async ({ chatId, title }: { chatId: number; title: string }) => {
      const { data } = await chatApi.patch(`/updateChatTitleById/${chatId}`, {
        title
      })
      return data
    },
    onSuccess: () => {
      query.invalidateQueries({
        predicate: (mutation) => {
          return mutation.queryKey.includes('chats')
        }
      })
    }
  })
}

export const useDeleteChat = () => {
  const query = useQueryClient()
  return useMutation({
    mutationFn: async (chatId: number) => {
      const { data } = await chatApi.delete(`/deleteChatById/${chatId}`)
      return data
    },
    onSuccess: () => {
      query.invalidateQueries({
        predicate: (mutation) => mutation.queryKey.includes('chats')
      })
    }
  })
}
