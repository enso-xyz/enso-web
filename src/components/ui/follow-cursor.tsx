"use client"

import { useRef } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"

interface FollowCursorProps {
  children: React.ReactNode
  className?: string
  springConfig?: { stiffness: number; damping: number }
}

export function FollowCursor({
  children,
  className,
  springConfig = { stiffness: 1000, damping: 50 },
}: FollowCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Motion values for cursor following
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  // Smooth spring animations for position
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    
    // Calculate position relative to container with a slight offset correction
    const offsetX = event.clientX - rect.left - 70
    const offsetY = event.clientY - rect.top - 70
    
    x.set(offsetX)
    y.set(offsetY)
  }

  return (
    <div 
      ref={containerRef}
      className={cn("absolute inset-0", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseMove}
    >
      <motion.div
        style={{
          position: "absolute",
          pointerEvents: "none",
          x: springX,
          y: springY,
          transform: "translate(-50%, -50%)",
          margin: 0,
          padding: 0,
        }}
      >
        {children}
      </motion.div>
    </div>
  )
} 