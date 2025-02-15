"use client"

import { Header } from "@/components/ui/header"
import { MobileNavDock } from "@/components/ui/mobile-nav-dock"

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <MobileNavDock />
    </div>
  )
} 