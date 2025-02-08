"use client"

import React, { useEffect, useRef, useMemo } from "react"
import { format } from "date-fns"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism"

interface Message {
  id: string
  content: string
  sender: string
  timestamp: string
  chat_id: string
  sender_id: string
}

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const rawMessages = messages
  const processedMessages: Message[] = useMemo(() => 
    rawMessages.map(m => ({
      ...m,
      chat_id: "current",
      sender_id: m.sender_id || "unknown"
    })), [rawMessages])

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-4">
        {processedMessages.map((message) => (
          <div key={message.id} className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-light text-white/90">
                {message.sender}
              </span>
              <span className="text-xs text-white/40 font-extralight">
                {format(new Date(message.timestamp), "h:mm a")}
              </span>
            </div>
            <div className="pl-4">
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={{
                    code({ node, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '')
                      return match ? (
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      )
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
        {processedMessages.length === 0 && (
          <div className="flex items-center justify-center h-full p-8">
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-r from-[var(--blue-primary)] to-[var(--purple-primary)] animate-pulse" />
              <p className="text-sm text-white/40 font-light">Establishing secure channel...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 
