"use client"

import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface Command {
  key: string
  description: string
}

interface CommandHintsProps {
  show: boolean
  commands: Command[]
  className?: string
}

export function CommandHints({ show, commands, className }: CommandHintsProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className={cn(
            "fixed bottom-8 left-1/2 -translate-x-1/2 z-50",
            "bg-zinc-900/95 border border-white/10 rounded-lg shadow-lg backdrop-blur-sm",
            "p-2 flex gap-3",
            className
          )}
        >
          {commands.map((cmd) => (
            <div key={cmd.key} className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 text-xs font-mono bg-white/5 rounded text-white/60">
                {cmd.key}
              </kbd>
              <span className="text-sm font-light text-white/60">
                {cmd.description}
              </span>
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
} 