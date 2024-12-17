import { ChatsData, Message } from '@/src/types'
import { chatApi } from '@renderer/axios/api'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useStreamMessages = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ input, chatId }: { input: string; chatId: number }) => {
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

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulatedMessage = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        accumulatedMessage += chunk
        queryClient.setQueryData(['messages', chatId], (old: Message[] = []) => {
          const lastMessage = old[old.length - 1]

          // If the last message is from AI, update it
          if (lastMessage?.role === 'assistant') {
            return [...old.slice(0, -1), { ...lastMessage, content: accumulatedMessage }]
          }

          // Otherwise, add a new AI message
          return [
            ...old,
            {
              id: Date.now().toString(),
              content: accumulatedMessage,
              role: 'assistant'
            }
          ]
        })
        /*

(prev) => {
          const last = prev[prev.length - 1]
          console.log(prev)
          if (last?.role === 'user') {
            return [...prev, { role: 'model', message: chunk }]
          } else {
            last.message += chunk
            return [...prev.slice(0, prev.length - 1), last]
          }
        }
        */
      }
    }
  })
}

export const useGetChats = ({ page, limit = 3 }: { page: number; limit?: number }) => {
  return useInfiniteQuery({
    queryKey: ['chats'],
    queryFn: async ({ pageParam = page }) => {
      const { data } = await chatApi.get<ChatsData>(`/getChatsByUserId`, {
        params: {
          page: pageParam,
          limit
        }
      })
      console.log('HAHAHA', data)
      return data
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.next) {
        return undefined
      }
      // Use allPages.length + 1 to determine next page number
      return allPages.length + 1
    },
    initialPageParam: page
  })
}
export const useCreateChat = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (title: string) => {
      const { data } = await chatApi.post(`/createChat`, {
        title
      })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['chats']
      })
    }
  })
}

export const useGetChatMessages = (
  chatId: string,
  page: number,
  limit: number,
  enabled: boolean
) => {
  const queryClient = useQueryClient()
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
      // setMessages()
      const messages = data.data.map((message) => ({
        message: message.message,
        role: message.role
      }))
      console.log(messages)
      queryClient.setQueryData(['messages', chatId], messages)
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
