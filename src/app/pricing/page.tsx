import React from "react"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/ui/header"
import { Card } from "@/components/ui/card"
import { GlowButton } from "@/components/ui/glow-button"
import { SharedFooter } from "@/components/ui/shared-footer"
import { cn } from "@/lib/utils"

interface PricingTier {
  name: string
  price: string
  description: string
  features: string[]
  highlight?: boolean
  aiOps: string
  history: string
}

const tiers: PricingTier[] = [
  {
    name: "solo",
    price: "$2",
    description: "personal messaging with ambient intelligence.",
    aiOps: "100 AI operations per day",
    history: "30-day message history",
    features: [
      "unlimited 1:1 conversations",
      "basic thread linking & context",
      "semantic search",
      "web & mobile access",
      "basic integrations (read-only)"
    ]
  },
  {
    name: "plus",
    price: "$10",
    description: "enhanced intelligence for power users.",
    highlight: true,
    aiOps: "1000 AI operations per day",
    history: "unlimited message history",
    features: [
      "everything in solo, plus:",
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
    name: "space",
    price: "$20",
    description: "private spaces with shared intelligence.",
    aiOps: "priority AI access",
    history: "unlimited message history",
    features: [
      "everything in plus, plus:",
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
  return (
    <div className="min-h-screen bg-[var(--black-pure)] text-white">
      <Header />
      
      {/* Main content */}
      <main className="pt-32 pb-20">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-4">
            ambient intelligence for modern messaging
          </h1>
          <div className="flex flex-col items-center gap-3">
            <p className="text-xl text-white/60 font-extralight">
              start with a 14-day trial of plus features
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
                className={cn(
                  "relative border rounded-lg overflow-hidden",
                  tier.highlight
                    ? "border-[var(--blue-primary)] bg-[var(--blue-primary)]/[0.03]"
                    : "border-white/10 hover:border-white/20 bg-white/[0.02]"
                )}
              >
                <div className="p-6">
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
                  <ul className="space-y-2 mb-6">
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
                  <Link 
                    href="/signup"
                    className={cn(
                      "flex items-center justify-center gap-2 w-full py-2 px-4 rounded transition-colors text-sm font-light",
                      tier.highlight
                        ? "bg-[var(--blue-primary)] hover:bg-[var(--blue-primary)]/90 text-white"
                        : "bg-white/5 hover:bg-white/10 text-white/80"
                    )}
                  >
                    start trial
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 max-w-4xl mx-auto">
            {faqs.map((faq) => (
              <div key={faq.question} className="group">
                <h3 className="text-base font-light mb-2 group-hover:text-white/80 transition-colors">
                  {faq.question}
                </h3>
                <p className="text-sm text-white/60 font-extralight leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <SharedFooter />
    </div>
  )
} 