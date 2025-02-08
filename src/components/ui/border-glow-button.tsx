"use client"

import React from "react"
import { StarBorder } from "./star-border"
import { cn } from "@/lib/utils"

interface BorderGlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  glowColor?: string
  className?: string
  asChild?: boolean
}

export function BorderGlowButton({
  children,
  glowColor = "rgba(139, 92, 246, 0.25)",
  className,
  asChild,
  ...props
}: BorderGlowButtonProps) {
  return (
    <StarBorder
      as={asChild ? "div" : "button"}
      color={glowColor}
      className={cn(
        "relative overflow-hidden rounded-lg",
        "transition-colors duration-200",
        className
      )}
      {...props}
    >
      {children}
    </StarBorder>
  )
} 
