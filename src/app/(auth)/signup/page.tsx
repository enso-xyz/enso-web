"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { Logo } from "@/components/ui/logo"
import Link from "next/link"
import { toast } from "sonner"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }

      router.push("/verify")
    } catch (error) {
      toast.error("failed to sign up. please try again.")
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
              <span className="font-extralight tracking-[-0.05em] text-white/70">create</span>
              <span className="font-light text-white/90"> account</span>
            </h1>
          </div>
          <p className="text-sm text-white/40 font-extralight">begin your journey</p>
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
              {isLoading ? "signing up..." : "sign up"}
            </MagneticButton>
          </div>
        </form>

        <div className="text-center">
          <Link
            href="/login"
            className="text-sm text-white/40 hover:text-white/60 transition-colors font-light"
          >
            already have an account? sign in
          </Link>
        </div>
      </div>
    </div>
  )
}