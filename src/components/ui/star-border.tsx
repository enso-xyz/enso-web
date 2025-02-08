"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface StarBorderProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType
  className?: string
  color?: string
  speed?: string
  children: React.ReactNode
}

export function StarBorder({
  as: Component = "button",
  className = "",
  color = "white",
  speed = "6s",
  children,
  ...props
}: StarBorderProps) {
  return (
    <Component 
      className={cn(
        "relative inline-block p-[1px] rounded-2xl overflow-hidden",
        className
      )} 
      {...props}
    >
      {/* Border gradient animations */}
      <div
        className="absolute w-[300%] h-1/2 opacity-70 -bottom-[11px] -right-[250%] rounded-[50%] z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animation: `star-movement-bottom ${speed} linear infinite alternate`
        }}
      />
      <div
        className="absolute opacity-70 w-[300%] -top-[11px] -left-[250%] h-1/2 rounded-[50%] z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animation: `star-movement-top ${speed} linear infinite alternate`
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </Component>
  )
} 