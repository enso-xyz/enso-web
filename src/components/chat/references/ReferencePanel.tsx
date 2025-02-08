"use client"

import { Message, Reference } from '@/types'
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { BookOpenIcon } from "lucide-react"

interface ReferencePanelProps {
  references?: Message["references"]
  className?: string
}

export function ReferencePanel({ references, className }: ReferencePanelProps) {
  if (!references?.length) {
    return (
      <div
        className={cn(
          "flex h-full flex-col items-center justify-center text-center",
          className
        )}
      >
        <BookOpenIcon className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <h3 className="font-medium text-muted-foreground">No references</h3>
        <p className="text-sm text-muted-foreground/80">
          References will appear here when available
        </p>
      </div>
    )
  }

  return (
    <ScrollArea className={className}>
      <div className="space-y-4 pr-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">References</h3>
          <span className="text-xs text-muted-foreground">
            {references.length} found
          </span>
        </div>
        {references.map((ref) => (
          <Card key={ref.id} className="p-4">
            <h4 className="mb-2 font-medium leading-none">{ref.title}</h4>
            <p className="mb-4 text-sm text-muted-foreground">{ref.content}</p>
            <a
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary underline-offset-4 hover:underline"
            >
              View source
            </a>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
} 