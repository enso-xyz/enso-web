"use client"

import { useState, useEffect } from "react"
import { getSupabaseClient } from "@/lib/supabase/client"

export interface Reference {
  id: string
  type: string
  title: string
  content: any
  metadata: any
  similarity: number
}

export function useReferences(text: string, chatId: string) {
  const [references, setReferences] = useState<Reference[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isCancelled = false

    async function detectReferences() {
      if (!text.trim()) {
      setReferences([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
        const supabase = getSupabaseClient()
        const { data: { session } } = await supabase.auth.getSession()
        
        const { data, error } = await supabase.functions.invoke("find-references", {
          body: { 
            query: text,
            chat_id: chatId 
          },
          headers: {
            Authorization: `Bearer ${session?.access_token}`
          }
        })

        if (!isCancelled) {
          if (error) throw error
          setReferences(data.matches || [])
        }
    } catch (err) {
        if (!isCancelled) {
          console.error("Error detecting references:", err)
          setError(err instanceof Error ? err : new Error("Failed to detect references"))
        }
    } finally {
        if (!isCancelled) {
      setIsLoading(false)
    }
      }
    }

    // Debounce reference detection to avoid too many API calls
    const timeoutId = setTimeout(detectReferences, 300)

    return () => {
      isCancelled = true
      clearTimeout(timeoutId)
    }
  }, [text, chatId])

  return { references, isLoading, error }
} 
