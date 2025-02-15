"use client"

import { motion } from "framer-motion"
import { Send } from "lucide-react"
import React, { useState, useRef, useEffect, useCallback } from "react"
import TextareaAutosize from "react-textarea-autosize"
import { toast } from "sonner"

import { useReferences } from "@/hooks/useReferences"
import { useSuggestions } from "@/hooks/useSuggestions"
import { MessageProcessor } from "@/lib/ai/messageProcessor"
import { cn } from "@/lib/utils"

import { FileHandler } from "./FileHandler"
import { MenuHandler } from "./MenuHandler"
import { ContextHandler } from "./ContextHandler"

import type { Context } from "@/types/ai/context"

interface MessageInputProps {
  chatId: string
  className?: string
  demo?: boolean
}

export function MessageInput({ chatId, className, demo = false }: MessageInputProps) {
  // Core state
  const [content, setContent] = useState("")
  const [isComposing, setIsComposing] = useState(false)
  const [isSending, setIsSending] = useState(false)
  
  // File handling state
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  
  // Menu state
  const [activeMenu, setActiveMenu] = useState<'user' | 'reference' | 'command' | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Context state
  const [activeContexts, setActiveContexts] = useState<Context[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  // Refs
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const dropzoneRef = useRef<HTMLDivElement>(null)

  // Use hooks
  const { references } = useReferences(content, chatId) as { 
    references: import('@/types/ai/context').Reference[] 
  }
  const { suggestions, isLoading: isLoadingSuggestions } = useSuggestions(content, chatId, {
    limit: 5,
    threshold: 0.7
  })

  const [pendingFiles, setPendingFiles] = useState<File[]>([])

  // Focus management - only on mount and if not demo
  useEffect(() => {
    if (!demo && inputRef.current) {
      inputRef.current.focus()
    }
  }, [demo]) // Empty dependency array since we only want this on mount

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() && pendingFiles.length === 0) return

    setIsSending(true)
    try {
      const processor = new MessageProcessor()
      const result = await processor.processMessage({
        chatId,
        content: content.trim(),
        files: pendingFiles,
        contexts: activeContexts.map(c => ({
          id: c.id,
          type: c.type
        })),
        references: references.map(ref => ({
          type: ref.type,
          id: ref.id,
          metadata: ref.metadata
        }))
      })

      // Clear input and state after successful send
      setContent("")
      setPendingFiles([])
      setActiveContexts([])
      if (inputRef.current) {
        inputRef.current.style.height = "auto"
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      toast.error("Failed to send message. Please try again.")
    } finally {
      setIsSending(false)
    }
  }, [chatId, content, pendingFiles, activeContexts, references])

  // Handle keyboard triggers
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Submit on Enter (unless shift or composing)
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault()
      handleSubmit(e)
      return
    }

    // Handle menu triggers with cmd/ctrl
    if (e.metaKey || e.ctrlKey) {
      switch (e.key) {
        case '@':
          e.preventDefault()
          setActiveMenu('user')
          break
        case '#':
          e.preventDefault()
          setActiveMenu('reference')
          break
        case '>':
          e.preventDefault()
          setActiveMenu('command')
          break
      }
    }
  }, [isComposing, handleSubmit])

  const handleInsertText = useCallback((text: string, cursorOffset: number = text.length) => {
    if (!inputRef.current) return

    const start = inputRef.current.selectionStart
    const end = inputRef.current.selectionEnd

    const newContent = content.slice(0, start) + text + content.slice(end)
    setContent(newContent)

    // Set cursor position after inserted text
    setTimeout(() => {
      if (!inputRef.current) return
      const newPosition = start + cursorOffset
      inputRef.current.selectionStart = newPosition
      inputRef.current.selectionEnd = newPosition
      inputRef.current.focus()
    }, 0)
  }, [content])

  return (
    <div className={cn("relative", className)}>
      {/* Context Handler */}
      <ContextHandler
        contexts={activeContexts}
        onContextClick={(context) => setActiveContexts(prev => [...prev, context])}
        onContextRemove={(id) => setActiveContexts(prev => prev.filter(c => c.id !== id))}
        references={references}
        suggestions={suggestions}
        isLoadingSuggestions={isLoadingSuggestions}
      />

      {/* File Handler */}
      <FileHandler
        onFilesChange={setPendingFiles}
      />

      {/* Main input container */}
      <div className="bg-zinc-900/50 border border-white/5 rounded-lg">
        {/* Input area */}
        <div className="flex flex-col">
          <div className="px-4 pt-4">
            <TextareaAutosize
              ref={inputRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              placeholder="Message... (@ for users, # for references, > for commands)"
              className="block w-full bg-transparent text-sm text-white/80 
                      placeholder:text-white/20 font-light resize-none
                      focus:outline-none min-h-[20px] leading-tight"
              maxRows={12}
            />
          </div>

          {/* Action bar */}
          <div className="flex items-center justify-between px-2 py-1 border-t border-white/5 mt-2">
            <div className="flex items-center gap-1">
              {/* Menu Handler */}
              <MenuHandler onInsertText={handleInsertText} />
            </div>

            {/* Send Button */}
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || isSending}
              className={cn(
                "h-8 w-8 flex items-center justify-center rounded-md",
                "hover:bg-white/5 text-white/40 hover:text-white/60 transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                isSending && "opacity-70"
              )}
            >
              <div className="relative">
                {isSending ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="h-3.5 w-3.5 border-2 border-white/20 border-t-transparent rounded-full"
                  />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}