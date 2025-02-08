import { getSupabaseClient } from "@/lib/supabase/client"
import { EmbeddingService } from "./embeddings"

export interface ContextMetadata {
  title?: string
  description?: string
  url?: string
  name?: string
  email?: string
  full_name?: string
  type?: string
  size?: string
  preview?: string
  [key: string]: any
}

export interface Context {
  id: string
  type: "thread" | "user" | "url" | "file"
  metadata: ContextMetadata
  embedding?: number[]
}

export class ContextService {
  static async findSimilarContexts(
    text: string,
    options: {
      type?: string
      limit?: number
      threshold?: number
      chatId?: string
    } = {}
  ) {
    const embedding = await EmbeddingService.generateEmbedding(text)
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.rpc("match_contexts", {
      query_embedding: embedding,
      match_threshold: options.threshold || 0.7,
      match_count: options.limit || 5,
      context_type: options.type,
      chat_id: options.chatId
    })

    if (error) throw error
    return data as Context[]
  }

  static async createContext(
    content: string,
    type: Context["type"],
    metadata: ContextMetadata = {}
  ) {
    const supabase = getSupabaseClient()
    const embedding = await EmbeddingService.generateEmbedding(content)

    const { data, error } = await supabase
      .from("contexts")
      .insert([
        {
          type,
          metadata,
          embedding
        }
      ])
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async linkContextToMessage(
    contextId: string,
    messageId: string,
    metadata: Record<string, any> = {}
  ) {
    const supabase = getSupabaseClient()

    const { error } = await supabase
      .from("message_contexts")
      .insert([
        {
          context_id: contextId,
          message_id: messageId,
          metadata
        }
      ])

    if (error) throw error
  }

  static async getMessageContexts(messageId: string) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("message_contexts")
      .select(`
        context_id,
        metadata,
        contexts (
          id,
          type,
          metadata
        )
      `)
      .eq("message_id", messageId)

    if (error) throw error
    return data?.map((row: any) => ({
      ...(row.contexts as Context),
      linkMetadata: row.metadata
    })) || []
  }
} 