"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Logo } from "@/components/ui/logo"
import { NewChatMenu } from "@/components/chat/NewChatMenu"
import { ChatList } from "@/components/chat/ChatList"
import { UserMenu } from "@/components/chat/UserMenu"
import { SettingsModal } from "@/components/chat/SettingsModal"
import { createChat } from "@/lib/supabase/chats"
import { useGetProfileQuery } from "@/lib/redux/slices/apiSlice"
import { toast } from "sonner"

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const router = useRouter()
  const { data: user, isLoading } = useGetProfileQuery()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [isLoading, user, router])

  const handleCreateChat = async (userIds: string[]) => {
    try {
      const chat = await createChat(
        userIds,
        userIds.length === 0 ? 'personal' : 'group'
      )
      router.push(`/chat/${chat.id}`)
      setIsMenuOpen(false)
    } catch (error) {
      console.error('Failed to create chat:', error)
      toast.error('failed to create conversation')
    }
  }

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        <div className="text-sm font-extralight text-white/40">loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="w-80 border-r border-white/5 flex flex-col">
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-white/5">
          <div className="flex items-center">
            <Logo size="sm" className="mr-2" />
            <span className="text-sm font-extralight">enso</span>
          </div>
          
          {/* User menu trigger */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(true)}
              className="relative h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden transition-transform hover:scale-105"
            >
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt={user.email || ""}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm font-light text-white/40">
                  {user.email?.[0].toUpperCase()}
                </span>
              )}
            </button>

            {/* User menu */}
            <UserMenu
              user={user}
              isOpen={isUserMenuOpen}
              onClose={() => setIsUserMenuOpen(false)}
              onOpenSettings={() => {
                setIsUserMenuOpen(false)
                setIsSettingsOpen(true)
              }}
            />
          </div>
        </div>
        
        {/* Chat list */}
        <div className="flex-1 overflow-auto">
          <ChatList />
        </div>

        {/* New chat button */}
        <div className="relative p-4 border-t border-white/5">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-full px-4 py-2 rounded-lg bg-zinc-900/50 border border-white/5 text-sm text-white/80 font-extralight hover:bg-zinc-900 transition-colors"
          >
            new chat
          </button>

          <NewChatMenu
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            onCreateChat={handleCreateChat}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>

      {/* Settings modal */}
      <SettingsModal
        user={user}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  )
} 