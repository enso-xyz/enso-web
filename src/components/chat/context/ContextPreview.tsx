"use client"

import React from "react"
import { User, Hash, Link2, FileText, MessageSquare, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface ContextPreviewProps {
  type: 'user' | 'thread' | 'topic' | 'file' | 'link'
  title: string
  preview?: string
  metadata?: {
    author?: string
    date?: string
    size?: string
    relevance?: number // 0-1 score for relevance
    confidence?: number // 0-1 score for AI confidence
    [key: string]: any
  }
  isFloating?: boolean
  onClick?: () => void
  onRemove?: () => void
  className?: string
}

export function ContextPreview({
  type,
  title,
  preview,
  metadata,
  isFloating = false,
  onClick,
  onRemove,
  className
}: ContextPreviewProps) {
  const icons = {
    user: User,
    thread: MessageSquare,
    topic: Hash,
    file: FileText,
    link: Link2
  } as const

  const Icon = icons[type as keyof typeof icons] || Hash

  return (
    <motion.div
      initial={isFloating ? { opacity: 0, y: 20 } : false}
      animate={isFloating ? { opacity: 1, y: 0 } : false}
      className={cn(
        "group relative p-4 rounded-lg transition-colors min-h-[100px]",
        "border border-white/5 bg-white/[0.02] backdrop-blur-sm",
        onClick && "cursor-pointer hover:bg-white/[0.04]",
        isFloating && "shadow-lg hover:shadow-xl",
        metadata?.relevance && metadata.relevance > 0.8 && "ring-2 ring-blue-500/20",
        metadata?.confidence && metadata.confidence > 0.8 && "ring-2 ring-green-500/20",
        className
      )}
      onClick={onClick}
    >
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className={cn(
            "absolute top-2 right-2 p-1 rounded-md",
            "opacity-0 group-hover:opacity-100 transition-opacity",
            "text-white/40 hover:text-white/60 hover:bg-white/5"
          )}
        >
          <X className="w-3 h-3" />
        </button>
      )}
      <div className="flex items-start gap-3">
        <div className={cn(
          "p-2 rounded-md bg-white/5",
          type === 'user' && "text-blue-400/80",
          type === 'thread' && "text-purple-400/80",
          type === 'topic' && "text-green-400/80",
          type === 'file' && "text-orange-400/80",
          type === 'link' && "text-yellow-400/80",
          metadata?.relevance && metadata.relevance > 0.8 && "ring-1 ring-current"
        )}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <h4 className="text-sm font-light text-white/90 truncate">
                {title}
              </h4>
              {metadata?.author && (
                <p className="text-xs font-extralight text-white/40">
                  {metadata.author}
                </p>
              )}
            </div>
            {metadata?.date && (
              <span className="text-xs font-extralight text-white/40 whitespace-nowrap">
                {metadata.date}
              </span>
            )}
          </div>
          {preview && (
            <p className="text-sm font-extralight text-white/60 line-clamp-2">
              {preview}
            </p>
          )}
          {metadata?.size && (
            <p className="text-xs font-extralight text-white/40">
              {metadata.size}
            </p>
          )}
          {metadata?.relevance && (
            <div className="flex items-center gap-1 mt-2">
              <div 
                className="h-1 flex-1 rounded-full bg-white/5 overflow-hidden"
                title={`${Math.round(metadata.relevance * 100)}% relevant`}
              >
                <div 
                  className="h-full bg-current transition-all duration-500"
                  style={{ width: `${metadata.relevance * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
} 