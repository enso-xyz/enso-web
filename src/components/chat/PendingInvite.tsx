"use client"

import React from "react"
import { Mail, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface PendingInviteProps {
  email: string
  onRemove?: () => void
  className?: string
}

export function PendingInvite({ email, onRemove, className }: PendingInviteProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-1.5 py-0.5 rounded bg-white/5 text-sm text-white/60 shrink-0 group",
        className
      )}
    >
      <div className="relative w-4 h-4 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
        <Mail className="w-2 h-2 text-white/60" />
        <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-amber-500/80" />
      </div>
      <span className="truncate max-w-[150px]">
        {email}
      </span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="text-white/40 hover:text-white/60 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  )
} 