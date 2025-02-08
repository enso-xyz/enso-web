"use client"

import { useState, useEffect } from "react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { AIService } from "@/lib/ai/services"

interface ChatContext {
  summary: {
    title: string
    description: string
    keyPhrases: string[]
  }
  topics: Array<{
    id: string
    title: string
    count: number
    relevance: number
  }>
  files: Array<{
    id: string
    name: string
    type: string
    lastModified: string
    relevance: number
  }>
  participants: Array<{
    id: string
    name: string
    email: string
    avatar?: string
    lastActive?: string
    contributions?: number
  }>
  isLoading: boolean
  error: Error | null
}

export function useChatContext(chatId: string): ChatContext {
  const [context, setContext] = useState<ChatContext>({
    summary: {
      title: "",
      description: "",
      keyPhrases: []
    },
    topics: [],
    files: [],
    participants: [],
    isLoading: true,
    error: null
  })

  useEffect(() => {
    let isMounted = true

    const fetchContext = async () => {
      try {
        const supabase = getSupabaseClient()
        
        // Get chat data
        const { data: chat } = await supabase
          .from('chats')
          .select(`
            *,
            messages: messages (
              *
            ),
            chat_participants: chat_participants (
              *,
              profiles: profiles (
                *
              )
            )
          `)
          .eq('id', chatId)
          .single()

        // Get messages content for analysis
        const messagesContent = (chat?.messages as unknown as Array<{
          content: string
          created_at: string
          sender_id: string
          chat_id: string
          id: string
        }> || []).map(m => m.content).join('\n')

        // Analyze chat context
        const analysis = await AIService.analyzeMessage(messagesContent, {
          recentMessages: [],
          threadContext: chatId
        })

        // Get files
        const { data: files } = await supabase
          .from('files')
          .select('*')
          .eq('chat_id', chatId)

        if (isMounted) {
          setContext(prev => ({
            ...prev,
            summary: {
              title: chat?.title as string || '',
              description: analysis?.summary || '',
              keyPhrases: analysis?.topics || []
            },
            topics: analysis?.topics?.map((topic, i) => ({
              id: `topic-${i}`,
              title: topic,
              count: 0,
              relevance: 0.8
            })) || [],
            files: (files || []).map(file => ({
              id: String(file.id),
              name: String(file.name),
              type: String(file.type),
              lastModified: String(file.updated_at),
              relevance: Number(file.relevance) || 0
            })),
            participants: (chat?.chat_participants as unknown as Array<{
              user_id: string
              joined_at: string
              last_read_at: string
              profiles: {
                id: string
                email: string
                full_name?: string | null
                avatar_url?: string | null
              }
            }> || []).map(p => ({
              id: p.user_id,
              name: p.profiles?.full_name || p.profiles?.email?.split('@')[0] || 'Unknown',
              email: p.profiles?.email || '',
              avatar: p.profiles?.avatar_url,
              lastActive: p.last_read_at,
              contributions: 0
            })),
            isLoading: false,
            error: null
          }))
        }
      } catch (error) {
        console.error('Error fetching chat context:', error)
        if (isMounted) {
          setContext(prev => ({
            ...prev,
            isLoading: false,
            error: error as Error
          }))
        }
      }
    }

    fetchContext()

    return () => {
      isMounted = false
    }
  }, [chatId])

  return context
} 