"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Logo } from "./logo"
import { FollowCursor } from "./follow-cursor"
import { cn } from "@/lib/utils"

interface LogoCardProps {
  className?: string
}

export function LogoCard({ className }: LogoCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className={cn(
        "relative aspect-square",
        "hidden lg:block",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <FollowCursor
        className="w-full h-full"
        rotationFactor={0}
        enableTilt={true}
        springConfig={{ stiffness: 250, damping: 25 }}
        hoverScale={1}
      >
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <Logo size="lg" />
            </motion.div>
          )}
        </AnimatePresence>
      </FollowCursor>
    </div>
  )
} 