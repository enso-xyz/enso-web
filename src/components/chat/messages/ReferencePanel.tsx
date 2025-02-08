import React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { MessageSquare, FileText, Link2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ContentReference {
  id: string
  type: "message" | "file" | "thread" | "url"
  title: string
  preview?: string
  metadata?: any
  similarity: number
}

interface ReferencePanelProps {
  references: ContentReference[]
  onSelect: (ref: ContentReference) => void
  className?: string
}

export function ReferencePanel({ references, onSelect, className }: ReferencePanelProps) {
  if (!references.length) return null

  return (
    <div className={cn("w-full rounded-lg border border-white/5 bg-zinc-900/50", className)}>
      <ScrollArea className="h-[200px] px-4">
        <div className="space-y-4 py-4">
          {references.map((ref) => (
            <div
              key={ref.id}
              className="flex items-start gap-3 p-2 rounded-md hover:bg-white/5 transition-colors cursor-pointer"
              onClick={() => onSelect(ref)}
            >
              {/* Icon */}
              <div className="mt-1">
                {ref.type === "message" && (
                  <MessageSquare className="h-4 w-4 text-white/40" />
                )}
                {ref.type === "file" && (
                  <FileText className="h-4 w-4 text-white/40" />
                )}
                {ref.type === "thread" && (
                  <Link2 className="h-4 w-4 text-white/40" />
                )}
                {ref.type === "url" && (
                  <ExternalLink className="h-4 w-4 text-white/40" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-medium truncate">{ref.title}</h4>
                  <div className="text-xs text-white/40">
                    {Math.round(ref.similarity * 100)}% match
                  </div>
                </div>
                {ref.preview && (
                  <p className="text-sm text-white/60 line-clamp-2 mt-1">
                    {ref.preview}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

interface ReferenceButtonProps {
  count: number
  onClick: () => void
  className?: string
}

export function ReferenceButton({ count, onClick, className }: ReferenceButtonProps) {
  if (!count) return null

  return (
    <Button
      variant="ghost"
      size="default"
      className={cn(
        "text-xs text-white/40 hover:text-white/60 transition-colors",
        className
      )}
      onClick={onClick}
    >
      <Link2 className="h-3 w-3 mr-1" />
      {count} reference{count !== 1 ? "s" : ""}
    </Button>
  )
} 