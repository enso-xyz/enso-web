"use client"

import React from "react"
import { Logo } from "@/components/ui/logo"
import { MagneticButton } from "@/components/ui/magnetic-button"
import Link from "next/link"

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-1">
            <Logo size="sm" />
            <h1 className="text-2xl tracking-tight">
              <span className="font-extralight tracking-[-0.05em] text-white/70">check</span>
              <span className="font-light text-white/90"> your email</span>
            </h1>
          </div>
          <p className="text-sm text-white/40 font-extralight max-w-xs mx-auto">
            we sent you a verification link. click it to activate your account and start your journey.
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#178bf1]/10 via-transparent to-transparent blur-xl" />
          <div className="relative bg-zinc-900/50 border border-white/5 rounded-lg p-6 text-center space-y-4">
            <div className="text-sm text-white/60 font-extralight">
              didn't receive the email?
            </div>
            <div className="text-xs text-white/40 font-extralight">
              check your spam folder or
              <button className="text-[#178bf1] hover:text-[#178bf1]/80 transition-colors ml-1">
                request a new link
              </button>
            </div>
          </div>
        </div>

        <div className="text-center pt-4">
          <Link href="/login" passHref legacyBehavior>
            <MagneticButton>
              back to login
            </MagneticButton>
          </Link>
        </div>
      </div>
    </div>
  )
} 