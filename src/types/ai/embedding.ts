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

export interface EmbeddingJob {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  error?: string
  result?: number[]
  metadata?: {
    model?: string
    dimension?: number
    processingTime?: number
  }
} 