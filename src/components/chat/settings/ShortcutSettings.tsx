"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface ShortcutSettingsProps {
  shortcuts: ShortcutSetting[]
  onShortcutChange: (id: string, keys: string[]) => void
  onReset: () => void
}

interface ShortcutSetting {
  id: string
  label: string
  keys: string[]
}

export function ShortcutSettings({ shortcuts, onShortcutChange, onReset }: ShortcutSettingsProps) {
  const [recordingId, setRecordingId] = React.useState<string | null>(null)
  const [recordedKeys, setRecordedKeys] = React.useState<string[]>([])
  const recordTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const handleKeyDown = React.useCallback((e: KeyboardEvent) => {
    if (!recordingId) return
    e.preventDefault()

    const keys: string[] = []
    if (e.metaKey) keys.push('⌘')
    if (e.ctrlKey) keys.push('ctrl')
    if (e.altKey) keys.push('alt')
    if (e.shiftKey) keys.push('shift')
    
    // Add the main key if it's not a modifier
    if (!['Meta', 'Control', 'Alt', 'Shift'].includes(e.key)) {
      keys.push(e.key.toLowerCase())
    }

    if (keys.length > 0) {
      setRecordedKeys(keys)
      // Auto-save after a brief delay
      if (recordTimeoutRef.current) {
        clearTimeout(recordTimeoutRef.current)
      }
      recordTimeoutRef.current = setTimeout(() => {
        onShortcutChange(recordingId, keys)
        setRecordingId(null)
        setRecordedKeys([])
      }, 500)
    }
  }, [recordingId, onShortcutChange])

  React.useEffect(() => {
    if (recordingId) {
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        window.removeEventListener('keydown', handleKeyDown)
        if (recordTimeoutRef.current) {
          clearTimeout(recordTimeoutRef.current)
        }
      }
    }
  }, [recordingId, handleKeyDown])

  return (
    <div className="space-y-1">
      {shortcuts.map((shortcut) => (
        <button
          key={shortcut.id}
          onClick={() => setRecordingId(shortcut.id)}
          className="w-full h-9 flex items-center justify-between gap-3 px-2.5 rounded-md hover:bg-white/5 transition-colors group"
        >
          <div className="text-sm font-light text-white/80 group-hover:text-white/90">
            {shortcut.label}
          </div>
          <AnimatePresence mode="wait">
            {recordingId === shortcut.id ? (
              <motion.div
                key="recording"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-light text-white/40"
              >
                <span className="animate-pulse">recording...</span>
              </motion.div>
            ) : (
              <motion.div
                key="shortcut"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1"
              >
                {shortcut.keys.map((key, index) => (
                  <React.Fragment key={index}>
                    <kbd className="px-1.5 py-0.5 text-xs font-mono bg-white/5 rounded text-white/60">
                      {key}
                    </kbd>
                    {index < shortcut.keys.length - 1 && (
                      <span className="text-white/20">+</span>
                    )}
                  </React.Fragment>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      ))}

      <div className="mt-4 px-2.5">
        <button
          onClick={onReset}
          className="text-xs font-light text-white/40 hover:text-white/60 transition-colors"
        >
          reset to defaults
        </button>
      </div>
    </div>
  )
} 