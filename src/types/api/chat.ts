import { Message } from './message'

export type ChatType = 'personal' | 'direct' | 'group'

export interface Chat {
  id: string
  created_at: string
  type: ChatType
  title?: string
  created_by: string
  last_message?: {
    content: string
    sender_id: string
    created_at: string
    sender?: {
      email?: string
      full_name?: string
    }
  }
  chat_participants?: ChatParticipant[]
  is_archived?: boolean
  pinned?: boolean
  last_viewed_at?: string
  labels?: string[]
  has_unread?: boolean
  messages?: Message[]
}

export interface ChatParticipant {
  chat_id: string
  user_id: string
  joined_at: string
  last_read_at: string
  profiles: {
    id: string
    email: string
    full_name?: string | null
    avatar_url?: string | null
  }
}

export type ChatWithDetails = Chat & {
  messages?: Message[]
  chat_participants?: ChatParticipant[]
}

export interface GetChatsOptions {
  archived?: boolean
  type?: ChatType
  search?: string
  labels?: string[]
}

export type ChatFilterType = 'all' | 'personal' | 'direct' | 'group' | 'archived' 