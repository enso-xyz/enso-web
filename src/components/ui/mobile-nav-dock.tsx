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
      "fixed bottom-0 left-0 right-0 z-50 px-4 pb-4",
      "lg:opacity-0 lg:pointer-events-none opacity-100 transition-opacity duration-300",
      className
    )}>
      <div className={cn(
        "flex items-center justify-center gap-1",
        "px-1.5 py-1.5 rounded-xl",
        "bg-black/[0.65] backdrop-blur-[12px] backdrop-saturate-[1.8]",
        "border border-white/[0.08]",
        "shadow-lg shadow-black/25",
        "max-w-[320px] mx-auto w-full",
        "transform transition-transform duration-300",
        "lg:translate-y-4 translate-y-0"
      )}>
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "px-2.5 py-1.5 rounded-lg text-sm font-extralight transition-colors flex-1 text-center",
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