"use client"

import React from "react"
import { Chat } from "@/lib/supabase/chats"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AvatarButton } from "@/components/ui/avatar-button"

interface PinnedChatsProps {
  chats: Chat[]
}

export function PinnedChats({ chats }: PinnedChatsProps) {
  if (chats.length === 0) return null

  return (
    <div className="px-4 py-2 border-b border-white/5">
      <ScrollArea className="w-full" orientation="horizontal">
        <div className="flex gap-4 pb-2">
          {chats.map((chat) => (
            <AvatarButton
              key={chat.id}
              id={chat.id}
              href={`/chat/${chat.id}`}
              size="lg"
              vertical
              label={chat.title}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
} 