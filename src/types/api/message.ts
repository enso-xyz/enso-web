import { Reference } from '../ai/context'

export interface Message {
  id: string
  chat_id: string
  content: string
  sender_id: string
  created_at: string
  embedding?: number[]
  references?: Reference[]
  sender?: {
    email: string
    full_name?: string
    avatar_url?: string
  }
  status?: 'sending' | 'processing' | 'sent' | 'error'
  metadata?: MessageMetadata
}

export interface MessageContext {
  recentMessages: string[]
  attachedFiles?: File[]
  threadContext?: string
  totalTokens?: number
}

export interface MessageMetadata {
  analysis?: any // Will be defined in AI types
  files?: any[] // Will be defined in file types
  references?: Reference[]
  contexts?: Reference[]
  similar?: string[]
} 