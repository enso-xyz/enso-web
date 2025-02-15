"use client"

import React from "react"
import { User, Hash, Link2, FileText, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import type { ContextType } from "@/types/ai/context"

interface ContextTileProps {
  type: ContextType
  title: string
  subtitle?: string
  active?: boolean
  onRemove?: () => void
  onClick?: () => void
  className?: string
}

export function ContextTile({ 
  type, 
  title, 
  subtitle,
  active = false,
  onRemove,
  onClick,
  className 
}: ContextTileProps) {
  const icons = {
    user: User,
    thread: Link2,
    topic: Hash,
    file: FileText
  }

  const Icon = icons[type]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "group relative flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors cursor-default",
        "border border-white/5 backdrop-blur-sm",
        active 
          ? "bg-white/10 text-white/90" 
          : "bg-white/5 text-white/60 hover:text-white/80",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <Icon className="w-3.5 h-3.5" />
      <div className="flex flex-col min-w-0">
        <span className="truncate text-sm font-light">
          {title}
        </span>
        {subtitle && (
          <span className="truncate text-xs font-extralight text-white/40">
            {subtitle}
          </span>
        )}
      </div>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className={cn(
            "p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity",
            "hover:bg-white/5 text-white/40 hover:text-white/60"
          )}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </motion.div>
  )
} 