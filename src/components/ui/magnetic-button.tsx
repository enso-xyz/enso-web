"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}

export function MagneticButton({ 
  children, 
  className = "",
  ...props 
}: MagneticButtonProps) {
  return (
    <button
      className={cn("group relative inline-flex items-center justify-center", className)}
      {...props}
    >
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/10 to-white/5 backdrop-blur transform group-hover:scale-[1.02] transition-all duration-300 ease-out origin-center" />
      <div className="absolute -inset-0.5 rounded-lg opacity-0 group-hover:opacity-20 bg-gradient-to-r from-white to-transparent blur-md transition-all duration-300" />
      <span className="relative px-12 py-4 text-sm tracking-widest text-white/80 group-hover:text-white transition-colors uppercase font-extralight">
        {children}
      </span>
    </button>
  )
} 