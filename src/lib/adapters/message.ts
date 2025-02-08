import type { Message as SupabaseMessage } from "@/lib/supabase/messages"
import type { Message as UIMessage } from '@/types'

export function adaptMessage(message: SupabaseMessage): UIMessage {
  return {
    ...message,
    references: []
  }
}

export function adaptMessages(messages: SupabaseMessage[]): UIMessage[] {
  return messages.map(adaptMessage)
} 