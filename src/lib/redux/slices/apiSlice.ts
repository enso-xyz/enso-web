import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { supabase } from '@/lib/supabase/client'
import type { Chat } from '@/types/api/chat'
import type { Message } from '@/types/api/message'
import { User } from '@supabase/supabase-js'

export const apiSlice = createApi({
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Chat', 'User'],
  endpoints: (builder) => ({
    getChats: builder.query<Chat[], void>({
      queryFn: async () => {
        try {
          const { data, error } = await supabase
            .from('chats')
            .select('*')
            .order('updatedAt', { ascending: false })

          if (error) throw error
          return { data: data as unknown as Chat[] }
        } catch (error) {
          return { error: error as Error }
        }
      },
      providesTags: ['Chat'],
    }),

    getChatById: builder.query<Chat, string>({
      queryFn: async (chatId) => {
        try {
          const { data, error } = await supabase
            .from('chats')
            .select('*')
            .eq('id', chatId)
            .single()

          if (error) throw error
          return { data: data as unknown as Chat }
        } catch (error) {
          return { error: error as Error }
        }
      },
      providesTags: (_result, _error, id) => [{ type: 'Chat', id }],
    }),

    createChat: builder.mutation<Chat, Partial<Chat>>({
      queryFn: async (chat) => {
        try {
          const { data, error } = await supabase
            .from('chats')
            .insert([chat])
            .select()
            .single()

          if (error) throw error
          return { data: data as unknown as Chat }
        } catch (error) {
          return { error: error as Error }
        }
      },
      invalidatesTags: ['Chat'],
    }),

    updateChat: builder.mutation<Chat, { id: string; chat: Partial<Chat> }>({
      queryFn: async ({ id, chat }) => {
        try {
          const { data, error } = await supabase
            .from('chats')
            .update(chat)
            .eq('id', id)
            .select()
            .single()

          if (error) throw error
          return { data: data as unknown as Chat }
        } catch (error) {
          return { error: error as Error }
        }
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Chat', id }],
    }),

    deleteChat: builder.mutation<void, string>({
      queryFn: async (id) => {
        try {
          const { error } = await supabase
            .from('chats')
            .delete()
            .eq('id', id)

          if (error) throw error
          return { data: undefined }
        } catch (error) {
          return { error: error as Error }
        }
      },
      invalidatesTags: ['Chat'],
    }),

    getProfile: builder.query<User, void>({
      queryFn: async () => {
        try {
          const { data: { user }, error } = await supabase.auth.getUser()
          if (error) throw error
          return { data: user }
        } catch (error) {
          return { error: error as Error }
        }
      },
      providesTags: ['User'],
    }),

    generateResponse: builder.mutation<Message, { chatId: string; message: string }>({
      queryFn: async ({ chatId, message }) => {
        try {
          const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chatId, message }),
          })
          
          if (!response.ok) throw new Error('Failed to generate response')
          const data = await response.json()
          return { data }
        } catch (error) {
          return { error: error as Error }
        }
      },
      invalidatesTags: (_result, _error, { chatId }) => [{ type: 'Chat', id: chatId }],
    }),
  }),
})

export const {
  useGetChatsQuery,
  useGetChatByIdQuery,
  useCreateChatMutation,
  useUpdateChatMutation,
  useDeleteChatMutation,
  useGetProfileQuery,
  useGenerateResponseMutation,
} = apiSlice 