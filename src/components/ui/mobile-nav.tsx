"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface MobileNavProps {
  className?: string
}

export function MobileNav({ className }: MobileNavProps) {
  const pathname = usePathname()
  
  // Don't show on chat pages
  if (pathname.startsWith('/chat')) return null

  const links = [
    { href: '/features', label: 'features' },
    { href: '/pricing', label: 'pricing' },
    { href: '/about', label: 'about' },
    { href: '/blog', label: 'blog' }
  ]

  return (
    <div className={cn(
      "md:hidden fixed top-24 left-0 right-0 z-40",
      "h-14 flex items-center",
      "border-b border-white/[0.08]",
      "bg-black/[0.65] backdrop-blur-[12px] backdrop-saturate-[1.8]",
      "supports-[backdrop-filter]:bg-black/[0.65]",
      "supports-[backdrop-filter]:backdrop-blur-[12px]",
      className
    )}>
      <div className="w-full max-w-[1400px] mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
          {links.map(({ href, label }) => {
            const isActive = pathname === href
            return (
              <Link 
                key={href}
                href={href}
                className={cn(
                  "relative px-4 py-1.5 rounded-lg text-sm whitespace-nowrap",
                  "transition-colors duration-200",
                  isActive ? "text-white/90" : "text-white/40 hover:text-white/60"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-white/5 rounded-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative">{label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
} 