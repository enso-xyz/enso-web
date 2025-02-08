"use client"

import React, { useEffect } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/ui/header"
import { Logo } from "@/components/ui/logo"
import { SharedFooter } from "@/components/ui/shared-footer"

export default function AboutPage() {
  // Prevent scroll issues
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 }
  }

  const sections = [
    {
      title: "in the space between messages,",
      subtitle: "there is meaning.",
      content: "digital conversations have become fragmented—disconnected moments lost in time. enso reimagines messaging as a fluid space where context flows naturally and every interaction builds understanding."
    },
    {
      title: "ambient intelligence",
      subtitle: "woven into conversation.",
      content: "we don't generate responses or replace human thought. instead, we enhance your natural flow of conversation with contextual intelligence that surfaces meaning, preserves understanding, and deepens connection."
    },
    {
      title: "beyond the interface,",
      subtitle: "into experience.",
      content: "we've crafted every feature to serve meaning. from thread linking to semantic search, each capability is designed to feel natural and intentional—enhancing rather than interrupting your conversations."
    },
    {
      title: "your thoughts,",
      subtitle: "amplified.",
      content: "enso grows with you, learning the patterns of your communication and the context of your connections. it's not about artificial conversation—it's about making your natural conversations more meaningful."
    }
  ]

  const principles = [
    {
      title: "privacy by design",
      content: "your conversations are yours alone. we build trust through design, not promises. every feature, every interaction is crafted with privacy as its foundation."
    },
    {
      title: "intelligence as enhancement",
      content: "our AI features don't replace or generate conversation—they enhance your natural communication by preserving context, surfacing connections, and deepening understanding."
    },
    {
      title: "spatial memory",
      content: "conversations have a sense of place. we preserve context through intuitive spatial relationships, making digital dialogue feel as natural as thought itself."
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* Hero */}
      <section className="h-[95vh] flex items-center justify-center">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <Logo className="transform scale-150 mb-16" />
            </motion.div>
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-extralight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              conversation reimagined
            </motion.h1>
        </div>
      </section>

      {/* Vision Sections */}
      <div className="max-w-4xl mx-auto px-8 pb-32">
        {sections.map((section, index) => (
          <motion.section
            key={index}
            className="mb-32 md:mb-48"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              initial: { opacity: 0 },
              animate: { opacity: 1 }
            }}
          >
            <motion.div 
              className="space-y-6"
              variants={fadeIn}
            >
              <div className="space-y-1">
                <h2 className="text-2xl md:text-3xl font-extralight text-white/60">
                  {section.title}
                </h2>
                <h3 className="text-2xl md:text-3xl font-light text-white/90">
                  {section.subtitle}
                </h3>
              </div>
              <p className="text-lg md:text-xl font-extralight text-white/60 leading-relaxed max-w-2xl">
                {section.content}
              </p>
            </motion.div>
          </motion.section>
        ))}

      {/* Principles */}
        <div className="border-t border-white/10 pt-32 space-y-24">
            {principles.map((principle, index) => (
            <motion.section
                key={index}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeIn}
              >
                <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-light text-white/90">
                    {principle.title}
                  </h2>
                <p className="text-lg md:text-xl font-extralight text-white/60 leading-relaxed">
                    {principle.content}
                  </p>
                </div>
            </motion.section>
            ))}

          </div>

      {/* Join Us */}
        <motion.section
          className="mt-32 pt-32 border-t border-white/10"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-light text-white/90">
              shape the future of conversation
            </h2>
            <p className="text-lg md:text-xl font-extralight text-white/60 leading-relaxed">
              we're looking for people who understand that in the space between messages, there is meaning. who see the poetry in pixels and feel the weight of whitespace.
            </p>
            <div className="pt-8">
              <a 
                href="mailto:hello@enso.chat" 
                className="text-lg text-white/60 hover:text-white/90 transition-colors font-extralight"
              >
                hello@enso.chat
              </a>
            </div>
        </div>
        </motion.section>
      </div>

      <SharedFooter />
    </div>
  )
} 
