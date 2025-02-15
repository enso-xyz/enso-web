"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface MobileNavDockProps {
  className?: string
}

export function MobileNavDock({ className }: MobileNavDockProps) {
  const pathname = usePathname()

  // Don't show the dock in the chat app
  if (pathname.startsWith('/chat')) {
    return null
  }

  const links = [
    { href: '/features', label: 'features' },
    { href: '/pricing', label: 'pricing' },
    { href: '/about', label: 'about' },
    { href: '/blog', label: 'blog' }
  ]

  return (
    <nav className={cn(
      "md:hidden fixed bottom-0 left-0 right-0 z-50 p-4",
      className
    )}>
      <div className={cn(
        "flex items-center justify-between gap-2",
        "p-2 rounded-2xl",
        "bg-black/[0.65] backdrop-blur-[12px] backdrop-saturate-[1.8]",
        "border border-white/[0.08]",
        "shadow-lg shadow-black/25"
      )}>
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "px-3 py-2 rounded-xl text-sm font-extralight transition-colors",
              "hover:bg-white/5",
              pathname === href 
                ? "text-white/90 bg-white/5" 
                : "text-white/40 hover:text-white/60"
            )}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  )
} 