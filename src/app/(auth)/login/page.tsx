"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase/client"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { Logo } from "@/components/ui/logo"
import Link from "next/link"
import { toast } from "sonner"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = getSupabaseClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      router.push('/chat')
    } catch (error) {
      toast.error("Failed to sign in. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-1">
            <Logo size="sm" />
            <h1 className="text-2xl tracking-tight">
              <span className="font-extralight tracking-[-0.05em] text-white/70">welcome</span>
              <span className="font-light text-white/90"> back</span>
            </h1>
          </div>
          <p className="text-sm text-white/40 font-extralight">continue your journey</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label htmlFor="email" className="text-xs text-white/40 tracking-wider font-light">
              email
            </label>
            <div className="relative group">
              <div className="absolute -inset-0.5 rounded-lg opacity-0 group-focus-within:opacity-100 bg-[#178bf1]/20 blur transition duration-500" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative w-full px-4 py-3 bg-zinc-900/50 border border-white/5 rounded-lg text-white/80 text-sm 
                         focus:outline-none focus:ring-0 transition duration-500
                         placeholder:text-white/20 font-light"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-xs text-white/40 tracking-wider font-light">
              password
            </label>
            <div className="relative group">
              <div className="absolute -inset-0.5 rounded-lg opacity-0 group-focus-within:opacity-100 bg-[#178bf1]/20 blur transition duration-500" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative w-full px-4 py-3 bg-zinc-900/50 border border-white/5 rounded-lg text-white/80 text-sm 
                         focus:outline-none focus:ring-0 transition duration-500
                         placeholder:text-white/20 font-light"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <MagneticButton type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "signing in..." : "sign in"}
            </MagneticButton>
          </div>
        </form>

        <div className="text-center">
          <Link
            href="/signup"
            className="text-sm text-white/40 hover:text-white/60 transition-colors font-light"
          >
            don't have an account? sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
