import { useState } from 'react'
import { MoreVertical, Share, Edit, Trash } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import dayjs from 'dayjs'
import { Chat } from '@/src/types'
import { useChatActions } from '@renderer/hooks/useChatActions'
import { useParams } from 'react-router-dom'

export default function EachChat({ chat }: { chat: Chat }) {
  const params = useParams()
  const chatId = Number(params.chatId)

  const [showAllKeywords, setShowAllKeywords] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(chat.title)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  const { copyToClipboard, handleDelete, handleEditSubmit, handleSelectChat, handleShare } =
    useChatActions(chat)

  return (
    <div
      className={`flex items-center mb-2 gap-3 p-3 hover:bg-gray-800 cursor-pointer ${
        chatId === chat.id ? 'bg-gray-700' : ''
      }`}
      onClick={(e) => handleSelectChat(e, isEditing)}
    >
      <div className="flex-1 min-w-0 overflow-hidden">
        {isEditing ? (
          <Input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={(e) => handleEditSubmit(e, editedTitle, setIsEditing)}
            onClick={(e) => e.stopPropagation()}
            className="mb-1"
            autoFocus
          />
        ) : (
          <div className="flex justify-between items-start mb-2">
            <p className="font-semibold mb-1">{chat.title}</p>
            <div className="more-options" onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 ">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsShareModalOpen(true)}>
                    <Share className="mr-2 h-4 w-4" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
        <div className="flex items-center flex-wrap gap-2 mb-2">
          {(showAllKeywords ? chat.keywords : chat.keywords.slice(0, 4)).map((keyword) => (
            <Badge
              key={keyword}
              variant="secondary"
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400"
            >
              {keyword}
            </Badge>
          ))}
          {chat.keywords.length > 4 && (
            <span
              onClick={(e) => {
                e.stopPropagation()
                setShowAllKeywords(!showAllKeywords)
              }}
              className="text-slate-300  inline-block bg-[#1C1C1C] border border-gray-700 px-2 py-1 rounded-full text-xs mr-1 mb-1 cursor-pointer"
            >
              {showAllKeywords ? 'Show less' : `+${chat.keywords.length - 4}`}
            </span>
          )}
        </div>
        <p className="text-xs text-zinc-400">Last message • {dayjs(chat.last_message).fromNow()}</p>
      </div>

      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Chat</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <Input
                readOnly
                defaultValue={`http://localhost:5173/c/${chat.id}`}
                className="flex-1"
              />
              <Button onClick={copyToClipboard}>Copy</Button>
            </div>
            <Button onClick={handleShare}>Create Link</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
