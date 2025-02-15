"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { ContextPreview } from "./ContextPreview"
import type { Context, ContextType } from "@/types/ai/context"

interface ContextBarProps {
  contexts: Context[]
  onContextRemove?: (id: string) => void
  onContextClick?: (context: Context) => void
  variant?: 'global' | 'input' | 'inline'
  className?: string
}

export function ContextBar({ 
  contexts, 
  onContextRemove,
  onContextClick,
  variant = 'global',
  className 
}: ContextBarProps) {
  return (
    <div className={cn(
      "flex items-center gap-2 p-2 bg-black/20 backdrop-blur-sm",
      {
        'px-4 py-2': variant === 'global',
        'px-3 py-1.5': variant === 'input',
        'px-2 py-1': variant === 'inline'
      },
      className
    )}>
      <div className="flex items-center gap-2 flex-wrap">
        {contexts.map((context) => (
          <ContextPreview
            key={context.id}
            type={context.type}
            title={context.title}
            subtitle={context.subtitle}
            metadata={context.metadata}
            variant={variant}
            onRemove={onContextRemove ? () => onContextRemove(context.id) : undefined}
            onClick={onContextClick ? () => onContextClick(context) : undefined}
          />
        ))}
      </div>
    </div>
  )
} 