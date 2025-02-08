"use client"

import { useMemo } from "react"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"

interface MarkdownProps {
  content: string
}

export function Markdown({ content }: MarkdownProps) {
  const components = useMemo(
    () => ({
      code({ node, inline, className, children, ...props }: any) {
        const match = /language-(\w+)/.exec(className || "")
        const language = match ? match[1] : "typescript"

        return !inline ? (
          <div className="relative rounded-md">
            <div className="absolute right-2 top-2 z-10 text-xs text-muted-foreground">
              {language}
            </div>
            <SyntaxHighlighter
              {...props}
              style={oneDark}
              language={language}
              PreTag="div"
              customStyle={{
                margin: 0,
                borderRadius: "0.375rem",
                background: "hsl(var(--muted))",
              }}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          </div>
        ) : (
          <code className="rounded bg-muted px-1 py-0.5" {...props}>
            {children}
          </code>
        )
      },
      p({ children }: any) {
        return <p className="mb-4 last:mb-0">{children}</p>
      },
      a({ children, href }: any) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline-offset-4 hover:underline"
          >
            {children}
          </a>
        )
      },
      ul({ children }: any) {
        return <ul className="mb-4 list-disc pl-6 last:mb-0">{children}</ul>
      },
      ol({ children }: any) {
        return <ol className="mb-4 list-decimal pl-6 last:mb-0">{children}</ol>
      },
      li({ children }: any) {
        return <li className="mb-2 last:mb-0">{children}</li>
      },
      h1({ children }: any) {
        return <h1 className="mb-4 text-2xl font-bold">{children}</h1>
      },
      h2({ children }: any) {
        return <h2 className="mb-4 text-xl font-bold">{children}</h2>
      },
      h3({ children }: any) {
        return <h3 className="mb-4 text-lg font-bold">{children}</h3>
      },
      blockquote({ children }: any) {
        return (
          <blockquote className="mb-4 border-l-2 pl-4 italic">
            {children}
          </blockquote>
        )
      },
      table({ children }: any) {
        return (
          <div className="mb-4 overflow-x-auto">
            <table className="w-full border-collapse">{children}</table>
          </div>
        )
      },
      th({ children }: any) {
        return (
          <th className="border border-border bg-muted p-2 text-left">
            {children}
          </th>
        )
      },
      td({ children }: any) {
        return <td className="border border-border p-2">{children}</td>
      },
    }),
    []
  )

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={components}
      className="prose prose-sm dark:prose-invert max-w-none"
    >
      {content}
    </ReactMarkdown>
  )
} 