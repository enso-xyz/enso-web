"use client"

import React, { useState } from "react"
import {
  User,
  Users,
  Clock,
  AtSign,
  Star,
  UserPlus,
  Search
} from "lucide-react"
import { BaseMenu, BaseMenuItem } from "./BaseMenu"

interface MentionsMenuProps {
  onSelect: (type: string, data: any) => void
  className?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function MentionsMenu({
  onSelect,
  className,
  open,
  onOpenChange
}: MentionsMenuProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Menu items for @ mentions
  const menuItems: BaseMenuItem[] = [
    {
      id: 'recent',
      label: 'recent users',
      icon: Clock,
      onClick: () => onSelect('recent', { id: '1', name: 'Recent User' })
    },
    {
      id: 'starred',
      label: 'starred contacts',
      icon: Star,
      onClick: () => onSelect('starred', { id: '2', name: 'Starred User' })
    },
    {
      id: 'divider1',
      type: 'divider'
    },
    {
      id: 'team',
      label: 'team members',
      icon: Users,
      onClick: () => onSelect('team', { id: '3', name: 'Team Member' })
    },
    {
      id: 'direct',
      label: 'direct contacts',
      icon: User,
      onClick: () => onSelect('direct', { id: '4', name: 'Direct Contact' })
    },
    {
      id: 'divider2',
      type: 'divider'
    },
    {
      id: 'invite',
      label: 'invite new user',
      icon: UserPlus,
      onClick: () => onSelect('invite', { id: '5', name: 'New User' }),
      comingSoon: true
    }
  ]

  return (
    <BaseMenu
      icon={<AtSign className="h-4 w-4" />}
      label="mention"
      shortcut="ctrl+1"
      items={menuItems}
      showSearch
      searchPlaceholder="Search users..."
      searchQuery={searchQuery}
      onSearchChange={(e) => setSearchQuery(e.target.value)}
      className={className}
      open={open}
      onOpenChange={onOpenChange}
    />
  )
}