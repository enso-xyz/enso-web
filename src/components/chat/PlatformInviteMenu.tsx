"use client"

import React from "react"
import { Mail, MessageSquare, Smartphone, MessagesSquare } from "lucide-react"
import { cn } from "@/lib/utils"

interface PlatformInviteMenuProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (platform: string) => void
}

export function PlatformInviteMenu({
  isOpen,
  onClose,
  onSelect
}: PlatformInviteMenuProps) {
  const platforms = [
    {
      id: 'email',
      name: 'email invite',
      icon: Mail
    },
    {
      id: 'sms',
      name: 'sms import',
      icon: Smartphone,
      comingSoon: true
    },
    {
      id: 'slack',
      name: 'slack connect',
      icon: MessageSquare,
      comingSoon: true
    },
    {
      id: 'discord',
      name: 'discord link',
      icon: MessagesSquare,
      comingSoon: true
    }
  ]

  const handleSelect = (platformId: string) => {
    if (!platforms.find(p => p.id === platformId)?.comingSoon) {
      onSelect(platformId)
      onClose()
    }
  }

  return (
    <div className="bg-zinc-900/95 backdrop-blur-sm rounded-lg border border-white/5 overflow-hidden p-1.5 mb-2">
      {platforms.map((platform) => {
        const Icon = platform.icon
        return (
          <button
            key={platform.id}
            onClick={() => handleSelect(platform.id)}
            className={cn(
              "w-full flex items-center gap-3 px-2.5 h-7 rounded-md hover:bg-white/5 transition-colors group relative",
              platform.comingSoon && "opacity-50 cursor-not-allowed hover:bg-transparent"
            )}
          >
            <Icon className="w-3.5 h-3.5 text-white/60 group-hover:text-white/80 transition-colors" />
            <div className="text-sm text-white/80 font-extralight">
              {platform.name}
            </div>
            {platform.comingSoon && (
              <div className="ml-auto">
                <span className="text-[10px] font-medium text-white/80 bg-white/10 px-1.5 py-0.5 rounded">
                  soon
                </span>
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
} 