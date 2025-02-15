export type ContextType = 'user' | 'thread' | 'topic' | 'file' | 'link'

export interface ContextMetadata {
  title?: string
  description?: string
  url?: string
  name?: string
  email?: string
  full_name?: string
  subtitle?: string
  [key: string]: any
}

export interface Context {
  id: string
  type: ContextType
  title: string
  subtitle?: string
  metadata: ContextMetadata
}

export interface Reference {
  id: string
  type: ContextType
  title: string
  content: string
  preview?: string
  metadata?: ContextMetadata
  similarity: number
  url?: string
}

export interface ContextAnalysis {
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

export interface KnowledgeGraph {
  nodes: Array<{
    id: string
    type: string
    label: string
    data: any
  }>
  edges: Array<{
    source: string
    target: string
    type: string
    weight: number
  }>
}

export interface Suggestion {
  id: string
  type: ContextType
  title: string
  preview?: string
  metadata?: ContextMetadata
  confidence: number
} 