import React, { useState, useRef, useCallback } from "react"
import TextareaAutosize from "react-textarea-autosize"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { User, Hash, Link2, FileText, Smile } from "lucide-react"
import { MarkdownPreview } from "./MarkdownPreview"

// Tag patterns
const TAG_PATTERNS = {
  user: /@(\w+|$)/g,
  topic: /#(\w+|$)/g,
  thread: />(\w+|$)/g,
  file: /!(\w+|$)/g,
  emoji: /:(\w+|$)/g,
} as const

type TagType = keyof typeof TAG_PATTERNS
type TagMatch = {
  type: TagType
  text: string
  index: number
  length: number
}

interface TagSuggestion {
  type: TagType
  id: string
  title: string
  preview?: string
  icon?: React.ReactNode
}

interface TagInputProps {
  value: string
  onChange: (value: string) => void
  onTagSelect?: (tag: TagSuggestion) => void
  suggestions?: TagSuggestion[]
  className?: string
  placeholder?: string
}

export function TagInput({ 
  value, 
  onChange, 
  onTagSelect, 
  suggestions = [], 
  className,
  placeholder = "message... (markdown supported)", 
}: TagInputProps) {
  const [cursorPosition, setCursorPosition] = useState(0)
  const [activeTag, setActiveTag] = useState<TagMatch | null>(null)
  const [activeSuggestions, setActiveSuggestions] = useState<TagSuggestion[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Find all tag matches in text
  const findTags = useCallback((text: string): TagMatch[] => {
    const matches: TagMatch[] = []
    Object.entries(TAG_PATTERNS).forEach(([type, pattern]) => {
      let match
      while ((match = pattern.exec(text)) !== null) {
        matches.push({
          type: type as TagType,
          text: match[1] || "",
          index: match.index,
          length: match[0].length,
        })
      }
    })
    return matches.sort((a, b) => a.index - b.index)
  }, [])

  // Get the active tag at cursor position
  const getActiveTag = useCallback((text: string, position: number): TagMatch | null => {
    const matches = findTags(text)
    return matches.find(match => 
      position > match.index && 
      position <= match.index + match.length
    ) || null
  }, [findTags])

  // Filter suggestions based on active tag
  const filterSuggestions = useCallback((tag: TagMatch | null): TagSuggestion[] => {
    if (!tag) return []
    return suggestions
      .filter(s => s.type === tag.type && 
                  s.title.toLowerCase().includes(tag.text.toLowerCase()))
      .slice(0, 5)
  }, [suggestions])

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    const newPosition = e.target.selectionStart || 0
    
    setCursorPosition(newPosition)
    const tag = getActiveTag(newValue, newPosition)
    setActiveTag(tag)
    setActiveSuggestions(filterSuggestions(tag))
    setSelectedIndex(0)
    
    onChange(newValue)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (activeSuggestions.length === 0) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex(i => (i + 1) % activeSuggestions.length)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex(i => (i - 1 + activeSuggestions.length) % activeSuggestions.length)
    } else if (e.key === "Enter" && activeTag) {
      e.preventDefault()
      const suggestion = activeSuggestions[selectedIndex]
      if (suggestion) {
        const prefix = value.slice(0, activeTag.index)
        const suffix = value.slice(activeTag.index + activeTag.length)
        const tagText = getTagText(suggestion)
        onChange(prefix + tagText + suffix)
        onTagSelect?.(suggestion)
        setActiveSuggestions([])
      }
    } else if (e.key === "Escape") {
      setActiveSuggestions([])
    }
  }

  // Get display text for a tag
  const getTagText = (suggestion: TagSuggestion): string => {
    switch (suggestion.type) {
      case "user": return `@${suggestion.title}`
      case "topic": return `#${suggestion.title}`
      case "thread": return `>${suggestion.title}`
      case "file": return `!${suggestion.title}`
      case "emoji": return `:${suggestion.title}:`
    }
  }

  // Get icon for a tag type
  const getTagIcon = (type: TagType) => {
    switch (type) {
      case "user": return <User className="h-4 w-4" />
      case "topic": return <Hash className="h-4 w-4" />
      case "thread": return <Link2 className="h-4 w-4" />
      case "file": return <FileText className="h-4 w-4" />
      case "emoji": return <Smile className="h-4 w-4" />
    }
  }

  return (
    <div className={cn("relative", className)}>
      {/* Input */}
      <div className="relative">
        {/* Preview layer */}
        <div 
          className={cn(
            "absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-200",
            !isFocused && value && "opacity-100"
          )}
        >
          <MarkdownPreview 
            content={value || placeholder} 
            className={cn(
              "text-sm",
              !value && "text-white/20"
            )}
          />
        </div>

        {/* Input layer */}
        <TextareaAutosize
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="block w-full bg-transparent text-sm text-white/80 rounded-lg
                    placeholder:text-white/20 font-light resize-none
                    focus:outline-none"
          maxRows={12}
        />
      </div>

      {/* Suggestions */}
      {activeSuggestions.length > 0 && (
        <div className="absolute bottom-full left-0 w-64 mb-2">
          <div className="bg-zinc-900/95 border border-white/5 rounded-lg overflow-hidden">
            <ScrollArea className="max-h-[200px]">
              {activeSuggestions.map((suggestion, i) => (
                <button
                  key={suggestion.id}
                  className={cn(
                    "w-full flex items-start gap-2 p-2 text-left",
                    "hover:bg-white/5 transition-colors",
                    i === selectedIndex && "bg-white/5"
                  )}
                  onClick={() => {
                    if (activeTag) {
                      const prefix = value.slice(0, activeTag.index)
                      const suffix = value.slice(activeTag.index + activeTag.length)
                      const tagText = getTagText(suggestion)
                      onChange(prefix + tagText + suffix)
                      onTagSelect?.(suggestion)
                      setActiveSuggestions([])
                    }
                  }}
                >
                  <div className="mt-0.5 text-white/40">
                    {getTagIcon(suggestion.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {suggestion.title}
                    </div>
                    {suggestion.preview && (
                      <div className="text-xs text-white/40 truncate">
                        {suggestion.preview}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  )
} 