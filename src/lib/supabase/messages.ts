import { createBrowserClient } from "@supabase/ssr"
import { Message } from '@/types'
import { AIService } from '@/lib/ai/services'
import { EmbeddingService } from '@/lib/ai/embeddings'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type { Message }

export async function getMessages(chatId: string, limit = 50): Promise<Message[]> {
  const { data: messages, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:profiles (
        email,
        full_name
      )
    `)
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true })
    .limit(limit)

  if (error) throw error
  if (!messages) return []

  // Type assertion after validation
  return messages.map(msg => ({
    id: msg.id,
    chat_id: msg.chat_id,
    content: msg.content,
    sender_id: msg.sender_id,
    created_at: msg.created_at,
    sender: msg.sender,
    embedding: msg.embedding,
    references: msg.references
  })) as Message[]
}

export async function sendMessage(chatId: string, content: string): Promise<Message> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Create message
  const { data: message, error } = await supabase
    .from('messages')
    .insert({
      chat_id: chatId,
      content,
      sender_id: user.id
    })
    .select(`
      *,
      sender:profiles (
        email,
        full_name
      )
    `)
    .single()

  if (error) throw error
  if (!message) throw new Error('Failed to create message')

  // Process message in background
  Promise.all([
    // Generate and store embedding
    EmbeddingService.generateAndStore(content, {
      messageId: message.id,
      chatId
    }),

    // Find similar messages
    AIService.findSimilarMessages(content, chatId)
      .then(async (similarMessages) => {
        if (similarMessages.length > 0) {
          // Generate AI response if needed
          const response = await AIService.generateResponse(
            content,
            similarMessages.map(m => m.content).join('\n')
          )
          // Handle response...
        }
      })
  ]).catch(console.error) // Handle background processing errors

  return message as Message
}

export function subscribeToMessages(
  chatId: string,
  callback: (payload: RealtimePostgresChangesPayload<Message>) => void
) {
  return supabase
    .channel(`messages:${chatId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${chatId}`
      },
      callback
    )
    .subscribe()
}

async function generateEmbedding(messageId: string, content: string) {
  const embedding = await EmbeddingService.generateEmbedding(content)
  
  const { error } = await supabase
    .from('messages')
    .update({ embedding })
    .eq('id', messageId)

  if (error) throw error
} 
