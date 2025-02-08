"use client"

import React, { useState } from "react"
import { ChevronDown, Pencil, RotateCcw, Flower } from "lucide-react"
import { motion } from "framer-motion"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ChatMenu } from "./ChatMenu"
import { updateChatTitle } from "@/lib/supabase/chats"
import { toast } from "sonner"
import { generateChatName } from "@/lib/utils/chat-names"
import { useDispatch, useSelector } from 'react-redux'
import { updateChat } from '@/lib/redux/slices/chatSlice'
import { RootState } from '@/lib/redux/store'
import { AvatarButton } from "@/components/ui/avatar-button"
import { Button } from "@/components/ui/button"

interface ChatHeaderProps {
  chatId: string
  type: 'personal' | 'direct' | 'group'
  title?: string
  participants?: {
    user_id: string
    joined_at: string
    last_read_at: string
    profiles: {
      id: string
      email: string
      full_name?: string | null
      avatar_url?: string | null
    }
  }[]
  demo?: boolean
  isContextPanelOpen?: boolean
  onContextPanelToggle?: () => void
}

export function ChatHeader({ 
  chatId, 
  type, 
  title, 
  participants = [], 
  demo = false,
  isContextPanelOpen = false,
  onContextPanelToggle
}: ChatHeaderProps) {
  const dispatch = useDispatch()
  const chat = useSelector((state: RootState) => 
    state.chat.data.find(c => c.id === chatId)
  )
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(title || '')
  const [isSaving, setIsSaving] = useState(false)

  const currentTitle = chat?.title || title

  const { displayTitle, subtitle } = React.useMemo(() => {
    if (type === 'personal') {
      return { 
        displayTitle: currentTitle,
        subtitle: null
      }
    }
    
    if (type === 'direct' && participants.length > 0) {
      const otherUser = participants[0].profiles
      return { 
        displayTitle: currentTitle || otherUser.email.split('@')[0],
        subtitle: otherUser.full_name ? otherUser.email : null
      }
    }
    
    if (type === 'group') {
      return { 
        displayTitle: currentTitle || 'group chat',
        subtitle: `${participants.length} participants`
      }
    }

    return { 
      displayTitle: 'new conversation',
      subtitle: null
    }
  }, [type, participants, currentTitle])

  const handleSave = async () => {
    if (!editedTitle.trim() || editedTitle === currentTitle) {
      setIsEditing(false)
      setEditedTitle(currentTitle || '')
      return
    }

    setIsSaving(true)
    try {
      await updateChatTitle(chatId, editedTitle.trim())
      dispatch(updateChat({ 
        id: chatId, 
        title: editedTitle.trim(),
        type,
        chat_participants: participants.map(p => ({
          ...p,
          chat_id: chatId
        }))
      }))
      toast.success('chat name updated')
    } catch (error) {
      console.error('Failed to update chat name:', error)
      toast.error('failed to update chat name')
      setEditedTitle(currentTitle || '')
    } finally {
      setIsSaving(false)
      setIsEditing(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
      setEditedTitle(currentTitle || '')
    }
  }

  const handleGenerateNewName = async () => {
    setIsSaving(true)
    try {
      const newName = generateChatName()
      await updateChatTitle(chatId, newName)
      dispatch(updateChat({
        id: chatId,
        title: newName,
        type,
        chat_participants: participants.map(p => ({
          ...p,
          chat_id: chatId
        }))
      }))
      setEditedTitle(newName)
      setIsEditing(false)
      toast.success('chat name updated')
    } catch (error) {
      console.error('Failed to generate new chat name:', error)
      toast.error('failed to update chat name')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="h-14 flex items-center justify-between px-4 border-b border-white/5">
      <div className="flex items-center space-x-3">
        <AvatarButton
          id={chatId}
          size="sm"
          isInteractive={false}
        />
        <div className="flex flex-col min-w-0">
          <div className="flex items-center h-5 group">
            {isEditing ? (
              <div className="flex items-center gap-2 max-w-md">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleSave}
                  autoFocus
                  className="text-sm font-light text-white/90 bg-transparent focus:outline-none placeholder:text-white/40"
                  placeholder="enter chat name"
                />
                <button
                  onClick={handleGenerateNewName}
                  className="p-1 rounded hover:bg-white/5 text-white/40 hover:text-white/60 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            ) :
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsEditing(true)
                    setEditedTitle(currentTitle || '')
                  }}
                  className="text-sm font-light text-white/90 truncate hover:text-white transition-colors text-left"
                >
                  {displayTitle}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(true)
                    setEditedTitle(currentTitle || '')
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/5 text-white/40 hover:text-white/60 transition-all"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
            }
          </div>
          {subtitle && (
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-1 text-xs text-white/40 font-extralight hover:text-white/60 transition-colors">
                  {subtitle}
                  {type === 'group' && <ChevronDown className="w-3 h-3" />}
                </button>
              </PopoverTrigger>
              {type === 'group' && (
                <PopoverContent 
                  className="w-56 p-1.5" 
                  align="start" 
                  sideOffset={8}
                  collisionPadding={16}
                >
                  <div className="space-y-0.5">
                    {participants.map((participant) => (
                      <button
                        key={participant.user_id}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/5 transition-colors text-left group"
                      >
                        <AvatarButton
                          id={participant.user_id}
                          size="sm"
                          isInteractive={false}
                          imageSrc={participant.profiles.avatar_url}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white/80 font-extralight truncate">
                            {participant.profiles.full_name || participant.profiles.email.split('@')[0]}
                          </div>
                          {participant.profiles.full_name && (
                            <div className="text-xs text-white/40 font-extralight truncate">
                              {participant.profiles.email}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              )}
            </Popover>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Context Panel Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onContextPanelToggle}
          className="h-8 w-8 text-white/40 hover:text-white/60"
        >
          <motion.div
            initial={false}
            animate={{ rotate: isContextPanelOpen ? 180 : 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </Button>

        {/* Menu */}
        <ChatMenu
          chat={{
            id: chatId,
            type,
            is_archived: false
          }}
        />
      </div>
    </div>
  )
} 