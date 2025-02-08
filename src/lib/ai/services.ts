import { getSupabaseClient } from "../supabase/client"
import { ContextAnalysis } from '@/types'

interface MessageContext {
  recentMessages: string[]
  attachedFiles?: File[]
  threadContext?: string
  totalTokens?: number
}

interface ContentAnalysis {
  embedding: number[]
  topics: string[]
  entities: string[]
  sentiment: string
  references?: {
    threads: string[]
    files: string[]
    urls: string[]
  }
  summary?: string
}

export class AIService {
  static async analyzeMessage(content: string, context: MessageContext): Promise<ContentAnalysis> {
    const supabase = getSupabaseClient()
    
    // Call edge function for analysis
    const { data, error } = await supabase.functions.invoke("analyze-message", {
      body: {
        content,
        context: {
          ...context,
          attachedFiles: undefined // Don't send file data directly
        }
      }
    })

    if (error) throw error
    return data
  }

  static async findSimilarMessages(content: string, chatId: string) {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.functions.invoke("find-similar-messages", {
      body: { content, chatId }
    })
    if (error) throw error
    return data || []
  }

  static async generateResponse(content: string, context: string) {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.functions.invoke("generate-response", {
      body: { content, context }
    })
    if (error) throw error
    return data
  }

  static async findSimilarContent(embedding: number[], options: {
    threshold?: number
    limit?: number
    includeFiles?: boolean
    includedChats?: string[]
  } = {}) {
    const supabase = getSupabaseClient()
    
    // Call edge function for similarity search
    const { data, error } = await supabase.functions.invoke("find-similar", {
      body: {
        embedding,
        options
      }
    })

    if (error) throw error
    return data
  }

  static async getSmartSuggestions(content: string, context: MessageContext) {
    const supabase = getSupabaseClient()
    
    // Call edge function for suggestions
    const { data, error } = await supabase.functions.invoke("get-suggestions", {
      body: {
        content,
        context: {
          ...context,
          attachedFiles: undefined
        }
      }
    })

    if (error) throw error
    return data
  }

  static async processFile(file: File) {
    const supabase = getSupabaseClient()
    
    // Convert file to base64
    const base64 = await this.fileToBase64(file)
    
    // Call edge function for file processing
    const { data, error } = await supabase.functions.invoke("process-file", {
      body: {
        content: base64,
        type: file.type,
        name: file.name
      }
    })

    if (error) throw error
    return data
  }

  private static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const base64 = reader.result as string
        resolve(base64.split(",")[1])
      }
      reader.onerror = error => reject(error)
    })
  }

  static async generateEmbedding(text: string) {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.functions.invoke('generate-embedding', {
      body: { text }
    })
    if (error) throw error
    return data.embedding
  }
}
