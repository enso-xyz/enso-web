"use client"

import { useState, useEffect, useCallback } from 'react'

interface LeaderKeyOptions {
  leaderKey?: string // e.g., 'Space', 'Tab', etc.
  timeout?: number // How long to wait for the command after leader (ms)
  commands: {
    key: string
    action: () => void
    description: string
  }[]
}

export function useLeaderKey({ leaderKey = 'Space', timeout = 2000, commands }: LeaderKeyOptions) {
  const [isLeaderPressed, setIsLeaderPressed] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  // Reset leader mode
  const resetLeaderMode = useCallback(() => {
    setIsLeaderPressed(false)
    setShowHints(false)
    if (timeoutId) clearTimeout(timeoutId)
  }, [timeoutId])

  // Handle keydown events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If we're in an input/textarea, ignore leader key
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      // Handle leader key press
      if (!isLeaderPressed && e.key === leaderKey) {
        e.preventDefault()
        setIsLeaderPressed(true)
        setShowHints(true)
        
        // Set timeout to reset leader mode
        const id = setTimeout(resetLeaderMode, timeout)
        setTimeoutId(id)
        return
      }

      // If leader is pressed, check for commands
      if (isLeaderPressed) {
        const command = commands.find(cmd => cmd.key === e.key)
        if (command) {
          e.preventDefault()
          command.action()
          resetLeaderMode()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLeaderPressed, leaderKey, commands, resetLeaderMode, timeout])

  return {
    isLeaderPressed,
    showHints,
    resetLeaderMode
  }
} 