"use client"

import React, { useState } from "react"
import {
  ChevronRight,
  Bot,
  Search,
  Brain,
  Code,
  ListTree,
  LayoutList,
  MessageSquare,
  Wand2,
  Link2
} from "lucide-react"
import { BaseMenu, BaseMenuItem } from "./BaseMenu"

interface CommandMenuProps {
  onSelect: (type: string) => void
  className?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function CommandMenu({ onSelect, className, open, onOpenChange }: CommandMenuProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const menuItems: BaseMenuItem[] = [
    // Development
    {
      id: 'code',
      label: 'code session',
      icon: Bot,
      onClick: () => onSelect('code')
    },
    {
      id: 'analyze',
      label: 'analyze code',
      icon: Code,
      onClick: () => onSelect('analyze'),
      comingSoon: true
    },
    {
      id: 'divider1',
      type: 'divider'
    },
    // Content
    {
      id: 'search',
      label: 'semantic search',
      icon: Search,
      onClick: () => onSelect('search')
    },
    {
      id: 'links',
      label: 'find links',
      icon: Link2,
      onClick: () => onSelect('links'),
      comingSoon: true
    },
    {
      id: 'divider2',
      type: 'divider'
    },
    // Organization
    {
      id: 'outline',
      label: 'show outline',
      icon: LayoutList,
      onClick: () => onSelect('outline'),
      comingSoon: true
    },
    {
      id: 'tree',
      label: 'view thread tree',
      icon: ListTree,
      onClick: () => onSelect('tree'),
      comingSoon: true
    },
    {
      id: 'context',
      label: 'get context',
      icon: Brain,
      onClick: () => onSelect('context'),
      comingSoon: true
    }
  ]

  return (
    <BaseMenu
      icon={<ChevronRight className="h-4 w-4" />}
      label="command"
      shortcut="ctrl+3"
      items={menuItems}
      showSearch
      searchPlaceholder="Search commands..."
      searchQuery={searchQuery}
      onSearchChange={(e) => setSearchQuery(e.target.value)}
      className={className}
      open={open}
      onOpenChange={onOpenChange}
    />
  )
}