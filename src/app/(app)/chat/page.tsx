"use client"

import React from "react"

export default function ChatPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl tracking-tight">
          <span className="font-extralight tracking-[-0.05em] text-white/70">welcome to</span>
          <span className="font-light text-white/90"> enso</span>
        </h1>
        <p className="text-sm text-white/40 font-extralight leading-relaxed">
          start a new conversation or select an existing one from the sidebar.
          <br />
          your messages are end-to-end encrypted.
        </p>
      </div>
    </div>
  )
}