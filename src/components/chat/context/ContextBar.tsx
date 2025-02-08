"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { ContextPreview } from "./ContextPreview"
import { ContextType } from '@/types/ai/context'

export interface Context {
  id: string
  type: ContextType
  title: string
  preview?: string
  metadata?: {
    author?: string
    date?: string
    size?: string
    relevance?: number
    confidence?: number
  }
}

interface ContextBarProps {
  contexts: Context[]
  suggestions?: Context[]
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  onContextClick?: (context: Context) => void
  onContextRemove?: (id: string) => void
  className?: string
}

export function ContextBar({
  contexts,
  suggestions = [],
  isCollapsed = false,
  onToggleCollapse,
  onContextClick,
  onContextRemove,
  className
}: ContextBarProps) {
  const hasContent = contexts.length > 0 || suggestions.length > 0

  return (
    <div className={cn(
      "relative transition-all duration-300",
      isCollapsed ? "h-12" : "h-auto",
      !hasContent && "opacity-0",
      className
    )}>
      {/* Collapse toggle */}
      {hasContent && (
        <button
          onClick={onToggleCollapse}
          className={cn(
            "absolute -top-4 left-1/2 -translate-x-1/2",
            "h-8 w-8 rounded-full bg-white/5 backdrop-blur-sm",
            "flex items-center justify-center",
            "text-white/40 hover:text-white/60 transition-colors",
            "border border-white/5"
          )}
        >
          {isCollapsed ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </button>
      )}

      {/* Content */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {/* Active contexts */}
            {contexts.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-light text-white/40">active context</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contexts.map(context => (
                    <ContextPreview
                      key={context.id}
                      {...context}
                      isFloating={true}
                      onRemove={onContextRemove ? () => onContextRemove(context.id) : undefined}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-light text-white/40">suggestions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {suggestions.map(suggestion => (
                    <ContextPreview
                      key={suggestion.id}
                      {...suggestion}
                      isFloating={true}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 