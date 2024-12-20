import { useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Loader2, MessageSquareOff, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useGetChats } from '@renderer/hooks/useChat'
import EachChat from '@renderer/components/EachChat'
import { Chat } from '@/src/types'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import { useLogout } from '@renderer/hooks/useAuth'
import useFullModeStore from '@renderer/store/fullModeStore'
import useDebounce from '@renderer/hooks/useDebounce'
import { useQueryClient } from '@tanstack/react-query'

export default function SideBar() {
  // Get search query and type from URL params
  const queryClient = useQueryClient()
  const [searchParams, setSearchParam] = useSearchParams()
  const searchQuery = searchParams.get('q') || ''
  const searchType = (searchParams.get('type') as 'title' | 'keywords') || 'title'
  const { ref: loadMoreRef, inView } = useInView()
  const isFullMode = useFullModeStore((state) => state.isFullMode)
  const { mutate: logout } = useLogout()
  const navigate = useNavigate()
  const {
    data: chats,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useGetChats({
    searchQuery,
    searchType
  })
  const invalidateChatsDebounce = useDebounce(invalidateChats)
  const allChats = chats?.pages.flatMap((page) => page.data.map((e) => e)) ?? ([] as Chat[])

  // Create a function to update URL with search params

  useEffect(() => {
    invalidateChatsDebounce()
  }, [searchQuery, searchType])

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  function invalidateChats() {
    queryClient.invalidateQueries({
      queryKey: ['chats']
    })
  }

  const handleCreateChat = () => {
    navigate('/')
  }

  const handleSignOut = () => {
    logout()
  }

  const updateSearchParams = (newQuery: string, newType: 'title' | 'keywords') => {
    setSearchParam((prev) => {
      prev.set('q', newQuery)
      prev.set('type', newType)
      return prev
    })
  }

  return (
    <motion.div
      className={`border-r flex flex-col`}
      initial={{ maxWidth: '350px' }}
      animate={{
        width: isFullMode ? '0%' : '350px',
        opacity: isFullMode ? 0 : 1,
        display: isFullMode ? 'none' : 'flex'
      }}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Chats</h1>
          <div>
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
            <Button variant="ghost" size="icon" onClick={handleCreateChat}>
              <Plus />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap space-x-2 gap-y-2">
            <Select
              value={searchType}
              onValueChange={(value) =>
                updateSearchParams(searchQuery, value as 'title' | 'keywords')
              }
            >
              <SelectTrigger className="w-[180px] bg-zinc-800 border-none text-white">
                <SelectValue placeholder="Search by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="keywords">Keywords</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder={`Search by ${searchType}`}
              value={searchQuery}
              onChange={(e) => updateSearchParams(e.target.value, searchType)}
              className="flex-1 bg-zinc-800 border-none text-white placeholder:text-zinc-400"
            />
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col">
          {status === 'pending' ? (
            <div className="flex items-center justify-center h-20">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : status === 'error' ? (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] p-4 text-center">
              <MessageSquareOff className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-medium text-lg mb-2">Error loading chats</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Please try refreshing the page.
              </p>
            </div>
          ) : allChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] p-4 text-center">
              <MessageSquareOff className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-medium text-lg mb-2">No Chats Yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Start a new conversation or create a chat to get started.
              </p>
            </div>
          ) : (
            <>
              {allChats.map((chat) => (
                <EachChat key={chat.id} chat={chat} />
              ))}
              {/* Intersection Observer Target */}
              <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
                {isFetchingNextPage ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : hasNextPage ? (
                  <span className="text-sm text-zinc-400">Load more</span>
                ) : null}
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </motion.div>
  )
}
