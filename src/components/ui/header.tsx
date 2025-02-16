"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Logo } from "@/components/ui/logo"
import { MagneticGlowButton } from "@/components/ui/magnetic-glow-button"
import { cn } from "@/lib/utils"

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const router = useRouter()

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50",
      "h-24 flex items-center",
      "border-b border-white/[0.08]",
      "bg-black/[0.65] backdrop-blur-[12px] backdrop-saturate-[1.8]",
      "supports-[backdrop-filter]:bg-black/[0.65]",
      "supports-[backdrop-filter]:backdrop-blur-[12px]",
      className
    )}>
      {/* Content container with max width */}
      <div className="w-full max-w-[1400px] mx-auto px-8 md:px-12 lg:px-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-12">
          <Link href="/" className="group">
            <h1 className="text-xl tracking-tight">
              <span className="font-extralight tracking-[-0.05em] text-white/40 group-hover:text-white/60 transition-colors">en</span>
              <span className="font-light text-white/60 group-hover:text-white/90 transition-colors">so</span>
            </h1>
          </Link>
          
          {/* Primary Nav - Hidden on mobile, fades in on lg breakpoint */}
          <nav className="hidden lg:flex items-center gap-8 opacity-0 lg:opacity-100 transition-opacity duration-300">
            <Link href="/features" className="text-lg text-white/40 hover:text-white/60 transition-colors font-extralight">
              features
            </Link>
            <Link href="/pricing" className="text-lg text-white/40 hover:text-white/60 transition-colors font-extralight">
              pricing
            </Link>
            <Link href="/about" className="text-lg text-white/40 hover:text-white/60 transition-colors font-extralight">
              about
            </Link>
            <Link href="/blog" className="text-lg text-white/40 hover:text-white/60 transition-colors font-extralight">
              blog
            </Link>
          </nav>
        </div>

        {/* Auth actions - Show on all screen sizes but adjust size for mobile */}
        <div className="flex items-center gap-2 lg:gap-4">
          <MagneticGlowButton
            onClick={() => router.push("/chat")}
            glowColor="rgba(23, 139, 241, 0.15)"
            magneticPull={0.15}
            glowSize={120}
            className={cn(
              "transition-all duration-300",
              "text-sm font-light text-white/80 hover:text-white/90",
              "bg-[#178bf1]/5 hover:bg-[#178bf1]/10",
              "border border-white/[0.08]",
              // Mobile styles
              "px-4 py-1.5 min-w-[90px]",
              // Desktop styles
              "lg:px-6 lg:py-2 lg:min-w-[120px]"
            )}
          >
            sign in
          </MagneticGlowButton>
        </div>
      </div>
    </header>
  )
} 
