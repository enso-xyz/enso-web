import { useRouter } from "next/navigation"
import * as React from "react"
import { toast } from "sonner"
import {
  MoreHorizontal,
  Share2,
  Trash2,
  Archive,
  MessagesSquare,
  Sparkles,
  Pin,
} from "lucide-react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { archiveChat, deleteChat, toggleChatPin } from "@/lib/supabase/chats"
import { cn } from "@/lib/utils"

interface ChatMenuProps {
  chat: {
    id: string
    type: 'personal' | 'direct' | 'group'
    is_archived?: boolean
    pinned?: boolean
  }
  align?: 'start' | 'center' | 'end'
  className?: string
  children?: React.ReactNode
}

interface MenuItem {
  id: string
  type?: 'divider'
  label?: string
  icon?: React.ComponentType<{ className?: string }>
  onClick?: () => void
  danger?: boolean
  comingSoon?: boolean
}

export function ChatMenu({ chat, align = 'end', className, children }: ChatMenuProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [isArchiving, setIsArchiving] = React.useState(false)
  const [isPinning, setIsPinning] = React.useState(false)
  const [isContextPanelOpen, setIsContextPanelOpen] = React.useState(false)

  const handleArchive = React.useCallback(async () => {
    setIsArchiving(true)
    try {
      await archiveChat(chat.id)
      toast.success('chat archived')
    } catch (error) {
      console.error('Failed to archive chat:', error)
      toast.error('failed to archive chat')
    } finally {
      setIsArchiving(false)
    }
  }, [chat.id])

  const handleDelete = React.useCallback(async () => {
    setIsDeleting(true)
    try {
      await deleteChat(chat.id)
      toast.success('chat deleted')
      router.push('/chat')
    } catch (error) {
      console.error('Failed to delete chat:', error)
      toast.error('failed to delete chat')
    } finally {
      setIsDeleting(false)
    }
  }, [chat.id, router])

  const handlePin = React.useCallback(async () => {
    setIsPinning(true)
    try {
      await toggleChatPin(chat.id)
      toast.success(chat.pinned ? 'chat unpinned' : 'chat pinned')
    } catch (error) {
      console.error('Failed to toggle pin:', error)
      toast.error('failed to update chat')
    } finally {
      setIsPinning(false)
    }
  }, [chat.id, chat.pinned])

  const menuItems = React.useMemo(() => {
    const items: MenuItem[] = [
      {
        id: 'share-context',
        label: 'share context',
        icon: Share2,
        onClick: () => toast.info('coming soon'),
        comingSoon: true
      }
    ]

    if (chat.type === 'group') {
      items.push({
        id: 'pin',
        label: chat.pinned ? 'unpin conversation' : 'pin conversation',
        icon: Pin,
        onClick: handlePin,
        comingSoon: false
      })
    }

    items.push(
      { id: 'divider', type: 'divider' },
      {
        id: 'archive',
        label: 'archive chat',
        icon: Archive,
        onClick: handleArchive,
        comingSoon: false
      },
      {
        id: 'delete',
        label: 'delete chat',
        icon: Trash2,
        onClick: handleDelete,
        danger: true,
        comingSoon: false
      }
    )

    return items
  }, [chat.type, chat.pinned, handleArchive, handleDelete, handlePin])

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children || (
          <button
          className={cn(
              "h-8 w-8 flex items-center justify-center rounded-md",
              "hover:bg-white/5 text-white/40 hover:text-white/60 transition-colors",
            className
          )}
        >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent 
        align={align}
        className="w-60 p-1.5"
        sideOffset={4}
      >
        <div className="space-y-0.5">
          {menuItems.map((item) => {
            if (item.type === 'divider') {
              return <div key={item.id} className="h-px bg-white/5 my-1" />
            }

            const Icon = item.icon!
            return (
              <button
                key={item.id}
                onClick={item.onClick}
                disabled={
                  item.comingSoon || 
                  (item.id === 'delete' && isDeleting) || 
                  (item.id === 'archive' && isArchiving) ||
                  (item.id === 'pin' && isPinning)
                }
                className={cn(
                  "w-full flex items-center gap-3 px-2.5 h-7 rounded-md hover:bg-white/5 transition-colors group relative",
                  item.danger && "hover:bg-red-500/10 text-red-400/60 hover:text-red-400",
                  item.comingSoon && "opacity-50 cursor-not-allowed hover:bg-transparent",
                  (item.id === 'delete' && isDeleting) && "opacity-50 cursor-wait",
                  (item.id === 'archive' && isArchiving) && "opacity-50 cursor-wait",
                  (item.id === 'pin' && isPinning) && "opacity-50 cursor-wait"
                )}
        >
                <Icon className={cn(
                  "w-3.5 h-3.5 text-white/60 group-hover:text-white/80 transition-colors",
                  item.danger && "text-red-400/60 group-hover:text-red-400"
                )} />
                <div className="flex items-center gap-2 flex-1">
                  <span className={cn(
                    "text-sm text-white/80 font-extralight text-left flex-1",
                    item.danger && "text-red-400/60 group-hover:text-red-400"
                  )}>
                    {item.label}
                  </span>
                  {item.comingSoon && (
                    <div className="ml-auto">
                      <span className="text-[10px] font-medium text-white/80 bg-white/10 px-1.5 py-0.5 rounded">
                        soon
          </span>
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}