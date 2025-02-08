"use client"

import React, { useState, useCallback } from "react"
import { useLeaderKey } from "@/hooks/useLeaderKey"
import { CommandHints } from "@/components/ui/command-hints"

// Import menus
import { PlusMenu } from "./PlusMenu"
import { CommandMenu } from "./CommandMenu"
import { ReferenceMenu } from "./ReferenceMenu"
import { MentionsMenu } from "./MentionsMenu"

interface MenuHandlerProps {
  onInsertText: (text: string, cursorOffset?: number) => void
}

export function MenuHandler({ onInsertText }: MenuHandlerProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  // Menu state handlers
  const openMenu = useCallback((menu: string) => {
    setActiveMenu(menu)
  }, [])

  const closeMenu = useCallback(() => {
    setActiveMenu(null)
  }, [])

  // Define commands for leader key system
  const commands = [
    { key: "0", action: () => openMenu('plus'), description: "attach" },
    { key: "1", action: () => openMenu('mentions'), description: "mention" },
    { key: "2", action: () => openMenu('reference'), description: "reference" },
    { key: "3", action: () => openMenu('command'), description: "command" }
  ]

  // Use leader key hook
  const { showHints } = useLeaderKey({
    leaderKey: 'Space',
    timeout: 2000,
    commands
  })

  return (
    <>
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-2 border-r border-white/5 pr-2">
          <PlusMenu
            onSelect={(type) => {
              // Handle file upload or other content types
              console.log('Selected type:', type)
            }}
            open={activeMenu === 'plus'}
            onOpenChange={(open) => open ? openMenu('plus') : closeMenu()}
          />
        </div>
        
        <div className="flex items-center gap-2 pl-1">
          <MentionsMenu 
            onSelect={onInsertText}
            open={activeMenu === 'mentions'}
            onOpenChange={(open) => open ? openMenu('mentions') : closeMenu()}
          />
          <ReferenceMenu 
            onSelect={onInsertText}
            open={activeMenu === 'reference'}
            onOpenChange={(open) => open ? openMenu('reference') : closeMenu()}
          />
          <CommandMenu 
            onSelect={onInsertText}
            open={activeMenu === 'command'}
            onOpenChange={(open) => open ? openMenu('command') : closeMenu()}
          />
        </div>
      </div>

      <CommandHints
        show={showHints}
        commands={commands}
      />
    </>
  )
} 