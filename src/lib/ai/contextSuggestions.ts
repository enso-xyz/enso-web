import { AIService } from './services'
import { getSupabaseClient } from '../supabase/client'
import type { Context } from "@/types/ai/context"

export interface SuggestionResult {
  contexts: Context[]
  loading: boolean
  error: string | null
}

export class ContextSuggestionService {
  private static debounceTimeout: NodeJS.Timeout | null = null
  private static currentQuery: string | null = null

  static async getSuggestions(
    text: string,
    options: {
      types?: string[]
      limit?: number
      debounceMs?: number
    } = {}
  ): Promise<SuggestionResult> {
    // Don't search for very short queries
    if (text.length < 3) {
      return { contexts: [], loading: false, error: null }
    }

    // Debounce requests
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout)
    }

    return new Promise((resolve) => {
      this.debounceTimeout = setTimeout(async () => {
        try {
          // Generate embedding for search
          const embedding = await AIService.generateEmbedding(text)
          
          // Search for similar content
          const supabase = getSupabaseClient()
          const { data: contexts, error } = await supabase.rpc('match_contexts', {
            query_embedding: embedding,
            match_threshold: 0.7,
            match_count: options.limit || 5,
            filter_types: options.types
          })

          if (error) throw error

          // Fetch media suggestions (images, videos, etc)
          const { data: media } = await supabase.functions.invoke('find-references', {
            body: { query: text, type: 'media' }
          })

          // Combine and format results
          const contextsArray = Array.isArray(contexts) ? contexts : []
          const suggestions: Context[] = [
            ...contextsArray.map((ctx: any) => ({
              id: ctx.id,
              type: ctx.type,
              title: ctx.title,
              subtitle: ctx.description,
              preview: ctx.preview,
              metadata: {
                author: ctx.author,
                date: ctx.created_at,
                source: ctx.source
              }
            })),
            ...(media?.references || []).map((ref: any) => ({
              id: ref.id,
              type: 'media',
              title: ref.title,
              preview: ref.url,
              metadata: {
                type: ref.media_type,
                source: ref.source
              }
            }))
          ]

          resolve({
            contexts: suggestions,
            loading: false,
            error: null
          })

        } catch (error) {
          console.error('Error getting suggestions:', error)
          resolve({
            contexts: [],
            loading: false,
            error: error.message
          })
        }
      }, options.debounceMs || 300)
    })
  }

  static cancelPending() {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout)
      this.debounceTimeout = null
    }
    this.currentQuery = null
  }
}
