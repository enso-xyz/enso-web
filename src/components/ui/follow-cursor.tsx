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
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Smooth spring animations
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)
  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [rotationFactor, -rotationFactor]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-rotationFactor, rotationFactor]), springConfig)
  const scale = useSpring(1, springConfig)

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!enableTilt || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Calculate distance from center
    const distanceX = event.clientX - centerX
    const distanceY = event.clientY - centerY

    // Update position values
    x.set(distanceX)
    y.set(distanceY)

    // Update rotation values (normalized -1 to 1)
    mouseX.set(distanceX / (rect.width / 2))
    mouseY.set(distanceY / (rect.height / 2))
  }

  const handleMouseEnter = () => {
    if (enableTilt) {
      scale.set(hoverScale)
    }
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    x.set(0)
    y.set(0)
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
          perspective,
          rotateX,
          rotateY,
          scale,
          x: springX,
          y: springY,
          transformStyle: "preserve-3d"
        }}
      >
        {children}
      </motion.div>
    </div>
  )
} 