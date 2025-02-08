"use client"

import React from "react"
import { X, FileText, Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface FilePreviewProps {
  files: File[]
  onRemove: (file: File) => void
  className?: string
}

export function FilePreview({ files, onRemove, className }: FilePreviewProps) {
  if (files.length === 0) return null

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {files.map((file, i) => (
        <div
          key={`${file.name}-${i}`}
          className="relative group flex items-center gap-2 px-2 py-1 rounded-md bg-white/5 border border-white/10"
        >
          {/* Icon */}
          <div className="text-white/40">
            {file.type.startsWith("image/") ? (
              <ImageIcon className="w-4 h-4" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
          </div>

          {/* File name */}
          <span className="text-sm font-light text-white/60 truncate max-w-[120px]">
            {file.name}
          </span>

          {/* Remove button */}
          <button
            onClick={() => onRemove(file)}
            className="p-1 rounded-md text-white/40 hover:text-white/60 hover:bg-white/5 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  )
} 