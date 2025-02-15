"use client"

import { useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface FollowCursorProps {
  children: React.ReactNode
  className?: string
  springConfig?: { stiffness: number; damping: number }
  hoverScale?: number
  rotationFactor?: number
  perspective?: string
  enableTilt?: boolean
}

export function FollowCursor({
  children,
  className,
  springConfig = { stiffness: 400, damping: 30 },
  hoverScale = 1.1,
  rotationFactor = 20,
  perspective = "300px",
  enableTilt = true
}: FollowCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Motion values for tracking mouse position and movement
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth spring animations
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)
  const scale = useSpring(1, springConfig)

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!enableTilt || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()

    // Calculate cursor position relative to the element
    const relativeX = event.clientX - rect.left
    const relativeY = event.clientY - rect.top

    // Calculate the offset needed to center the element under the cursor
    const offsetX = relativeX - rect.width / 2
    const offsetY = relativeY - rect.height / 2

    // Update position values
    mouseX.set(offsetX)
    mouseY.set(offsetY)
  }

  const handleMouseEnter = () => {
    if (enableTilt) {
      scale.set(hoverScale)
    }
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    scale.set(1)
  }

  return (
    <div 
      ref={containerRef}
      className={cn("relative", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          x: springX,
          y: springY,
          scale,
          transformStyle: "preserve-3d"
        }}
      >
        {children}
      </motion.div>
    </div>
  )
} 