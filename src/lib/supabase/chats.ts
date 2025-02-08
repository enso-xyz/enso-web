import { createBrowserClient } from "@supabase/ssr"
import type { Chat, ChatType, ChatParticipant, ChatWithDetails } from '@/types'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { generateChatName } from "../utils/chat-names"

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface Message {
  id: string
  chat_id: string
  content: string
  sender_id: string
  created_at: string
}

export async function getChat(chatId: string): Promise<ChatWithDetails | null> {
  const { data: chat, error } = await supabase
    .from('chats')
    .select(`
      *,
      chat_participants (
        user_id,
        joined_at,
        last_read_at,
        profiles (
          id,
          email,
          full_name,
          avatar_url
        )
      )
    `)
    .eq('id', chatId)
    .single()

  if (error) throw error
  if (!chat) return null

  // Type assertion after validation
  return chat as unknown as ChatWithDetails
}

export async function createChat(
  userIds: string[] = [], 
  type: ChatType = 'personal'
): Promise<Chat> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // For direct chats, get the other user's profile
  let title = ''
  if (type === 'direct' && userIds.length === 1) {
    const { data: otherUser } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', userIds[0])
      .single()

    if (otherUser) {
      const username = otherUser.email?.split('@')[0] || 'User'
      title = otherUser.full_name || username
    }
  }

  // Create chat
  const { data: chat, error } = await supabase
    .from('chats')
    .insert({
      type,
      title,
      created_by: user.id
    })
    .select()
    .single()

  if (error) throw error
  if (!chat) throw new Error('Failed to create chat')

  // Type assertion after validation
  return chat as unknown as Chat
}

export async function getChats(options: GetChatsOptions = {}) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('not authenticated')

  let query = supabase
    .from('chats')
    .select(`
      *,
      chat_participants (
        user_id,
        last_read_at,
        profiles (
          id,
          email,
          full_name,
          avatar_url
        )
      ),
      messages!left (
        content,
        sender_id,
        created_at
      )
    `)
    .eq('chat_participants.user_id', user.id)

  // Apply filters
  if (typeof options.archived === 'boolean') {
    query = query.eq('is_archived', options.archived)
  }
  if (options.type) {
    query = query.eq('type', options.type)
  }
  if (options.search) {
    query = query.ilike('title', `%${options.search}%`)
  }
  if (options.labels?.length) {
    query = query.contains('labels', options.labels)
  }

  // Order by pinned first, then most recent
  query = query.order('pinned', { ascending: false })
    .order('created_at', { ascending: false })

  const { data: chats, error } = await query

  if (error) throw error

  return (chats as unknown as ChatWithDetails[]).map(chat => {
    const participant = chat.chat_participants?.find((p: ChatParticipant) => p.user_id === user.id)
    const lastMessage = chat.messages?.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )?.[0]
    const hasUnread = lastMessage && participant?.last_read_at 
      ? new Date(lastMessage.created_at) > new Date(participant.last_read_at)
      : false

    return {
      ...chat,
      last_message: lastMessage,
      has_unread: hasUnread
    }
  })
}

export async function subscribeToChats(callback: (payload: RealtimePostgresChangesPayload<Chat>) => void) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return () => {}

  const subscription = supabase
    .channel('chats-and-messages')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'chats'
      },
      async (payload: RealtimePostgresChangesPayload<Chat>) => {
        if (payload.eventType === 'UPDATE') {
          // Get the chat participant info to check unread status
          const { data: participant } = await supabase
            .from('chat_participants')
            .select('last_read_at')
            .eq('chat_id', payload.new.id)
            .eq('user_id', user.id)
            .single()

          // If we have a last message and it's newer than our last read, mark as unread
          const hasUnread = payload.new.last_message && participant?.last_read_at
            ? new Date(payload.new.last_message.created_at) > new Date(participant.last_read_at)
            : false

          callback({
            ...payload,
            new: {
              ...payload.new,
              has_unread: hasUnread
            }
          })
        } else {
          callback(payload)
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      },
      async (payload: { new: Message }) => {
        // Skip if this is our own message
        if (payload.new.sender_id === user.id) return

        // When a new message is inserted, fetch the updated chat
        const { data: chat } = await supabase
          .from('chats')
          .select(`
            *,
            chat_participants!inner (
              user_id,
              last_read_at
            ),
            messages (
              content,
              sender_id,
              created_at
            )
          `)
          .eq('id', payload.new.chat_id)
          .single()

        if (chat) {
          const participant = chat.chat_participants?.find((p: ChatParticipant) => p.user_id === user.id)
          
          // Always mark as unread if it's a new message from someone else
          callback({
            eventType: 'UPDATE',
            new: {
              ...chat,
              has_unread: true,
              last_message: {
                content: payload.new.content,
                sender_id: payload.new.sender_id,
                created_at: payload.new.created_at
              }
            },
            old: chat
          } as any)
        }
      }
    )
    .subscribe()

  return () => {
    subscription.unsubscribe()
  }
}

export async function updateChatTitle(chatId: string, title: string) {
  const { error } = await supabase
    .from('chats')
    .update({ title })
    .eq('id', chatId)

  if (error) throw error
}

export async function updateChatReadStatus(chatId: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('chat_participants')
    .update({ last_read_at: new Date().toISOString() })
    .eq('chat_id', chatId)
    .eq('user_id', user.id)

  if (error) throw error
}

export async function archiveChat(chatId: string) {
  const { error } = await supabase
    .rpc('archive_chat', { chat_id: chatId })

  if (error) throw error
}

export async function unarchiveChat(chatId: string) {
  const { error } = await supabase
    .rpc('unarchive_chat', { chat_id: chatId })

  if (error) throw error
}

export async function toggleChatPin(chatId: string) {
  const { error } = await supabase
    .rpc('toggle_chat_pin', { chat_id: chatId })

  if (error) throw error
}

export async function updateChatLabels(chatId: string, labels: string[]) {
  const { error } = await supabase
    .rpc('update_chat_labels', { 
      chat_id: chatId,
      new_labels: labels
    })

  if (error) throw error
}

export async function deleteChat(chatId: string) {
  const { error } = await supabase
    .from('chats')
    .delete()
    .eq('id', chatId)

  if (error) throw error
}

// Update getChats to support filtering
export interface GetChatsOptions {
  archived?: boolean
  type?: ChatType
  search?: string
  labels?: string[]
}

export type { Chat, ChatType, ChatParticipant, ChatWithDetails } 