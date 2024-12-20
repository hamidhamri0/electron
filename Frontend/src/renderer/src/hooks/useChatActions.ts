import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useDeleteChat, useUpdateChatTitle } from '@renderer/hooks/useChat'
import { Chat } from '@/src/types'

export function useChatActions(chat: Chat) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { mutateAsync: deleteChat } = useDeleteChat()
  const { mutate: updateChatTitle } = useUpdateChatTitle()

  const handleSelectChat = (e: React.MouseEvent, isEditing: boolean) => {
    if ((e.target as HTMLElement).closest('.more-options') || isEditing) {
      e.stopPropagation()
      return
    }
    navigate(`/c/${chat.id}`)
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await deleteChat(chat.id)
    queryClient.setQueryData(['messages', chat.id], [])
  }

  const handleEditSubmit = (
    e: React.KeyboardEvent,
    editedTitle: string,
    setIsEditing: (value: boolean) => void
  ) => {
    if (e.key === 'Enter') {
      setIsEditing(false)
      updateChatTitle({ chatId: chat.id, title: editedTitle })
    }
  }

  const handleShare = async () => {}

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`http://localhost:5173/c/${chat.id}`)
  }

  return {
    handleSelectChat,
    handleDelete,
    handleEditSubmit,
    handleShare,
    copyToClipboard
  }
}
