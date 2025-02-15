"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { MoreHorizontal, Copy, Reply, Link2, MessageSquare, Trash2 } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "sonner"
import { useAppSelector } from "@/lib/redux/store"
import { selectMessageReferences } from "@/lib/redux/slices/chatSlice"
import { Message } from '@/types'
import { ContextBar } from "../context/ContextBar"
import type { Context } from "@/types/ai/context"

interface MessageBubbleProps {
  message: {
    id: string
    chat_id: string
    sender_id: string
    content: string
    created_at: string
    status?: 'processing' | 'sent' | 'error'
    sender?: {
      email?: string
      full_name?: string
      avatar_url?: string
    }
  }
  className?: string
  onDelete?: () => void
  onReply?: () => void
  onCopy?: () => void
  onLink?: () => void
  onThread?: () => void
  contexts?: Context[]
}

interface MenuItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  onClick: () => void
  danger?: boolean
  comingSoon?: boolean
}

export function MessageBubble({ 
  message, 
  className,
  onDelete,
  onReply,
  onCopy,
  onLink,
  onThread,
  contexts = []
}: MessageBubbleProps) {
  const references = useAppSelector(state => selectMessageReferences(state, message.id))
  const [isHovered, setIsHovered] = useState(false)

  // Ensure we have a valid date before formatting
  const formattedDate = React.useMemo(() => {
    try {
      const date = new Date(message.created_at)
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return ''
      }
      return formatDate(date)
    } catch (error) {
      console.error('Invalid date:', message.created_at)
      return ''
    }
  }, [message.created_at])

  const menuItems: MenuItem[] = [
    {
      id: 'reply',
      label: 'reply',
      icon: Reply,
      onClick: () => {
        if (onReply) {
          onReply();
        } else {
          toast.info('Reply coming soon');
        }
      }
    },
    {
      id: 'copy',
      label: 'copy text',
      icon: Copy,
      onClick: () => {
        if (onCopy) {
          onCopy()
        } else {
          navigator.clipboard.writeText(message.content)
          toast.success('Message copied to clipboard')
        }
      }
    },
    {
      id: 'link',
      label: 'copy link',
      icon: Link2,
      onClick: () => {
        if (onLink) {
          onLink();
        } else {
          toast.info('Link copying coming soon');
        }
      }
    },
    {
      id: 'thread',
      label: 'start thread',
      icon: MessageSquare,
      onClick: () => {
        if (onThread) {
          onThread();
        } else {
          toast.info('Threading coming soon');
        }
      }
    },
    {
      id: 'delete',
      label: 'delete',
      icon: Trash2,
      onClick: () => {
        if (onDelete) {
          onDelete();
        } else {
          toast.info('Delete coming soon');
        }
      },
      danger: true
    }
  ]

  return (
    <div className={cn("group relative", className)}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-light text-white/80">
              {message.sender?.full_name || message.sender?.email?.split('@')[0] || 'unknown'}
            </span>
            {formattedDate && (
              <span className="text-xs text-white/40 font-extralight">
                {formattedDate}
              </span>
            )}
            {message.status === 'processing' && (
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="relative ml-2"
              >
                <div className="absolute -inset-1 rounded-full bg-[var(--blue-primary)]/20 animate-pulse" />
                <div className="h-2 w-2 rounded-full bg-[var(--blue-primary)]" />
              </motion.div>
            )}
          </div>

          {/* Menu Button - Only visible on hover */}
          <Popover>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "p-1 rounded-md transition-all duration-200",
                  "text-white/40 hover:text-white/60 hover:bg-white/5",
                  !isHovered && "opacity-0"
                )}
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent 
              align="end" 
              className="w-56 p-1.5"
              sideOffset={4}
            >
              <div className="space-y-0.5">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={item.onClick}
                    className={cn(
                      "w-full flex items-center gap-3 px-2.5 h-7 rounded-md hover:bg-white/5 transition-colors group relative",
                      item.danger && "hover:bg-red-500/10 text-red-400/60 hover:text-red-400",
                      item.comingSoon && "opacity-50 cursor-not-allowed hover:bg-transparent"
                    )}
                  >
                    <item.icon className={cn(
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
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="text-sm text-white/80 font-light leading-relaxed">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              code({ className, children }) {
                return (
                  <code className={cn(
                    "rounded bg-white/5 px-1.5 py-0.5 text-[13px] font-mono",
                    className
                  )}>
                    {children}
                  </code>
                )
              },
              pre({ children }) {
                return (
                  <pre className="rounded-lg bg-white/5 p-4 font-mono text-[13px] leading-relaxed">
                    {children}
                  </pre>
                )
              }
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Context bar for message-specific contexts */}
        {contexts.length > 0 && (
          <ContextBar 
            contexts={contexts}
            variant="inline"
            className="mt-3 -mx-2 w-[calc(100%+16px)]"
          />
        )}
      </div>
    </div>
  )
} 
