"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Header } from "@/components/ui/header"
import { MessageInput } from "@/components/chat/messages/MessageInput"
import { MessageBubble } from "@/components/chat/messages/MessageBubble"
import { ReferencePreview } from "@/components/chat/references/ReferencePreview"
import { ChatHeader } from "@/components/chat/ChatHeader"
import { cn } from "@/lib/utils"
import { ContextPreview } from "@/components/chat/context/ContextPreview"
import { STORY_TYPES, CONTEXT_TYPES, CONTEXT_PREVIEWS, DEMO_CONTENT, type StoryType, type ContextType } from "@/lib/constants/demo-content"
import { Footer } from "@/components/ui/footer"
import { SharedFooter } from "@/components/ui/shared-footer"
import { ContextBar } from "@/components/chat/context/ContextBar"
import type { Context } from "@/types/ai/context"

type DemoContent = React.ReactNode | ((story: StoryType) => React.ReactElement)

interface Feature {
  title: string
  subtitle: string
  content: string
  demo: DemoContent
}

export default function FeaturesPage() {
  const [activeContextType, setActiveContextType] = React.useState<ContextType>('user')
  const [activeStory, setActiveStory] = React.useState<StoryType>('social')
  const [hasLoaded, setHasLoaded] = React.useState(false)

  // Set hasLoaded on mount
  React.useEffect(() => {
    setHasLoaded(true)
  }, [])

  const demoFade = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  }

  const getStoryContent = (story: StoryType) => DEMO_CONTENT[story]

  const demoContexts: Context[] = [
    {
      id: 'demo-user',
      type: 'user',
      title: 'Alex Rivera',
      subtitle: 'Online',
      metadata: {
        email: 'alex@enso.chat',
        avatar_url: '/avatars/alex.jpg'
      }
    },
    {
      id: 'demo-thread',
      type: 'thread',
      title: 'Project Brainstorm',
      subtitle: 'Updated 2h ago',
      metadata: { messages: 24 }
    }
  ]

  const features: Feature[] = [
    {
      title: "thread linking",
      subtitle: "conversations that remember",
      content: "naturally reference past conversations and watch as context flows between threads. no more searching through message history—just mention a thread and watch the context emerge.",
      demo: (story: StoryType) => (
        <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden backdrop-blur-sm h-[400px] flex flex-col">
          <ChatHeader 
            chatId="demo-1"
            type="group"
            title={getStoryContent(story).threadLinking.title}
            participants={[
              {
                user_id: "1",
                joined_at: new Date().toISOString(),
                last_read_at: new Date().toISOString(),
                profiles: {
                  id: "1",
                  email: "alex@enso.chat",
                  full_name: "Alex Rivera"
                }
              }
            ]}
          />
          
          <div className="p-6 space-y-6 flex-1 overflow-auto">
            <MessageBubble
              message={{
                id: "1",
                chat_id: "demo",
                sender_id: "system",
                content: getStoryContent(story).threadLinking.message,
                created_at: new Date().toISOString(),
                sender: {
                  email: "demo@enso.chat"
                }
              }}
              contexts={demoContexts}
            />
          </div>

          {/* Global context bar */}
          <ContextBar
            contexts={demoContexts}
            onContextRemove={(id) => console.log('remove', id)}
          />
        </div>
      )
    },
    {
      title: "message composition",
      subtitle: "express with intention",
      content: "your thoughts flow naturally into a living web of meaning, weaving connections through the digital consciousness. our ambient intelligence understands your intent, helping ideas resonate across conversations.",
      demo: (
        <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden backdrop-blur-sm h-[400px] flex flex-col">
          {/* Add context bar above input */}
          <ContextBar 
            contexts={demoContexts}
            variant="input"
            className="border-b border-white/5"
          />
          
          <div className="p-6 flex-1">
            <MessageInput chatId="demo-2" demo={true} />
          </div>
        </div>
      )
    },
    {
      title: "context intelligence",
      subtitle: "ambient awareness",
      content: "as you chat, enso builds a rich understanding of your conversations. mentions of people, threads, and topics are automatically detected and linked, creating a living tapestry of context that grows with every interaction.",
      demo: (
        <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden backdrop-blur-sm h-[400px]">
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              {CONTEXT_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveContextType(type)}
                  className={cn(
                    "px-3 py-1 text-sm font-light rounded-lg transition-colors whitespace-nowrap",
                    type === activeContextType ? "text-white/90 bg-white/5" : "text-white/40 hover:text-white/60"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeContextType}-${activeStory}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ 
                    duration: 0.5,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                >
                  <ContextPreview
                    type={activeContextType}
                    {...CONTEXT_PREVIEWS[activeStory][activeContextType]}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      )
    }
  ]

  const renderDemo = (feature: Feature) => {
    return (
      <motion.div
        key={`${feature.title}-${activeStory}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ 
          duration: 0.5,
          ease: [0.4, 0, 0.2, 1]
        }}
        className="absolute inset-0 lg:px-6"
      >
        {typeof feature.demo === 'function' ? feature.demo(activeStory) : feature.demo}
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* Hero */}
      <section className="h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-extralight mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            features that feel natural
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-lg md:text-xl font-extralight text-white/60 max-w-2xl mx-auto">
              every capability is designed to enhance your natural flow of conversation,
              <br />not interrupt it
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sticky story selector with glass effect */}
      <div className="sticky top-24 z-40 mb-16 pt-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className={cn(
            "py-4 px-6 backdrop-blur-[12px] backdrop-saturate-[1.8]",
            "bg-black/[0.65] rounded-xl border border-white/[0.08]",
            "supports-[backdrop-filter]:bg-black/[0.65]",
            "supports-[backdrop-filter]:backdrop-blur-[12px]",
            "inline-block left-1/2 -translate-x-1/2 relative"
          )}
        >
          <div className="flex items-center justify-center gap-0">
            {STORY_TYPES.map((story) => (
              <button
                key={story.value}
                onClick={() => setActiveStory(story.value)}
                className={cn(
                  "px-3 py-1 text-sm font-light rounded-lg transition-colors whitespace-nowrap",
                  story.value === activeStory 
                    ? "text-white/90 bg-white/5" 
                    : "text-white/40 hover:text-white/60"
                )}
              >
                {story.label}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {features.map((feature, index) => (
            <section
              key={`${feature.title}-${activeStory}`}
              className={cn(
                "min-h-[calc(100vh-8rem)] flex items-center",
                // Add scroll margin to the last section to push up the sticky selector
                index === features.length - 1 ? "scroll-margin-top-[96px]" : ""
              )}
              // Add id to last section for scroll behavior
              id={index === features.length - 1 ? "last-feature" : undefined}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 w-full">
                {/* Feature copy */}
                <div className="lg:sticky lg:top-32 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg text-white/60 font-extralight">
                      {feature.subtitle}
                    </h3>
                    <h2 className="text-3xl md:text-4xl font-light">
                      {feature.title}
                    </h2>
                  </div>
                  <p className="text-lg font-extralight text-white/60 leading-relaxed">
                    {feature.content}
                  </p>
                </div>
                {/* Demo container */}
                <div className="relative h-[400px]">
                  <AnimatePresence mode="wait">
                    {renderDemo(feature)}
                  </AnimatePresence>
                </div>
              </div>
            </section>
          ))}
        </motion.div>
      </div>

      <SharedFooter />
    </div>
  )
} 