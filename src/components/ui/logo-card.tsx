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
      className={cn("relative aspect-square", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <FollowCursor
        cardWidth="100%"
        rotationFactor={40}
        enableTilt={true}
        animationConfig={{ mass: 5, tension: 350, friction: 40 }}
      >
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Logo size="lg" />
            </motion.div>
          )}
        </AnimatePresence>
      </FollowCursor>
    </div>
  )
} 