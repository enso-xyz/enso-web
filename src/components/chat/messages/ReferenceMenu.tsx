"use client"

import React, { useState } from "react"
import { Hash, MessageSquare, Clock, Star, MessagesSquare } from "lucide-react"
import { BaseMenu, BaseMenuItem } from "./BaseMenu"

interface ReferenceMenuProps {
  onSelect: (type: string, data: any) => void
  className?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ReferenceMenu({
  onSelect,
  className,
  open,
  onOpenChange
}: ReferenceMenuProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Menu items for references
  const menuItems: BaseMenuItem[] = [
    {
      id: 'recent',
      label: 'recent',
      icon: Clock,
      onClick: () => onSelect('recent', { type: 'moment' })
    },
    {
      id: 'favorited',
      label: 'favorited',
      icon: Star,
      onClick: () => onSelect('favorited', { type: 'moment' })
    },
    {
      id: 'chat',
      label: 'this chat',
      icon: MessagesSquare,
      onClick: () => onSelect('chat', { type: 'chat' })
    },
    {
      id: 'divider1',
      type: 'divider'
    },
    {
      id: 'moment',
      label: 'reference moment',
      icon: MessageSquare,
      onClick: () => onSelect('moment', { type: 'moment' })
    },
    {
      id: 'topic',
      label: 'tag topic',
      icon: Hash,
      onClick: () => onSelect('topic', { type: 'topic' })
    }
  ]

  return (
    <BaseMenu
      icon={<Hash className="h-4 w-4" />}
      label="reference"
      shortcut="ctrl+2"
      items={menuItems}
      showSearch
      searchPlaceholder="search references..."
      searchQuery={searchQuery}
      onSearchChange={(e) => setSearchQuery(e.target.value)}
      className={className}
      open={open}
      onOpenChange={onOpenChange}
    />
  )
}