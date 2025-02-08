"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useGetChatByIdQuery } from "@/lib/redux/slices/apiSlice"
import { MessageList } from "../messages/MessageList"
import { MessageInput } from "../messages/MessageInput"
import { ReferencePanel } from "../references/ReferencePanel"
import { ContextPanel } from "../context/ContextPanel"
import { ChatHeader } from "../ChatHeader"
import { useChatContext } from "@/hooks/useChatContext"
import { cn } from "@/lib/utils"

export function ChatContainer() {
  const params = useParams()
  const router = useRouter()
  const chatId = params?.id as string
  const containerRef = useRef<HTMLDivElement>(null)
  const [isContextPanelOpen, setIsContextPanelOpen] = useState(true)

  const {
    data: chat,
    isLoading: isChatLoading,
    error: chatError,
  } = useGetChatByIdQuery(chatId, {
    skip: !chatId,
  })

  const {
    summary,
    topics,
    files,
    participants,
    isLoading: isContextLoading,
    error: contextError
  } = useChatContext(chatId)

  useEffect(() => {
    if (chatError || contextError) {
      router.push("/chat")
    }
  }, [chatError, contextError, router])

  if (isChatLoading || isContextLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[var(--blue-primary)] to-[var(--purple-primary)] animate-spin" />
          <div className="absolute inset-0 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-black/80" />
          </div>
        </div>
      </div>
    )
  }

  if (!chat) {
    return null
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <div
            ref={containerRef}
            className={cn(
              "flex h-full flex-col overflow-hidden",
              "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
            )}
          >
            <ChatHeader
              chatId={chatId}
              type={chat.type}
              title={chat.title}
              participants={chat.chat_participants}
            />

            <ContextPanel
              chatId={chatId}
              summary={summary}
              topics={topics}
              files={files}
              isOpen={isContextPanelOpen}
              onOpenChange={setIsContextPanelOpen}
              className="border-t bg-background px-4 py-2"
            />

            <div className="flex-1 flex flex-col min-h-0">
              <MessageList
                messages={chat.messages}
                className="flex-1 overflow-y-auto p-4"
              />
              <MessageInput
                chatId={chatId}
                className="border-t bg-background px-4 py-2"
              />
            </div>
          </div>
        </div>
        <div className="w-80 border-l border-white/5 flex flex-col">
          <ReferencePanel
            references={chat.messages[chat.messages.length - 1]?.references}
            className="h-80 border-t bg-muted/50 p-4"
          />
        </div>
      </div>
    </div>
  )
} 
