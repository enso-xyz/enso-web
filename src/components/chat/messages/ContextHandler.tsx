import React from "react"
import { ContextBar } from "@/components/chat/context/ContextBar"
import { ContextSuggestions } from "@/components/chat/context/ContextSuggestions"
import { ReferencePreview } from "@/components/chat/references/ReferencePreview"
import type { Context, ContextType } from "@/types/ai/context"
import { Reference } from '@/types/ai/context'

interface ContextHandlerProps {
  contexts: Context[]
  onContextClick: (context: Context) => void
  onContextRemove: (id: string) => void
  references: Reference[]
  suggestions: any[]
  isLoadingSuggestions: boolean
  className?: string
}

export function ContextHandler({
  contexts,
  onContextClick,
  onContextRemove,
  references,
  suggestions,
  isLoadingSuggestions,
  className
}: ContextHandlerProps) {
  return (
    <div className={className}>
      {/* Context bar */}
      <ContextBar
        contexts={contexts}
        onContextClick={onContextClick}
        onContextRemove={onContextRemove}
        className="mb-4"
      />

      {/* Reference preview */}
      {references.length > 0 && (
        <div className="absolute bottom-full w-full mb-4 px-4">
          <div className="flex flex-wrap gap-2 p-2 rounded-lg bg-zinc-900/50 border border-white/5">
            {references.map((ref) => ({
              ...ref,
              type: ref.type as ContextType,
              content: ref.content || "",
              similarity: ref.similarity || 0
            })).map((ref, i) => (
              <ReferencePreview 
                key={i} 
                reference={{
                  ...ref,
                  id: String(ref.id),
                  type: ref.type as ContextType,
                  content: ref.content || "",
                  similarity: ref.similarity || 0
                }} 
              />
            ))}
          </div>
        </div>
      )}

      {/* Live Suggestions */}
      <ContextSuggestions
        suggestions={suggestions}
        isLoading={isLoadingSuggestions}
        className="absolute bottom-full mb-2 left-0 right-0 px-4"
      />
    </div>
  )
} 