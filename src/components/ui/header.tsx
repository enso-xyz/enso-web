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

        {/* Auth actions - Hidden on mobile, fades in on lg breakpoint */}
        <div className="hidden lg:flex items-center gap-4 opacity-0 lg:opacity-100 transition-opacity duration-300">
          <MagneticGlowButton
            onClick={() => router.push("/login")}
            glowColor="rgba(255, 255, 255, 0.1)"
            magneticPull={0.15}
            glowSize={120}
            className="min-w-[120px] px-6 py-2 text-sm font-light text-white/60 hover:text-white/80 transition-colors"
          >
            sign in
          </MagneticGlowButton>
          <MagneticGlowButton
            onClick={() => router.push("/chat")}
            glowColor="rgba(139, 92, 246, 0.15)"
            magneticPull={0.15}
            glowSize={120}
            className="min-w-[120px] px-6 py-2 text-sm font-light text-white/80 hover:text-white/90 transition-colors bg-white/5 hover:bg-white/10"
          >
            get started
          </MagneticGlowButton>
        </div>
      </div>
    </header>
  )
} 
