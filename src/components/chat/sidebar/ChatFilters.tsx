"use client"

import React from "react"
import { cn } from "@/lib/utils"

export type ChatFilterType = 'all' | 'personal' | 'direct' | 'group' | 'archived'

interface ChatFiltersProps {
  value: ChatFilterType
  onChange: (value: ChatFilterType) => void
}

export function ChatFilters({ value, onChange }: ChatFiltersProps) {
  const filters: { value: ChatFilterType; label: string }[] = [
    { value: 'all', label: 'all' },
    { value: 'personal', label: 'personal' },
    { value: 'direct', label: 'direct' },
    { value: 'group', label: 'group' },
    { value: 'archived', label: 'archive' }
  ]

  return (
    <div className="flex items-center justify-center gap-0 py-1">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onChange(filter.value)}
          className={cn(
            "px-3 py-1 text-sm font-light rounded-lg transition-colors whitespace-nowrap",
            filter.value === value ? "text-white/90" : "text-white/40 hover:text-white/60"
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}