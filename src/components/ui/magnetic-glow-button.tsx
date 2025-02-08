"use client"

import React, { useRef, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface MagneticGlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  glowColor?: string
  magneticPull?: number
  glowSize?: number
  className?: string
}

export function MagneticGlowButton({
  children,
  glowColor = "rgba(139, 92, 246, 0.25)", // Default violet glow
  magneticPull = 0.2,
  glowSize = 200,
  className,
  ...props
}: MagneticGlowButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return

    const rect = buttonRef.current.getBoundingClientRect()
    
    // Calculate glow position relative to button
    const glowX = ((e.clientX - rect.left) / rect.width) * 100
    const glowY = ((e.clientY - rect.top) / rect.height) * 100
    setGlowPosition({ x: glowX, y: glowY })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  return (
    <button
      ref={buttonRef}
      className={cn(
        "relative overflow-hidden rounded-lg bg-black",
        "transition-colors duration-200",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute pointer-events-none"
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.5,
        }}
        transition={{
          duration: 0.2
        }}
        style={{
          width: glowSize,
          height: glowSize,
          borderRadius: "50%",
          background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`,
          left: `calc(${glowPosition.x}% - ${glowSize / 2}px)`,
          top: `calc(${glowPosition.y}% - ${glowSize / 2}px)`,
        }}
      />

      {/* Button content */}
      <div className="relative z-10">
        {children}
      </div>
    </button>
  )
} 