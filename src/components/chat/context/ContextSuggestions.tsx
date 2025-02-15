"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { User, Hash, Link2, FileText } from "lucide-react"
import type { Context } from "@/types/ai/context"

interface ContextSuggestionsProps {
  suggestions: Context[]
  isLoading?: boolean
  onSelect?: (suggestion: Context) => void
  className?: string
}

export function ContextSuggestions({
  suggestions,
  isLoading,
  onSelect,
  className
}: ContextSuggestionsProps) {
  if (!suggestions.length && !isLoading) return null

  const icons = {
    user: User,
    thread: Link2,
    topic: Hash,
    file: FileText
  }

  return (
    <div 
      className={cn(
        "rounded-lg border border-white/5 bg-black/90 backdrop-blur-sm",
        "p-1.5 space-y-1 max-h-[300px] overflow-y-auto scrollbar-none",
        className
      )}
    >
      <AnimatePresence mode="popLayout">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-2 text-sm text-white/40 font-light"
          >
            thinking...
          </motion.div>
        ) : (
          suggestions.map((suggestion) => {
            const Icon = icons[suggestion.type]
            return (
              <motion.div
                key={suggestion.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onClick={() => onSelect?.(suggestion)}
                className={cn(
                  "flex items-start gap-3 p-2 rounded-md",
                  "hover:bg-white/5 transition-colors cursor-pointer"
                )}
              >
                {/* Icon */}
                <div className={cn(
                  "p-2 rounded-md bg-white/5",
                  suggestion.type === 'user' && "text-blue-400/80",
                  suggestion.type === 'thread' && "text-purple-400/80",
                  suggestion.type === 'topic' && "text-green-400/80",
                  suggestion.type === 'file' && "text-orange-400/80"
                )}>
                  <Icon className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-light text-white/90 truncate">
                      {suggestion.title}
                    </h4>
                    {suggestion.subtitle && (
                      <span className="text-xs font-extralight text-white/40 truncate">
                        {suggestion.subtitle}
                      </span>
                    )}
                  </div>
                  {suggestion.subtitle && (
                    <p className="text-sm font-extralight text-white/60 line-clamp-2 mt-1">
                      {suggestion.subtitle}
                    </p>
                  )}
                </div>
              </motion.div>
            )
          })
        )}
      </AnimatePresence>
    </div>
  )
} 