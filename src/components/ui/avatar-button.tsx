"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { getChatGradient } from "@/lib/utils/colors"
import Link from "next/link"

interface AvatarButtonProps {
  // Core props
  id: string // Used for gradient and navigation
  href?: string // Optional - if provided, wraps in Link
  size?: 'sm' | 'md' | 'lg' // sm = 32px, md = 40px, lg = 64px
  className?: string
  onClick?: () => void
  // Optional image
  imageSrc?: string | null
  // Optional label (shown below avatar in vertical layout)
  label?: string
  // Visual options
  showRing?: boolean
  isInteractive?: boolean
  // Layout options
  vertical?: boolean
}

export function AvatarButton({
  id,
  href,
  size = 'md',
  className,
  onClick,
  imageSrc,
  label,
  showRing = true,
  isInteractive = true,
  vertical = false,
}: AvatarButtonProps) {
  // Size classes
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16"
  }

  // Label size classes
  const labelSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-xs"
  }

  const avatar = (
    <div className={cn(
      "rounded-full flex items-center justify-center",
      "bg-gradient-to-br shadow-lg",
      isInteractive && "transition-all duration-200",
      isInteractive && "group-hover:ring-2 ring-white/10",
      isInteractive && "group-hover:shadow-xl",
      sizeClasses[size],
      getChatGradient(id),
      className
    )}>
      {imageSrc && (
        <img 
          src={imageSrc} 
          alt="" 
          className="w-full h-full rounded-full object-cover"
        />
      )}
    </div>
  )

  const content = label ? (
    <div className={cn(
      "group flex items-center gap-3",
      vertical && "flex-col items-center gap-1.5"
    )}>
      {avatar}
      {label && (
        <span className={cn(
          "font-light text-white/80 truncate",
          labelSizeClasses[size],
          vertical && "max-w-[80px]"
        )}>
          {label}
        </span>
      )}
    </div>
  ) : avatar

  if (href) {
    return (
      <Link href={href} className="group">
        {content}
      </Link>
    )
  }

  if (onClick) {
    return (
      <button onClick={onClick} className="group">
        {content}
      </button>
    )
  }

  return content
} 