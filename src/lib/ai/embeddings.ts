import crypto from "crypto"

import { getSupabaseClient } from "@/lib/supabase/client"
import { VertexAI } from "@google-cloud/vertexai"

export interface EmbeddingResponse {
  embedding: number[]
  dimension: number
  model: string
}

export interface EmbeddingOptions {
  threshold?: number
  limit?: number
  type?: string
  chatId?: string
}

export interface SimilarityMatch {
  id: string
  type: string
  content: string
  metadata: any
  similarity: number
}

export class EmbeddingService {
  // Generate embedding for text content
  private static hashContent(text: string, imageUrl?: string): string {
    return crypto
      .createHash('sha256')
      .update(text + (imageUrl || ''))
      .digest('hex')
  }

  private static async cacheEmbedding(hash: string, embedding: number[]) {
    const supabase = getSupabaseClient()
    await supabase
      .from('embedding_cache')
      .upsert({ content_hash: hash, embedding })
  }

  static async generateEmbedding(text: string): Promise<number[]> {
    const supabase = getSupabaseClient()
    const { data } = await supabase.functions.invoke('generate-embedding', {
      body: { text }
    })
    return (data?.embedding as number[]) || []
  }

  // Get cached embedding if available
  static async getCachedEmbedding(
    contentHash: string
  ): Promise<number[] | null> {
    const supabase = getSupabaseClient()
    const { data } = await supabase
      .from('embedding_cache')
      .select('embedding')
      .eq('content_hash', contentHash)
      .maybeSingle()

    return data?.embedding as number[] || null
  }

  // Find similar content using vector similarity
  static async findSimilarContent(
    embedding: number[],
    options: EmbeddingOptions = {}
  ): Promise<SimilarityMatch[]> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.rpc("match_contexts", {
      query_embedding: embedding,
      match_threshold: options.threshold || 0.7,
      match_count: options.limit || 10,
      context_type: options.type,
      chat_id: options.chatId
    })

    if (error) throw error
    return data as SimilarityMatch[]
  }

  // Batch process multiple texts
  static async batchGenerateEmbeddings(texts: string[]): Promise<number[][]> {
    const hashes = texts.map(t => this.hashContent(t))
    const { data: cached } = await getSupabaseClient()
      .from('embedding_cache')
      .select('embedding')
      .in('content_hash', hashes)

    const results = await Promise.all(texts.map(async (text, i) => {
      return (cached?.[i]?.embedding as number[]) || this.generateEmbedding(text)
    }))

    return results as number[][]
  }


  // Queue content for embedding generation
  static async queueForEmbedding(
    contentId: string,
    contentType: 'message' | 'file' | 'context'
  ): Promise<string> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.rpc('queue_for_embedding', {
      content_id: contentId,
      content_type: contentType
    })

    if (error) throw error
    return data as string
  }

  // Check embedding queue status
  static async checkEmbeddingStatus(jobId: string): Promise<{
    status: 'pending' | 'processing' | 'completed' | 'failed'
    error?: string
  }> {
    const supabase = getSupabaseClient()
    const { data } = await supabase
      .from('embedding_queue')
      .select('status, last_error')
      .eq('id', jobId)
      .single()

    return {
      status: (data?.status as 'pending' | 'processing' | 'completed' | 'failed') || 'failed',
      error: data?.last_error as string | undefined
    }
  }

  static async generateAndStore(content: string, options: { messageId: string; chatId: string }) {
    const embedding = await this.generateEmbedding(content)
    const supabase = getSupabaseClient()
    
    const { error } = await supabase
      .from('messages')
      .update({ embedding })
      .eq('id', options.messageId)

    if (error) throw error
    return embedding
  }
}
