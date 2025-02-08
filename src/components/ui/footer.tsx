"use client"

import React from "react"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { cn } from "@/lib/utils"

interface FooterProps {
  className?: string
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn("border-t border-white/5 bg-black/20 backdrop-blur-sm", className)}>
      <div className="max-w-6xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Logo size="sm" />
            <p className="text-sm font-extralight text-white/40">
              ambient intelligence for chat 
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-light text-white/60">product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/features" className="text-sm font-extralight text-white/40 hover:text-white/60 transition-colors">
                  features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm font-extralight text-white/40 hover:text-white/60 transition-colors">
                  pricing
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm font-extralight text-white/40 hover:text-white/60 transition-colors">
                  about
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm font-extralight text-white/40 hover:text-white/60 transition-colors">
                  blog
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-light text-white/60">legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm font-extralight text-white/40 hover:text-white/60 transition-colors">
                  privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm font-extralight text-white/40 hover:text-white/60 transition-colors">
                  terms
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-light text-white/60">connect</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://twitter.com/enso_chat" target="_blank" rel="noopener noreferrer" className="text-sm font-extralight text-white/40 hover:text-white/60 transition-colors">
                  twitter
                </a>
              </li>
              <li>
                <a href="https://github.com/enso-org" target="_blank" rel="noopener noreferrer" className="text-sm font-extralight text-white/40 hover:text-white/60 transition-colors">
                  github
                </a>
              </li>
              <li>
                <a href="mailto:hello@enso.chat" className="text-sm font-extralight text-white/40 hover:text-white/60 transition-colors">
                  email
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-white/5">
          <p className="text-sm font-extralight text-white/40">
            © 2024 enso. all rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
} 