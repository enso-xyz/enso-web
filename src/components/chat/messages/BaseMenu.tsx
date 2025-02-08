"use client"

import React, { useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"

export interface BaseMenuItem {
  id: string
  type?: 'divider'
  label?: string
  icon?: React.ComponentType<{ className?: string }>
  onClick?: () => void
  danger?: boolean
  comingSoon?: boolean
}

export interface BaseMenuProps {
  className?: string
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  width?: string
  icon: React.ReactNode
  label: string
  shortcut?: string
  items: BaseMenuItem[]
  showSearch?: boolean
  searchPlaceholder?: string
  searchQuery?: string
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  loading?: boolean
  disabled?: boolean
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function BaseMenu({
  className,
  align = 'start',
  sideOffset = 4,
  width = 'w-56',
  icon,
  label,
  shortcut,
  items,
  showSearch,
  searchPlaceholder = 'Search...',
  searchQuery = "",
  onSearchChange,
  loading,
  disabled,
  children,
  open,
  onOpenChange
}: BaseMenuProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen
  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }

  const tooltipContent = shortcut ? (
    <div className="flex items-center gap-2">
      <span className="text-sm font-light">{label.toLowerCase()}</span>
      <kbd className="text-[10px] font-mono text-white/40 bg-white/5 px-1.5 py-0.5 rounded">
        {shortcut}
      </kbd>
    </div>
  ) : (
    <span className="text-sm font-light">{label.toLowerCase()}</span>
  )

  const menuButton = children || (
    <Button
      size="icon"
      variant="ghost"
      className={cn(
        "h-8 w-8 text-white/40 hover:text-white/60",
        className
      )}
      disabled={disabled}
    >
      {icon}
      <span className="sr-only">{label}</span>
    </Button>
  )

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              {menuButton}
            </PopoverTrigger>
          </TooltipTrigger>
          <PopoverContent
            align={align}
            className={cn(width, "p-1.5")}
            sideOffset={sideOffset}
          >
            <div className="space-y-0.5">
              {showSearch && (
                <div className="sticky top-0 mb-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={onSearchChange}
                      className={cn(
                        "w-full bg-white/5 rounded-md pl-8 pr-4 py-2 text-sm font-light",
                        "text-white/80 placeholder:text-white/40",
                        "focus:outline-none focus:ring-0"
                      )}
                      placeholder={searchPlaceholder}
                    />
                  </div>
                </div>
              )}

              {items.map((item) => {
                if (item.type === 'divider') {
                  return <div key={item.id} className="h-px bg-white/5 my-1" />
                }

                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      item.onClick?.()
                      handleOpenChange(false)
                    }}
                    disabled={item.comingSoon || loading}
                    className={cn(
                      "w-full flex items-center gap-3 px-2.5 h-7 rounded-md hover:bg-white/5 transition-colors group relative",
                      item.danger && "hover:bg-red-500/10 text-red-400/60 hover:text-red-400",
                      item.comingSoon && "opacity-50 cursor-not-allowed hover:bg-transparent",
                      loading && "opacity-50 cursor-wait"
                    )}
                  >
                    {Icon && <Icon className={cn(
                      "w-3.5 h-3.5 text-white/60 group-hover:text-white/80 transition-colors",
                      item.danger && "text-red-400/60 group-hover:text-red-400"
                    )} />}
                    <span className={cn(
                      "text-sm text-white/80 font-extralight text-left flex-1",
                      item.danger && "text-red-400/60 group-hover:text-red-400"
                    )}>
                      {item.label}
                    </span>
                    {item.comingSoon && (
                      <div className="ml-auto">
                        <span className="text-[10px] font-medium text-white/80 bg-white/10 px-1.5 py-0.5 rounded">
                          soon
                        </span>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </PopoverContent>
          <TooltipContent
            side="bottom"
            className="bg-zinc-900/95 border border-white/5 px-2 py-1"
          >
            {tooltipContent}
          </TooltipContent>
        </Popover>
      </Tooltip>
    </TooltipProvider>
  )
} 