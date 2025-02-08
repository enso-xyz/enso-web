"use client"

import * as React from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ShortcutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (keys: string[]) => void
  currentKeys: string[]
}

export function ShortcutDialog({ 
  open, 
  onOpenChange,
  onSave,
  currentKeys 
}: ShortcutDialogProps) {
  const [recordedKeys, setRecordedKeys] = React.useState<string[]>(currentKeys)
  const [isRecording, setIsRecording] = React.useState(false)

  const handleKeyDown = React.useCallback((e: KeyboardEvent) => {
    if (!isRecording) return
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
      setIsRecording(false)
    }
  }, [isRecording])

  React.useEffect(() => {
    if (isRecording) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isRecording, handleKeyDown])

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed left-1/2 top-1/2 z-50 w-full max-w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-white/5 bg-zinc-900/95 p-4 shadow-lg backdrop-blur-sm"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-light text-white/80">
                      record shortcut
                    </span>
                    <Dialog.Close className="rounded-full p-1 text-white/40 transition-colors hover:bg-white/5 hover:text-white/60">
                      <X className="h-4 w-4" />
                    </Dialog.Close>
                  </div>

                  <button
                    onClick={() => setIsRecording(true)}
                    className={cn(
                      "w-full rounded-md border border-white/5 bg-zinc-800/50 px-4 py-3 text-sm font-light",
                      "transition-colors focus:outline-none",
                      isRecording
                        ? "text-white/90 border-white/20"
                        : "text-white/40 hover:text-white/60"
                    )}
                  >
                    {isRecording ? (
                      "recording..."
                    ) : recordedKeys.length > 0 ? (
                      <div className="flex items-center justify-center gap-1">
                        {recordedKeys.map((key, i) => (
                          <React.Fragment key={i}>
                            <kbd className="px-1.5 py-0.5 text-xs font-mono bg-white/5 rounded">
                              {key}
                            </kbd>
                            {i < recordedKeys.length - 1 && (
                              <span className="text-white/20">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    ) : (
                      "click to record"
                    )}
                  </button>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onOpenChange(false)}
                      className="px-3 py-1.5 text-sm font-light text-white/60 hover:text-white/80 transition-colors"
                    >
                      cancel
                    </button>
                    <button
                      onClick={() => {
                        onSave(recordedKeys)
                        onOpenChange(false)
                      }}
                      className="px-3 py-1.5 text-sm font-light text-white/80 bg-white/5 rounded-md hover:bg-white/10 transition-colors"
                    >
                      save
                    </button>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
} 