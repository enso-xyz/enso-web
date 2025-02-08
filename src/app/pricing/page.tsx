"use client"

import React, { useState } from "react"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/ui/header"
import { Card } from "@/components/ui/card"
import { BorderGlowButton } from "@/components/ui/border-glow-button"
import { SharedFooter } from "@/components/ui/shared-footer"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { LogoCard } from "@/components/ui/logo-card"

// Define gradient colors
const chatGradients = [
  'from-[#178bf1] to-[#4c6ef5]',  // Blue gradient
  'from-[#9333ea] to-[#7c3aed]',  // Purple gradient
  'from-[#ec4899] to-[#d946ef]',  // Pink gradient
  'from-[#2dd4bf] to-[#14b8a6]',  // Teal gradient
  'from-[#f43f5e] to-[#e11d48]',  // Rose gradient
  'from-[#8b5cf6] to-[#6d28d9]'   // Violet gradient
]

interface PricingTier {
  name: string
  price: string
  description: string
  features: string[]
  highlight?: boolean
  aiOps: string
  history: string
  glowColor?: string
  borderGlowColor?: string
}

const tiers: PricingTier[] = [
  {
    name: "essence",
    price: "$2",
    description: "personal messaging with ambient intelligence.",
    aiOps: "100 AI operations per day",
    history: "30-day message history",
    glowColor: "rgba(255, 255, 255, 0.1)",
    borderGlowColor: "rgba(255, 255, 255, 0.2)",
    features: [
      "unlimited 1:1 conversations",
      "basic thread linking & context",
      "semantic search",
      "web & mobile access",
      "basic integrations (read-only)"
    ]
  },
  {
    name: "flow",
    price: "$10",
    description: "enhanced intelligence for power users.",
    highlight: true,
    aiOps: "1000 AI operations per day",
    history: "unlimited message history",
    glowColor: "rgba(96, 165, 250, 0.2)",
    borderGlowColor: "rgba(96, 165, 250, 0.3)",
    features: [
      "everything in essence, plus:",
      "advanced semantic search",
      "voice messages & transcription",
      "advanced thread linking",
      "custom themes",
      "priority AI queue access",
      "full integrations",
      "offline access"
    ]
  },
  {
    name: "aether",
    price: "$20",
    description: "private spaces with shared intelligence.",
    aiOps: "priority AI access",
    history: "unlimited message history",
    glowColor: "rgba(167, 139, 250, 0.2)",
    borderGlowColor: "rgba(167, 139, 250, 0.3)",
    features: [
      "everything in flow, plus:",
      "private spaces (up to 12 people)",
      "shared context building",
      "group semantic search",
      "space-wide thread linking",
      "custom space themes",
      "advanced media sharing",
      "space-specific AI tuning",
      "enhanced privacy",
      "priority support"
    ]
  }
]

const faqs = [
  {
    question: "why do all plans require payment?",
    answer: "we use advanced AI models that are costly to run. rather than compromise the experience with a limited free tier, we offer a fair trial and accessible pricing for sustained quality."
  },
  {
    question: "how do AI operations work?",
    answer: "AI operations include message analysis, thread linking, semantic search, and other intelligent features. solo users get 100 operations daily, plus users get 1000, and space users get priority access."
  },
  {
    question: "what happens if i hit my AI operation limit?",
    answer: "you'll still be able to send messages and use basic features. AI features will resume the next day, or you can upgrade your plan for immediate access to more operations."
  },
  {
    question: "do you store my messages?",
    answer: "messages are stored securely and encrypted. solo tier keeps 30 days of history, while plus and space get unlimited history. you can export your data anytime."
  },
  {
    question: "what about data privacy?",
    answer: "we take privacy seriously. your messages are encrypted, and you can enable enhanced privacy mode to ensure your data is never used for model training."
  }
]

