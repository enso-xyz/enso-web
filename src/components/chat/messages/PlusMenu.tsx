"use client"

import React from "react"
import {
  Plus,
  Image,
  FileText,
  Folder,
  Map,
  Link2,
  Code,
  Book,
  Video,
  FileIcon
} from "lucide-react"
import { BaseMenu, BaseMenuItem } from "./BaseMenu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PlusMenuProps {
  onSelect: (type: string) => void
  className?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function PlusMenu({
  onSelect,
  className,
  open,
  onOpenChange
}: PlusMenuProps) {
  const menuItems: BaseMenuItem[] = [
    // Media
    {
      id: 'image',
      label: 'add image',
      icon: Image,
      onClick: () => onSelect('image')
    },
    {
      id: 'video',
      label: 'add video',
      icon: Video,
      onClick: () => onSelect('video')
    },
    {
      id: 'divider1',
      type: 'divider'
    },
    // Files & Links
    {
      id: 'file',
      label: 'add file',
      icon: FileIcon,
      onClick: () => onSelect('file')
    },
    {
      id: 'link',
      label: 'paste link',
      icon: Link2,
      onClick: () => onSelect('link')
    },
    {
      id: 'divider2',
      type: 'divider'
    },
    // Code & Docs
    {
      id: 'code',
      label: 'code reference',
      icon: Code,
      onClick: () => onSelect('code')
    },
    {
      id: 'docs',
      label: 'documentation',
      icon: Book,
      onClick: () => onSelect('docs')
    },
    {
      id: 'divider3',
      type: 'divider'
    },
    // Organization
    {
      id: 'folder',
      label: 'add folder',
      icon: Folder,
      onClick: () => onSelect('folder')
    },
    {
      id: 'location',
      label: 'share location',
      icon: Map,
      onClick: () => onSelect('location')
    }
  ]

  return (
    <BaseMenu
      icon={<Plus className="h-4 w-4" />}
      label="add"
      shortcut="ctrl+0"
      items={menuItems}
      className={className}
      width="w-48"
      open={open}
      onOpenChange={onOpenChange}
    >
      <Button
        size="icon"
        variant="ghost"
        className={cn(
          "h-8 w-8 text-white/40 hover:text-white/60",
          className
        )}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </BaseMenu>
  )
}