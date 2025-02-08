"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createBrowserClient } from "@supabase/ssr"
import { User } from "@supabase/supabase-js"
import { 
  X, UserIcon, Keyboard, ChevronRight,
  Settings as SettingsIcon, Bell, Shield,
  Monitor, Palette
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { ProfileSettings } from "./settings/ProfileSettings"
import { ShortcutSettings } from "./settings/ShortcutSettings"

interface SettingsModalProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
}

interface SettingsOption {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  comingSoon?: boolean
}

interface ShortcutSetting {
  id: string
  label: string
  keys: string[]
}

const settingsOptions: SettingsOption[] = [
  { 
    id: 'profile', 
    label: 'profile', 
    icon: UserIcon
  },
  { 
    id: 'shortcuts', 
    label: 'keyboard shortcuts', 
    icon: Keyboard
  },
  { 
    id: 'appearance', 
    label: 'appearance', 
    icon: Palette,
    comingSoon: true
  },
  { 
    id: 'notifications', 
    label: 'notifications', 
    icon: Bell,
    comingSoon: true
  },
  { 
    id: 'privacy', 
    label: 'privacy & security', 
    icon: Shield,
    comingSoon: true
  },
  { 
    id: 'display', 
    label: 'display', 
    icon: Monitor,
    comingSoon: true
  }
]

const defaultShortcuts: ShortcutSetting[] = [
  {
    id: 'attach',
    label: 'attach menu',
    keys: ['⌘', '0']
  },
  {
    id: 'mention',
    label: 'mentions menu',
    keys: ['⌘', '1']
  },
  {
    id: 'reference',
    label: 'references menu',
    keys: ['⌘', '2']
  },
  {
    id: 'command',
    label: 'commands menu',
    keys: ['⌘', '3']
  }
]

export function SettingsModal({ user, isOpen, onClose }: SettingsModalProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [shortcuts, setShortcuts] = useState<ShortcutSetting[]>(defaultShortcuts)
  const [isLoading, setIsLoading] = useState(false)
  const [direction, setDirection] = useState<'forwards' | 'backwards'>('forwards')
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSectionChange = (sectionId: string | null) => {
    setDirection(sectionId === null ? 'backwards' : 'forwards')
    setActiveSection(sectionId)
  }

  const handleSave = async () => {
    if (!user) return
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        data: { shortcuts }
      })

      if (error) throw error
      toast.success("settings updated")
      onClose()
    } catch (error) {
      console.error("Failed to update settings:", error)
      toast.error("failed to update settings")
    } finally {
      setIsLoading(false)
    }
  }

  const renderContent = () => {
    if (!activeSection) {
      return (
        <div className="space-y-1 py-1">
          {settingsOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => !option.comingSoon && handleSectionChange(option.id)}
              disabled={option.comingSoon}
              className={cn(
                "w-full h-9 flex items-center gap-3 px-2.5 rounded-md transition-colors group relative",
                option.comingSoon 
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-white/5"
              )}
            >
              <option.icon className="h-4 w-4 text-white/40 group-hover:text-white/60" />
              <div className="flex-1 text-left">
                <div className="text-sm font-light text-white/80 group-hover:text-white/90">
                  {option.label}
                </div>
              </div>
              {option.comingSoon ? (
                <span className="text-[10px] font-medium text-white/60 bg-white/5 px-1.5 py-0.5 rounded">
                  soon
                </span>
              ) : (
                <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-white/40" />
              )}
            </button>
          ))}
        </div>
      )
    }

    switch (activeSection) {
      case 'profile':
        return (
          <ProfileSettings 
            user={user} 
            onSave={handleSave}
          />
        )
      case 'shortcuts':
        return (
          <ShortcutSettings
            shortcuts={shortcuts}
            onShortcutChange={(id, keys) => {
              setShortcuts(shortcuts.map(s => 
                s.id === id ? { ...s, keys } : s
              ))
            }}
            onReset={() => setShortcuts(defaultShortcuts)}
          />
        )
      default:
        return null
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative w-full max-w-sm h-[420px] flex flex-col overflow-hidden rounded-lg border border-white/5 bg-zinc-900/95 backdrop-blur-sm"
          >
            {/* Header */}
            <div className="flex-none flex items-center justify-between px-4 h-12 border-b border-white/5">
              <div className="flex items-center gap-3">
                <AnimatePresence mode="wait">
                  {activeSection ? (
                    <motion.button
                      key="back"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      onClick={() => handleSectionChange(null)}
                      className="p-1 -ml-1 rounded-md text-white/40 hover:text-white/60 hover:bg-white/5"
                    >
                      <ChevronRight className="h-4 w-4 rotate-180" />
                    </motion.button>
                  ) : (
                    <motion.div
                      key="icon"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <SettingsIcon className="h-4 w-4 text-white/40" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence mode="wait">
                  <motion.span 
                    key={activeSection || 'main'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm font-light text-white/80"
                  >
                    {activeSection ? settingsOptions.find(o => o.id === activeSection)?.label : 'settings'}
                  </motion.span>
                </AnimatePresence>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-1 text-white/40 transition-colors hover:bg-white/5 hover:text-white/60"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection || 'main'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ 
                    duration: 0.15,
                    ease: "easeInOut"
                  }}
                  className="h-full overflow-y-auto px-4 py-2"
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <AnimatePresence>
              {activeSection && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex-none flex justify-end gap-3 border-t border-white/5 px-4 h-14 items-center"
                >
                  <button
                    onClick={() => handleSectionChange(null)}
                    className="rounded-lg px-4 py-2 text-sm font-light text-white/60 transition-colors hover:text-white/80"
                  >
                    cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="rounded-lg bg-white/5 px-4 py-2 text-sm font-light text-white/90 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading ? "saving..." : "save changes"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
} 