import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { Chat, ChatType, ChatFilterType, Message, Context, ContextAnalysis, KnowledgeGraph, Suggestion } from '@/types'

export interface ChatState {
  data: (Chat & { has_unread?: boolean })[]
  loading: boolean
  error: string | null
  currentChat: Chat | null
  filters: {
    search: string
    type: ChatFilterType
    showArchived: boolean
  }
  context: {
    activeContexts: Context[]
    suggestions: Context[]
    currentAnalysis?: ContextAnalysis 
    knowledgeGraph?: KnowledgeGraph
  }
}

const initialState: ChatState = {
  data: [],
  loading: false,
  error: null,
  currentChat: null,
  filters: {
    search: '',
    type: 'all',
    showArchived: false
  },
  context: {
    activeContexts: [],
    suggestions: [],
    currentAnalysis: undefined,
    knowledgeGraph: undefined
  }
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<(Chat & { has_unread?: boolean })[]>) => {
      state.data = action.payload
      state.loading = false
      state.error = null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.loading = false
    },
    updateChat: (state, action: PayloadAction<Partial<Chat> & { id: string; has_unread?: boolean }>) => {
      const index = state.data.findIndex(chat => chat.id === action.payload.id)
      if (index !== -1) {
        state.data[index] = {
          ...state.data[index],
          ...action.payload,
          has_unread: action.payload.has_unread ?? state.data[index].has_unread
        }
      }
    },
    addChat: (state, action: PayloadAction<Chat>) => {
      state.data.unshift(action.payload)
    },
    removeChat: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter(chat => chat.id !== action.payload)
    },
    setCurrentChat: (state, action: PayloadAction<string | null>) => {
      state.currentChat = action.payload ? state.data.find(chat => chat.id === action.payload) || null : null
    },
    markChatAsRead: (state, action: PayloadAction<string>) => {
      const index = state.data.findIndex(chat => chat.id === action.payload)
      if (index !== -1) {
        state.data[index].has_unread = false
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload
    },
    setFilterType: (state, action: PayloadAction<ChatFilterType>) => {
      state.filters.type = action.payload
      // Reset archived view when switching types
      if (action.payload !== 'archived') {
        state.filters.showArchived = false
      }
    },
    toggleArchivedView: (state) => {
      state.filters.showArchived = !state.filters.showArchived
    },
    setActiveContexts: (state, action: PayloadAction<Context[]>) => {
      state.context.activeContexts = action.payload
    },
    updateKnowledgeGraph: (state, action: PayloadAction<KnowledgeGraph>) => {
      state.context.knowledgeGraph = action.payload
    },
    setContextSuggestions: (state, action: PayloadAction<Context[]>) => {
      state.context.suggestions = action.payload
    },
    setContextAnalysis: (state, action: PayloadAction<ContextAnalysis>) => {
      state.context.currentAnalysis = action.payload
    },
    removeContext: (state, action: PayloadAction<string>) => {
      state.context.activeContexts = state.context.activeContexts.filter(
        ctx => ctx.id !== action.payload
      )
    }
  }
})

// Memoized Base Selectors
const selectChatsData = (state: { chat: ChatState }) => state.chat.data
const selectFilters = (state: { chat: ChatState }) => state.chat.filters
const selectContextState = (state: { chat: ChatState }) => state.chat.context

// Memoized Derived Selectors
export const selectFilteredChats = createSelector(
  [selectChatsData, selectFilters],
  (data, filters) => {
    return data.filter(chat => {
      // Filter by type
      if (filters.type === 'archived') {
        return chat.is_archived
      }

      // Don't show archived chats in other views
      if (chat.is_archived) {
        return false
      }

      if (filters.type !== 'all') {
        // Special handling for direct messages
        if (filters.type === 'direct') {
          return chat.type === 'direct' || (chat.type === 'group' && chat.chat_participants?.length === 2)
        }
        if (chat.type !== filters.type) {
          return false
        }
      }

      // Filter by search
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const titleMatch = chat.title?.toLowerCase().includes(searchLower)
        const lastMessageMatch = chat.last_message?.content.toLowerCase().includes(searchLower)
        const participantMatch = chat.chat_participants?.some(p => 
          p.profiles?.full_name?.toLowerCase().includes(searchLower) ||
          p.profiles?.email?.toLowerCase().includes(searchLower)
        )
        return titleMatch || lastMessageMatch || participantMatch
      }

      return true
    })
  }
)

export const selectPinnedChats = createSelector(
  [selectChatsData, selectFilters],
  (data, filters) => {
    return data.filter(chat => 
      chat.pinned
    )
  }
)

export const selectRecentChats = createSelector(
  [selectFilteredChats],
  (filteredChats) => filteredChats.filter(chat => !chat.pinned)
)

export const selectMessageReferences = createSelector(
  [selectContextState, (state: any, messageId: string) => messageId],
  (context, messageId) => context.activeContexts.filter(ctx => ctx.messageId === messageId)
)

export const {
  setChats,
  setLoading,
  setError,
  updateChat,
  addChat,
  removeChat,
  setCurrentChat,
  markChatAsRead,
  setSearchQuery,
  setFilterType,
  toggleArchivedView,
  setActiveContexts,
  updateKnowledgeGraph,
  setContextSuggestions,
  setContextAnalysis,
  removeContext
} = chatSlice.actions

export default chatSlice.reducer