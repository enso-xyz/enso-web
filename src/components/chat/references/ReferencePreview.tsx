"use client"

import React from "react"
import { Reference } from "@/types"
import { cn } from "@/lib/utils"
import { User, Hash, Link, File, Link2 } from "lucide-react"

interface ReferencePreviewProps {
  reference: Reference
  className?: string
  demo?: boolean
}

export function ReferencePreview({ reference, className, demo }: ReferencePreviewProps) {
  const { type, metadata } = reference

  const icons = {
    user: User,
    thread: Hash,
    link: Link,
    file: File,
    topic: Hash,
    message: Link2
  } as const

  const Icon = icons[type as keyof typeof icons] || Hash

  return (
    <div 
      className={cn(
        "flex items-center gap-2 px-2 py-1 rounded bg-zinc-800/50 border border-white/5",
        "text-sm text-white/60 hover:text-white/80 transition-colors",
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="truncate max-w-[200px]">
        {type === "user" && (metadata.full_name || metadata.email)}
        {type === "thread" && metadata.title}
        {type === "link" && (metadata.url ? new URL(metadata.url).hostname : metadata.title)}
        {type === "file" && metadata.name}
      </span>
    </div>
  )
} 