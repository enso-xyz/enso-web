"use client"

import React, { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import type { Session } from "@supabase/supabase-js"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Logo } from "@/components/ui/logo"
import { Header } from "@/components/ui/header"
import { MessageInput } from "@/components/chat/messages/MessageInput"
import { MessageBubble } from "@/components/chat/messages/MessageBubble"
import { ReferencePreview } from "@/components/chat/references/ReferencePreview"
import { motion } from "framer-motion"
import { ChatHeader } from "@/components/chat/ChatHeader"
import { SharedFooter } from "@/components/ui/shared-footer"
import { CONTEXT_TYPES, CONTEXT_PREVIEWS } from "@/lib/constants/demo-content"

export default function RootPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)

  // Prevent scroll on mount and any time content changes
  useEffect(() => {
    const preventScroll = () => {
      window.scrollTo(0, 0)
    }

    // Initial prevention
    preventScroll()

    // Add listener for any dynamic content changes
    window.addEventListener('scroll', preventScroll, { once: true })

    // Cleanup
    return () => {
      window.removeEventListener('scroll', preventScroll)
    }
  }, [])

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setIsLoading(false)
    })
  }, [])

  // Handle loading state
  if (isLoading) return null

  // Redirect if logged in
  if (session) {
    router.push("/chat")
    return null
  }

  // Update the demo messages to show a more relatable group chat
  const demoMessages = [{
    id: "1",
    chat_id: "demo",
    sender_id: "user_1",
    content: "omg tickets secured for weekend 1!! 🎡✨",
    created_at: new Date().toISOString(),
    sender: { email: "kai@enso.chat" }
  }, {
    id: "2",
    chat_id: "demo",
    sender_id: "user_2",
    content: "LETS GOOO!! check the >festival-memories from last year, we need to recreate that sunset pic at the ferris wheel 🌅",
    created_at: new Date().toISOString(),
    sender: { email: "emma@enso.chat" }
  }, {
    id: "3",
    chat_id: "demo",
    sender_id: "user_3",
    content: "@mia did you see frank ocean is headlining?? 😭 i'm literally crying rn",
    created_at: new Date().toISOString(),
    sender: { email: "alex@enso.chat" }
  }, {
    id: "4",
    chat_id: "demo",
    sender_id: "user_1",
    content: "adding everything to #festival-fits!! need to start planning the looks asap 👗",
    created_at: new Date().toISOString(),
    sender: { email: "mia@enso.chat" }
  }
]

  return (
    <>
      <Header />
      
      {/* Hero section */}
      <section className="relative min-h-screen flex items-center justify-center bg-[var(--black-pure)]">
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--black-pure)] via-[var(--black-pure)] to-black opacity-80" />
        </div>

        <div className="relative w-full max-w-[1400px] mx-auto px-8 md:px-12 lg:px-16">
          <div className="flex flex-col items-center text-center">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <Logo size="lg" />
            </motion.div>

            {/* Taglines */}
            <div className="mt-12 space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-4xl md:text-5xl lg:text-6xl tracking-tight"
              >
                <span className="font-extralight tracking-[-0.05em] text-white/40">conversation</span>
                <span className="font-light text-white/90"> reimagined</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="text-lg md:text-xl text-white/40 font-extralight max-w-xl mx-auto"
              >
                experience chat that remembers, understands, and grows with you. powered by ambient intelligence.
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo section with black background */}
      <section className="bg-[var(--black-pure)] min-h-[90vh] flex flex-col -mt-24 border-t border-white/10">
        {/* Demo container */}
        <div className="flex-1 flex items-start justify-center pt-32 pb-4">
          <div className="w-full max-w-[1400px] mx-auto px-8 md:px-12 lg:px-16">
            <div className="relative max-w-4xl mx-auto border border-white/5 rounded-2xl">
              {/* Chat window frame */}
              <div className="relative rounded-2xl bg-black/40 overflow-hidden backdrop-blur-sm">
                <ChatHeader 
                  chatId="demo"
                  type="group"
                  title="coachella chat 🎡"
                  participants={[
                    {
                      user_id: "1",
                      joined_at: new Date().toISOString(),
                      last_read_at: new Date().toISOString(),
                      profiles: {
                        id: "1",
                        email: "emma@enso.chat",
                        full_name: "Emma Chen"
                      }
                    },
                    {
                      user_id: "2",
                      joined_at: new Date().toISOString(),
                      last_read_at: new Date().toISOString(),
                      profiles: {
                        id: "2",
                        email: "alex@enso.chat",
                        full_name: "Alex Rivera"
                      }
                    },
                    {
                      user_id: "3",
                      joined_at: new Date().toISOString(),
                      last_read_at: new Date().toISOString(),
                      profiles: {
                        id: "3",
                        email: "maya@enso.chat",
                        full_name: "Maya Patel"
                      }
                    }
                  ]}
                  demo={true}
                />
                {/* Chat content */}
                <div className="p-10 space-y-4">
                  {/* Messages */}
                  {demoMessages.map((message) => (
                    <MessageBubble key={message.id} message={message} className="text-lg" />
                  ))}

                  {/* References */}
                  <div className="flex flex-wrap gap-5">
                    {CONTEXT_TYPES.map((type) => (
                      <ReferencePreview 
                        key={type}
                        reference={{
                          id: type,
                          type: type,
                          ...CONTEXT_PREVIEWS.social[type],
                          content: CONTEXT_PREVIEWS.social[type].preview,
                          similarity: 1
                        }}
                        className="scale-110"
                        demo={true}
                      />
                    ))}
                  </div>

                  {/* Input */}
                  <div className="pt-6">
                    <MessageInput chatId="demo" className="text-lg" demo={true} />
                  </div>

                  {/* Context tags */}
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-white/60">
                      @ mention
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-white/60">
                      # topic
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-white/60">
                      # tag
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-white/60">
                      📄 file
                    </button>
                    <a 
                      href="https://coachella.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-white/60 flex items-center gap-2 hover:text-white/80 transition-colors"
                    >
                      🔗 coachella.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -inset-12 -z-10">
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--blue-primary)]/20 via-transparent to-[var(--blue-primary)]/20 blur-3xl opacity-30" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <SharedFooter />
    </>
  )
}
