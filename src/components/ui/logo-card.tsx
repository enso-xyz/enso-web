"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { FollowCursor } from "./follow-cursor"
import { Logo } from "./logo"

interface LogoCardProps {
  className?: string
}

export function LogoCard({ className }: LogoCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  // Detect touch device on mount
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  return (
    <div 
      className={cn(
        "relative w-full h-full rounded-lg",
        "transition-colors duration-200",
        "hover:bg-white/[0.07]",
        className
      )}
      onMouseEnter={() => !isTouchDevice && setIsHovered(true)}
      onMouseLeave={() => !isTouchDevice && setIsHovered(false)}
      onTouchStart={() => isTouchDevice && setIsHovered(true)}
      onTouchEnd={() => isTouchDevice && setIsHovered(false)}
    >
      {isTouchDevice ? (
        // For touch devices: centered logo with fade animation
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Logo className="w-10 h-10" />
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        // For mouse devices: cursor following behavior
        <FollowCursor>
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                <Logo className="w-10 h-10" />
              </motion.div>
            )}
          </AnimatePresence>
        </FollowCursor>
      )}
    </div>
  )
} 