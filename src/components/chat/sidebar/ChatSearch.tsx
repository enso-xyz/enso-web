"use client"

import React from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { useHotkeys } from "react-hotkeys-hook"

interface ChatSearchProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function ChatSearch({ value, onChange, className }: ChatSearchProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Focus search with ⌘K
  useHotkeys('mod+k', (e) => {
    e.preventDefault()
    inputRef.current?.focus()
  })

  return (
    <div className={cn("relative", className)}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="search chats..."
        className={cn(
          "w-full h-9 px-9 bg-zinc-900/50 border border-white/5 rounded-lg",
          "text-sm text-white/80 font-extralight placeholder:text-white/20",
          "focus:outline-none focus:border-white/10 transition-colors"
        )}
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
      {value && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <kbd className="text-[10px] font-mono text-white/40 bg-white/5 px-1.5 py-0.5 rounded">
            esc
          </kbd>
        </div>
      )}
    </div>
  )
} 