export default function PricingPage() {
  const [position, setPosition] = useState({ x: 50, y: 50 })

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPosition({ x, y })
  }

  return (
    <div className="min-h-screen bg-[var(--black-pure)] text-white">
      <Header />
      
      {/* Main content */}
      <main className="pt-32 pb-20">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="flex flex-col gap-2 text-4xl md:text-5xl lg:text-6xl font-light mb-4">
            <span>ambient intelligence</span>
            <span>for modern messaging</span>
          </h1>
          <div className="flex flex-col items-center gap-3">
            <p className="text-xl text-white/60 font-extralight">
              start with a 14-day trial of flow features
            </p>
            <span className="text-sm text-white/40 font-extralight tracking-wide">
              no credit card required
            </span>
          </div>
        </div>

        {/* Pricing grid */}
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <Card
                key={tier.name}
                onMouseMove={tier.highlight ? handleMouseMove : undefined}
                className={cn(
                  "relative border rounded-lg overflow-hidden",
                  tier.highlight
                    ? "border-[var(--blue-primary)]"
                    : "border-white/10 hover:border-white/20 bg-white/[0.02]"
                )}
              >
                {tier.highlight && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{
                      opacity: 1,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `radial-gradient(${800}px circle at ${position.x}% ${position.y}%, rgba(96, 165, 250, 0.03), transparent 40%)`,
                      }}
                    />
                  </motion.div>
                )}
                <div className="p-6 flex flex-col h-full relative z-10">
                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex items-baseline justify-between mb-2">
                      <h3 className="text-lg font-light">{tier.name}</h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-light">{tier.price}</span>
                        <span className="text-sm text-white/60">/month</span>
                      </div>
                    </div>
                    <p className="text-sm text-white/60 font-extralight">
                      {tier.description}
                    </p>
                  </div>

                  {/* AI Stats */}
                  <div className="mb-6 py-2 border-y border-white/10">
                    <div className="text-sm font-extralight">
                      {tier.aiOps}
                    </div>
                    <div className="text-sm text-white/40 font-extralight">
                      {tier.history}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-6 flex-grow">
                    {tier.features.map((feature, i) => (
                      <li 
                        key={feature}
                        className={cn(
                          "text-sm font-extralight pl-3 border-l",
                          i === 0 
                            ? "text-white/80 border-[var(--blue-primary)]" 
                            : "text-white/60 border-white/10"
                        )}
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <BorderGlowButton
                    asChild
                    glowColor={tier.highlight 
                      ? "rgba(96, 165, 250, 0.15)"
                      : tier.glowColor}
                    borderGlowColor={tier.highlight
                      ? "rgba(96, 165, 250, 0.3)"
                      : tier.borderGlowColor}
                    className={cn(
                      "w-full py-2 px-4 mt-auto",
                      "border border-white/10 hover:border-white/20",
                      tier.highlight
                        ? "bg-[var(--blue-primary)]/10 hover:bg-[var(--blue-primary)]/20 text-white/90"
                        : "text-white/60 hover:text-white/80"
                    )}
                  >
                    <Link href="/signup" className="flex items-center justify-center gap-2 text-sm font-light group">
                      start trial
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </BorderGlowButton>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-[1400px] mx-auto px-8 mt-24">
          <h2 className="text-2xl font-light mb-12 text-center">
            frequently asked questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {/* First Row */}
            <Card
              key={faqs[0].question}
              className="relative border rounded-lg overflow-hidden border-white/10 hover:border-white/20 bg-white/[0.02] md:col-span-2"
            >
              <div className="p-6 h-full">
                <h3 className="text-base font-light mb-3 text-white/80">
                  {faqs[0].question}
                </h3>
                <p className="text-sm text-white/60 font-extralight leading-relaxed">
                  {faqs[0].answer}
                </p>
              </div>
            </Card>

            <Card
              key={faqs[1].question}
              className="relative border rounded-lg overflow-hidden border-white/10 hover:border-white/20 bg-white/[0.02] md:row-span-2"
            >
              <div className="p-6 h-full">
                <h3 className="text-base font-light mb-3 text-white/80">
                  {faqs[1].question}
                </h3>
                <p className="text-sm text-white/60 font-extralight leading-relaxed">
                  {faqs[1].answer}
                </p>
              </div>
            </Card>

            {/* First Decorative Card */}
            <Card 
              className="relative group border rounded-lg overflow-hidden border-white/10 aspect-[3/3] hover:border-white/20 transition-colors duration-300"
            >
              <LogoCard className="absolute inset-0" />
            </Card>

            <Card
              key={faqs[2].question}
              className="relative border rounded-lg overflow-hidden border-white/10 hover:border-white/20 bg-white/[0.02]"
            >
              <div className="p-6 h-full">
                <h3 className="text-base font-light mb-3 text-white/80">
                  {faqs[2].question}
                </h3>
                <p className="text-sm text-white/60 font-extralight leading-relaxed">
                  {faqs[2].answer}
                </p>
              </div>
            </Card>

            {/* Third Row */}
            <Card
              key={faqs[3].question}
              className="relative border rounded-lg overflow-hidden border-white/10 hover:border-white/20 bg-white/[0.02] md:col-span-2"
            >
              <div className="p-6 h-full">
                <h3 className="text-base font-light mb-3 text-white/80">
                  {faqs[3].question}
                </h3>
                <p className="text-sm text-white/60 font-extralight leading-relaxed">
                  {faqs[3].answer}
                </p>
              </div>
            </Card>

            {/* Second Decorative Card */}
            <Card 
              className="relative group border rounded-lg overflow-hidden border-white/10 aspect-[3/4] hover:border-white/20 transition-colors duration-300"
            >
              <LogoCard className="absolute inset-0" />
            </Card>

            {/* Fourth Row */}
            <Card
              key={faqs[4].question}
              className="relative border rounded-lg overflow-hidden border-white/10 hover:border-white/20 bg-white/[0.02] md:col-span-3"
            >
              <div className="p-6 h-full">
                <h3 className="text-base font-light mb-3 text-white/80">
                  {faqs[4].question}
                </h3>
                <p className="text-sm text-white/60 font-extralight leading-relaxed">
                  {faqs[4].answer}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <SharedFooter />
    </div>
  )
} 