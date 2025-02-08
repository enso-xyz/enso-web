import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { cn } from "@/lib/utils"
import { User, Hash, Link2, FileText, Smile } from "lucide-react"
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

// Tag patterns for highlighting
const TAG_PATTERNS = {
  user: /@(\w+)/g,
  topic: /#(\w+)/g,
  thread: />(\w+)/g,
  file: /!(\w+)/g,
  emoji: /:(\w+):/g,
}

interface MarkdownPreviewProps {
  content: string
  className?: string
}

export function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
  // Process tags in text
  const processText = (text: string) => {
    let result = text
    
    // Define special tags for highlighting
    const tags: { pattern: RegExp; type: string; icon: React.ReactNode }[] = [
      { pattern: TAG_PATTERNS.user, type: "user", icon: <User className="h-3 w-3" /> },
      { pattern: TAG_PATTERNS.topic, type: "topic", icon: <Hash className="h-3 w-3" /> },
      { pattern: TAG_PATTERNS.thread, type: "thread", icon: <Link2 className="h-3 w-3" /> },
      { pattern: TAG_PATTERNS.file, type: "file", icon: <FileText className="h-3 w-3" /> },
      { pattern: TAG_PATTERNS.emoji, type: "emoji", icon: <Smile className="h-3 w-3" /> },
    ]

    // Process special tags
    tags.forEach(({ pattern, type, icon }) => {
      result = result.replace(pattern, (match, name) => {
        return `<span class="inline-flex items-center gap-0.5 px-1 rounded bg-white/5 text-white/80">
          ${icon}
          <span>${name}</span>
        </span>`
      })
    })

    // Process HTML tags
    const htmlTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code']
    htmlTags.forEach((tag) => {
      result = result.replace(new RegExp(`<${tag}>`, 'g'), (match) => {
        return `<span class="inline-flex items-center gap-0.5 px-1 rounded bg-white/5 text-white/80">
          ${match}
        </span>`
      })
    })

    return result
  }

  return (
    <div className={cn("prose prose-invert max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // Custom code block renderer
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            const lang = match ? match[1] : ""
            
            if (!lang) {
              return (
                <code className={cn("bg-white/5 px-1.5 py-0.5 rounded", className)} {...props}>
                  {children}
                </code>
              )
            }

            return (
              <div className="relative group">
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-white/40 bg-white/5 px-1.5 py-0.5 rounded">
                    {lang}
                  </span>
                </div>
                <SyntaxHighlighter
                  language={lang}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: "0.375rem",
                  }}
                  style={oneDark as unknown as { [key: string]: React.CSSProperties }}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            )
          },

          // Custom paragraph renderer for tag highlighting
          p({ children }) {
            if (typeof children === "string") {
              return (
                <p dangerouslySetInnerHTML={{ __html: processText(children) }} />
              )
            }
            return <p>{children}</p>
          },

          // Custom link renderer
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                {children}
              </a>
            )
          },

          // Custom image renderer
          img({ src, alt }) {
            return (
              <div className="relative group">
                <img
                  src={src}
                  alt={alt}
                  className="rounded-lg max-h-[300px] object-contain bg-black/20"
                />
                {alt && (
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-white/80">{alt}</span>
                  </div>
                )}
              </div>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
} 