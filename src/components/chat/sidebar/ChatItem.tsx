"use client"

import React from "react"
import { useRouter, useParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Chat } from "@/lib/supabase/chats"
import { getChatGradient } from "@/lib/utils/colors"
import { motion } from "framer-motion"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/redux/store"

interface ChatItemProps {
  chat: Chat
  className?: string
}

export function ChatItem({ chat, className }: ChatItemProps) {
  const router = useRouter()
  const params = useParams()
  const currentUser = useSelector((state: RootState) => state.auth.user)
  const currentChatId = params?.id as string

  const getChatTitle = () => {
    if (chat.type === 'personal') return 'personal chat'
    if (chat.type === 'direct') {
      // Get the other participant's name
      const otherParticipant = chat.chat_participants?.find(p => 
        p.profiles && p.profiles.id !== currentUser?.id
      )?.profiles
      return otherParticipant?.full_name || otherParticipant?.email?.split('@')[0] || 'new conversation'
    }
    return chat.title || 'group chat'
  }

  return (
    <button
      onClick={() => router.push(`/chat/${chat.id}`)}
      className={cn(
        "w-full px-3 py-2.5 rounded-lg transition-colors text-left group relative",
        "hover:bg-white/5",
        chat.id === currentChatId && "bg-white/5",
        className
      )}
    >
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-light text-white/90 truncate">
            {getChatTitle()}
          </span>
          {chat.has_unread && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "w-1.5 h-1.5 rounded-full bg-gradient-to-br shadow-lg",
                getChatGradient(chat.id),
                "shadow-[0_0_8px_rgba(139,92,246,0.3)]"
              )}
            />
          )}
        </div>
        {chat.last_message && (
          <motion.p
            key={chat.last_message.content}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-sm text-white/60 font-extralight truncate text-left"
          >
            {chat.last_message.content}
          </motion.p>
        )}
      </div>
    </button>
  )
} 