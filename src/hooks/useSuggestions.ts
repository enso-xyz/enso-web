"use client"

import { useState, useEffect, useRef } from "react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { Context } from "@/components/chat/context/ContextBar"
import Fuse from 'fuse.js'
import { ContextService } from "@/lib/ai/context"

interface SuggestionOptions {
  type?: string
  limit?: number
  threshold?: number
}

interface ContextData {
  id: string
  type: string
  title: string
  description?: string
  embedding?: number[]
}

export function useSuggestions(query: string, chatId: string, options: SuggestionOptions = {}) {
  const [suggestions, setSuggestions] = useState<ContextData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  // Use refs to store cache and prevent recreation on every render
  const contextCacheRef = useRef<{
    embeddings: number[][]
    contexts: ContextData[]
  }>({ embeddings: [], contexts: [] })
  
  const fuseRef = useRef<Fuse<ContextData>>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize cache and Fuse instance
  useEffect(() => {
    const initializeCache = async () => {
      try {
        setIsLoading(true)
        const contexts = await ContextService.findSimilarContexts(query, {
          type: options.type,
          limit: options.limit,
          threshold: options.threshold,
          chatId
        })

        if (!contexts) return

        // Format contexts
        const formattedContexts = contexts.map(c => ({
          id: c.id,
          type: c.type,
          title: c.metadata.title || c.metadata.name || 'Untitled',
          subtitle: c.metadata.description
        }))

        // Update cache
        contextCacheRef.current = {
          embeddings: contexts.map(d => d.embedding || []),
          contexts: formattedContexts
        }

        // Initialize Fuse
        fuseRef.current = new Fuse(formattedContexts, {
          keys: ['title', 'subtitle'],
          threshold: 0.3
        })

        setSuggestions(formattedContexts)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize suggestions'))
      } finally {
        setIsLoading(false)
      }
    }

    // Debounce initialization
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (query.length >= 2) {
      timeoutRef.current = setTimeout(initializeCache, 300)
    } else {
      setSuggestions([])
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [query, chatId, options.type, options.limit, options.threshold])

  // Function for triggering deep analysis
  const triggerDeepAnalysis = async () => {
    if (!query.trim()) return
    
    setIsLoading(true)
    try {
      const supabase = getSupabaseClient()
      const { data } = await supabase.functions.invoke('analyze-message', {
        body: {
          content: query,
          chatId,
          mode: 'deep'
        }
      })
      
      if (data?.suggestions) {
        setSuggestions(data.suggestions)
      }
    } catch (err) {
      console.error('Deep analysis error:', err)
      setError(err instanceof Error ? err : new Error('Failed to analyze'))
    } finally {
      setIsLoading(false)
    }
  }

  return {
    suggestions,
    isLoading,
    error,
    triggerDeepAnalysis // Expose for manual triggering
  }
} 
