"use client"

import React, { useState, useRef, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Search, Plus, Users, X, ArrowRight } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { PlatformInviteMenu } from "./PlatformInviteMenu"
import { PendingInvite } from "./PendingInvite"
import { toast } from "sonner"

interface Profile {
  id: string
  email: string
  full_name?: string | null
  avatar_url?: string | null
}

interface PendingInvite {
  email: string
  status: 'pending' | 'sent' | 'error'
}

interface NewChatMenuProps {
  isOpen: boolean
  onClose: () => void
  onCreateChat: (userIds: string[]) => void
}

export function NewChatMenu({ 
  isOpen, 
  onClose,
  onCreateChat
}: NewChatMenuProps) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<Profile[]>([])
  const [selectedUsers, setSelectedUsers] = useState<Profile[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [isPlatformMenuOpen, setIsPlatformMenuOpen] = useState(false)
  const [isEmailMode, setIsEmailMode] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([])

  const searchProfiles = async (searchQuery: string) => {
    const supabase = getSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, avatar_url')
      .or(`email.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%`)
      .neq('id', user.id)
      .limit(5)

    if (error) {
      console.error('Error searching profiles:', error)
      return []
    }

    return profiles as Profile[]
  }

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      setIsExiting(false)
      setSelectedUsers([])
      setQuery("")
      setIsEmailMode(false)
      setIsPlatformMenuOpen(false)
    }
  }, [isOpen])

  useEffect(() => {
    const search = async () => {
      if (!isEmailMode && query.startsWith("@") && query.length > 1) {
        setIsLoading(true)
        try {
          const searchQuery = query.slice(1).toLowerCase()
          const results = await searchProfiles(searchQuery)
          if (!isExiting) {
        setSuggestions(results)
            setSelectedIndex(-1)
          }
        } catch (error) {
          console.error('Error searching profiles:', error)
          setSuggestions([])
        } finally {
          setIsLoading(false)
        }
      } else {
        setSuggestions([])
        setSelectedIndex(-1)
      }
    }

    const timeoutId = setTimeout(search, 300)
    return () => clearTimeout(timeoutId)
  }, [query, isExiting, isEmailMode])

  useEffect(() => {
    if (suggestions.length > 0) {
      setIsPlatformMenuOpen(false)
    }
  }, [suggestions])

  const addUser = (profile: Profile) => {
    if (!selectedUsers.find(u => u.id === profile.id)) {
      setSuggestions([])
      setTimeout(() => {
        setSelectedUsers(prev => [...prev, profile])
      }, 150)
    }
    setQuery("")
    setTimeout(() => inputRef.current?.focus(), 300)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isEmailMode) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSendInvite()
      }
      return
    }

    if (suggestions.length > 0) {
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex(prev => 
          prev <= 0 ? suggestions.length - 1 : prev - 1
        )
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex(prev => 
          prev >= suggestions.length - 1 ? 0 : prev + 1
        )
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault()
        addUser(suggestions[selectedIndex])
      }
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleCreateChat()
    } else if (e.key === "Backspace" && query === "" && selectedUsers.length > 0) {
      setSelectedUsers(prev => prev.slice(0, -1))
    }
  }

  const removeUser = (userId: string) => {
    setSelectedUsers(prev => prev.filter(u => u.id !== userId))
  }

  const menuVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10, transition: { duration: 0.2 } }
  }

  const handleClose = () => {
    setIsExiting(true)
    setSuggestions([])
    setSelectedUsers([])
    setQuery("")
    onClose()
  }

  const handlePlatformSelect = (platform: string) => {
    if (platform === 'email') {
      setIsEmailMode(true)
      setQuery("")
      setIsPlatformMenuOpen(false)
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }

  const validateEmail = (email: string) => {
    return email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  }

  const checkExistingUser = async (email: string) => {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, avatar_url')
      .ilike('email', email.toLowerCase())
      .maybeSingle()
    
    if (error) {
      console.error('Error checking existing user:', error)
      return null
    }
    
    if (!data) return null

    return {
      id: data.id,
      email: data.email,
      full_name: data.full_name || null,
      avatar_url: data.avatar_url || null
    } as Profile
  }

  const handleSendInvite = async () => {
    if (!query) return

    // Validate email
    if (!validateEmail(query)) {
      toast.error('Please enter a valid email address')
      return
    }

    // Check if already invited
    if (pendingInvites.some(invite => invite.email.toLowerCase() === query.toLowerCase())) {
      toast.error('Invite already sent to this email')
      return
    }

    // Check if user exists
    const existingUser = await checkExistingUser(query)
    if (existingUser) {
      const fullProfile: Profile = {
        id: existingUser.id as string,
        email: existingUser.email as string,
        full_name: existingUser.full_name || null,
        avatar_url: existingUser.avatar_url || null
      }
      addUser(fullProfile)
      setIsEmailMode(false)
      return
    }

    try {
      const res = await fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: query, chatId: 'temp-id' })
      })
      
      if (!res.ok) throw new Error('Failed to send invite')
      
      // Only add to pending invites after successful send
      setPendingInvites(prev => [...prev, { 
        email: query, 
        status: 'sent' 
      }])
      
      setQuery("")
      setIsEmailMode(false) // Return to base menu
      toast.success('Invite sent')
    } catch (error) {
      console.error('Error sending invite:', error)
      toast.error('Failed to send invite')
    }
  }

  const removePendingInvite = (email: string) => {
    setPendingInvites(prev => prev.filter(invite => invite.email !== email))
  }

  const exitEmailMode = () => {
    setIsEmailMode(false)
    setQuery("")
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const togglePlatformMenu = () => {
    if (isEmailMode) {
      handleSendInvite()
    } else {
      setSuggestions([])
      setTimeout(() => {
        setIsPlatformMenuOpen(prev => !prev)
      }, 150)
    }
  }

  const handleCreateChat = () => {
    if (selectedUsers.length > 0) {
      onCreateChat(selectedUsers.map(u => u.id))
    } else {
      // Create personal note if no users added
      onCreateChat([])
    }
    handleClose()
  }

  const getSelectedUserIds = () => {
    return selectedUsers.map(u => u.id)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-40"
          />
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-[68px] left-4 right-4 z-50"
          >
            <AnimatePresence mode="wait">
              {/* Show suggestions if they exist */}
              {!isEmailMode && suggestions.length > 0 ? (
                <motion.div
                  key="suggestions"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="bg-zinc-900/95 backdrop-blur-sm rounded-lg border border-white/5 overflow-hidden p-1.5 mb-2"
                >
                  {suggestions.map((profile, index) => (
                    <button
                      key={profile.id}
                      onClick={() => addUser(profile)}
                      className={cn(
                        "w-full flex items-center gap-3 px-2.5 h-7 rounded-md transition-colors group",
                        index === selectedIndex ? "bg-white/10" : "hover:bg-white/5"
                      )}
                    >
                      <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                        {profile.avatar_url ? (
                          <img 
                            src={profile.avatar_url} 
                            alt={profile.full_name || profile.email}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                        ) : (
                          <Users className="w-2.5 h-2.5 text-white/60" />
                        )}
                      </div>
                        <div className="text-sm text-white/80 font-extralight">
                        {profile.full_name || profile.email.split('@')[0]}
                      </div>
                    </button>
                  ))}
                </motion.div>
              ) : /* Show platform menu if it's open */
              !isEmailMode && isPlatformMenuOpen ? (
                <motion.div
                  key="platform-menu"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ 
                    duration: 0.15,
                    delay: 0.05
                  }}
                >
                  <PlatformInviteMenu 
                    isOpen={true}
                    onClose={() => setIsPlatformMenuOpen(false)}
                    onSelect={handlePlatformSelect}
                  />
                </motion.div>
              ) : /* Show tag carousel if there are tags */
              (selectedUsers.length > 0 || pendingInvites.length > 0) ? (
                <motion.div
                  key="tag-carousel"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="mb-2"
                >
                  <div className="overflow-x-auto flex gap-1.5 scrollbar-none">
                    <AnimatePresence>
                      {selectedUsers.map((user) => (
                        <motion.div
                          key={user.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="flex items-center gap-1.5 px-1.5 py-0.5 rounded bg-white/5 text-sm text-white/60 shrink-0"
                        >
                          <div className="w-4 h-4 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                            {user.avatar_url ? (
                              <img 
                                src={user.avatar_url} 
                                alt={user.full_name || user.email}
                                className="w-4 h-4 rounded-full object-cover"
                              />
                            ) : (
                              <Users className="w-2 h-2 text-white/60" />
                            )}
                          </div>
                          <span className="truncate max-w-[100px]">
                            {user.email.split('@')[0]}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              removeUser(user.id)
                            }}
                            className="text-white/40 hover:text-white/60"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </motion.div>
                      ))}
                      {pendingInvites.map((invite) => (
                        <motion.div
                          key={invite.email}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                        >
                          <PendingInvite
                            email={invite.email}
                            onRemove={() => removePendingInvite(invite.email)}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* Input field */}
            <div className="relative flex items-center bg-zinc-900/95 backdrop-blur-sm rounded-lg border border-white/5 h-[44px]">
              <div className="w-10 flex items-center justify-center border-r border-white/5">
                {isEmailMode ? (
                  <button
                    onClick={exitEmailMode}
                    className="text-white/40 hover:text-white/60 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      togglePlatformMenu()
                    }}
                    className="text-white/40 hover:text-white/60 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex-1 flex items-center px-3">
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsPlatformMenuOpen(false)}
                  placeholder={isEmailMode ? "enter email address..." : "@ to add people..."}
                  className="flex-1 bg-transparent text-sm text-white/80 font-extralight placeholder:text-white/20 focus:outline-none"
                />
              </div>
              <div className="w-10 flex items-center justify-center border-l border-white/5">
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    if (isEmailMode) {
                      handleSendInvite()
                    } else {
                      handleCreateChat()
                    }
                  }}
                  className="text-white/40 hover:text-white/60 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 