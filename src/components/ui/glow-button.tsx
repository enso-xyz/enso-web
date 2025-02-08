"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { useGlowEffect } from "@/hooks/useGlowEffect"

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  glowColor?: string
}

export function GlowButton({ 
  children, 
  className,
  glowColor = "var(--blue-primary)",
  ...props 
}: GlowButtonProps) {
  const { containerRef, overlayRef } = useGlowEffect()

  const Comp = 'button'

  return (
    <div ref={containerRef} className="relative glow-capture">
      {/* Glow background */}
      <div className="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-[var(--blue-primary)] to-transparent opacity-0 group-hover:opacity-100 blur transition-all duration-300" />
      
      {/* Button content */}
      <Comp
        className={cn(
          "relative rounded-lg border border-white/10 px-8 py-3",
          "text-lg font-extralight text-[var(--white-90)]",
          "bg-white/5 backdrop-blur-sm",
          "hover:bg-white/10 hover:border-[var(--blue-primary)]/50",
          "group transition-all duration-300",
          "glow glow:ring-1 glow:border-glow glow:ring-glow glow:bg-glow/[.15]",
          className
        )}
        style={{ "--glow-color": glowColor } as React.CSSProperties}
        type="button"
        {...props}
      >
        {children}
      </Comp>

      {/* Mouse tracking overlay */}
      <div 
        ref={overlayRef}
        className="glow-overlay"
        style={{ 
          "--glow-color": glowColor,
          "--glow-size": "20rem"
        } as React.CSSProperties}
      />
    </div>
  )
} 