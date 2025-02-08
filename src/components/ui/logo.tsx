"use client"

import React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "sm" | "lg"
  className?: string
}

export function Logo({ size = "lg", className }: LogoProps) {
  const dimensions = {
    sm: 24,
    lg: 128
  }

  const dim = dimensions[size]

  return (
    <div className={cn("relative inline-block group", className)}>
      {/* Glow effects container */}
      <div className="absolute inset-0 rounded-full">
        <div className="absolute inset-[-2px] rounded-full bg-[#178bf1]/10 blur-xl group-hover:blur-2xl transition-all duration-500" />
      </div>

      {/* Logo container */}
      <div className={cn("relative transform-gpu", size === "sm" ? "w-6 h-6" : "w-32 h-32")}>
        {/* Background layer with ripple */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <Image
            src="/logo.svg"
            alt="Enso Logo"
            width={dim}
            height={dim}
            className="transform-gpu opacity-50 group-hover:scale-105 transition-transform duration-500"
            style={{ 
              filter: "drop-shadow(0 0 20px rgba(23,139,241,0.4))",
              transform: "translate3d(0,0,0)",
              width: "auto",
              height: "auto"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#178bf1]/10 via-transparent to-[#178bf1]/10 group-hover:opacity-100 opacity-0 transition-opacity duration-500 mix-blend-overlay" />
        </div>

        {/* Foreground layer */}
        <div className="relative w-full h-full overflow-hidden rounded-full">
          <Image
            src="/logo.svg"
            alt="Enso Logo"
            width={dim}
            height={dim}
            style={{
              width: "auto",
              height: "auto"
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(23,139,241,0)_30%,rgba(23,139,241,0.15)_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </div>
    </div>
  )
} 
