"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { User } from "@supabase/supabase-js"
import { Settings, LogOut, User as UserIcon, Keyboard } from "lucide-react"
import { cn } from "@/lib/utils"

interface UserMenuProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
  onOpenSettings: () => void
}

interface SettingsSection {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const settingsSections: SettingsSection[] = [
  { id: 'profile', label: 'Profile', icon: UserIcon },
  { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: Keyboard }
]

export function UserMenu({ user, isOpen, onClose, onOpenSettings }: UserMenuProps) {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<string>('profile')
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Invisible overlay to handle clicks outside */}
          <div
            onClick={onClose}
            className="fixed inset-0 z-40"
          />

          {/* Menu */}
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 z-50 w-64 rounded-lg border border-white/5 bg-zinc-900/95 backdrop-blur-sm p-1.5"
          >
            {/* User info */}
            <div className="mb-1 p-3 rounded-md border border-white/5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center">
                  {user?.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt={user.email || ""}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-5 w-5 text-white/40" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-light text-white/90">
                    {user?.user_metadata?.full_name || user?.email}
                  </div>
                  {user?.user_metadata?.full_name && (
                    <div className="truncate text-xs font-extralight text-white/40">
                      {user.email}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Menu items */}
            <div className="space-y-1">
              <button
                onClick={() => {
                  onClose()
                  onOpenSettings()
                }}
                className="w-full h-9 flex items-center gap-3 px-2.5 rounded-md text-sm font-light text-white/80 transition-colors hover:bg-white/5"
              >
                <Settings className="h-4 w-4 text-white/40" />
                settings
              </button>
              <button
                onClick={handleSignOut}
                className="w-full h-9 flex items-center gap-3 px-2.5 rounded-md text-sm font-light text-white/80 transition-colors hover:bg-white/5"
              >
                <LogOut className="h-4 w-4 text-white/40" />
                sign out
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 
