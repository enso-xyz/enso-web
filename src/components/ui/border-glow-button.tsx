"use client"

import React, { useRef, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface BorderGlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  glowColor?: string
  borderGlowColor?: string
  glowSize?: number
  className?: string
  asChild?: boolean
}

export function BorderGlowButton({
  children,
  glowColor = "rgba(139, 92, 246, 0.25)",
  borderGlowColor = "rgba(139, 92, 246, 0.5)",
  glowSize = 150,
  className,
  asChild,
  ...props
}: BorderGlowButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return

    const rect = buttonRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPosition({ x, y })
  }

  const Comp = asChild ? motion.div : motion.button

  return (
    <Comp
      ref={buttonRef}
      className={cn(
        "relative overflow-hidden rounded-lg",
        "transition-colors duration-200",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {/* Border glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(${glowSize}px circle at ${position.x}% ${position.y}%, ${borderGlowColor}, transparent)`,
          }}
        />
      </motion.div>

      {/* Internal glow */}
      <motion.div
        className="absolute inset-[1px] pointer-events-none rounded-lg overflow-hidden"
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.9,
        }}
        transition={{ duration: 0.2 }}
      >
        <div
          style={{
            position: 'absolute',
            width: glowSize,
            height: glowSize,
            borderRadius: '50%',
            background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`,
            left: `calc(${position.x}% - ${glowSize / 2}px)`,
            top: `calc(${position.y}% - ${glowSize / 2}px)`,
          }}
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </Comp>
  )
} 