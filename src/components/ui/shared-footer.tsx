"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"
import { toast } from "sonner"

interface SharedFooterProps {
  className?: string
  showNewsletter?: boolean
}

export function SharedFooter({ className, showNewsletter = true }: SharedFooterProps) {
  const [email, setEmail] = useState("")

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // TODO: Implement newsletter subscription
      toast.success("Thanks for subscribing!")
      setEmail("")
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.")
    }
  }

  return (
    <footer className={cn("border-t border-white/5 bg-black/20 backdrop-blur-sm", className)}>
      {showNewsletter && (
        <div className="w-full max-w-[1400px] mx-auto px-8 md:px-12 lg:px-16 py-8 flex flex-col md:flex-row items-center justify-between gap-12 border-t border-b border-white/5">
          {/* Newsletter */}
          <div className="flex-1 w-full">
            <h3 className="text-2xl font-light text-white/60 mb-4">join our newsletter</h3>
            <div className="flex gap-6 max-w-md">
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email address" 
                className="flex-1 bg-transparent border-b-2 border-white/20 py-3 text-xl text-white/60 placeholder:text-white/40 focus:outline-none focus:border-white/40"
              />
              <button 
                onClick={handleSubscribe}
                className="text-xl text-white/60 hover:text-white/80 transition-colors flex items-center gap-3"
              >
                join
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* CTA */}
          <Link 
            href="/chat" 
            className="text-xl text-white/60 hover:text-white/80 transition-colors flex items-center gap-3 group"
          >
            chat now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}

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

          <div className="flex flex-col gap-2">
          <p className="text-sm font-extralight text-white/40">
            © 2025 enso.
          </p>
          <p className="text-sm font-extralight text-white/40">
            all rights reserved.
          </p>
          </div>
        </div>
      </div>
    </footer>
  )
} 
