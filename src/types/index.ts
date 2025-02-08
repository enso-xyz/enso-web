// API Types
export * from './api/chat'
export * from './api/message'
export * from './api/user'

// AI Types
export * from './ai/context'
export * from './ai/embedding' 

export type ChatType = 'personal' | 'direct' | 'group'

export interface ChatParticipant {
  chat_id: string
  user_id: string
  joined_at: string
  last_read_at: string
  profiles?: {
    id: string
    email: string
    full_name?: string | null
    avatar_url?: string | null
  }
} 
