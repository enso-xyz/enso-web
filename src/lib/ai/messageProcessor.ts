import { AIService } from "./services"
import { getSupabaseClient } from "../supabase/client"

interface ProcessOptions {
  chatId: string
  content: string
  files?: File[]
  references?: Array<{
    type: string
    id: string
    metadata?: any
  }>
  contexts?: Array<{
    id: string
    type: string
    metadata?: any
  }>
}

export class MessageProcessor {
  async processMessage(options: ProcessOptions) {
    const { chatId, content, files = [], references = [], contexts = [] } = options
    const supabase = getSupabaseClient()

    try {
      // 1. Process any attached files
      const fileResults = await Promise.all(
        files.map(async (file) => {
          const result = await AIService.processFile(file)
          return result
        })
      )

      // 2. Analyze message content
      const analysis = await AIService.analyzeMessage(content, {
        recentMessages: [], // TODO: Get from chat history
        attachedFiles: files,
        threadContext: contexts.map(c => c.id).join(",")
      })

      // 3. Find similar content
      const similar = await AIService.findSimilarContent(analysis.embedding, {
        includedChats: [chatId]
      })

      // 4. Store message with all metadata
      const { data: message, error } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          content,
          embedding: analysis.embedding,
          metadata: {
            analysis,
            files: fileResults,
            references,
            contexts,
            similar: similar.messages.map(m => m.id)
          }
        })
        .select()
        .single()

      if (error) throw error

      return {
        message,
        analysis,
        similar,
        files: fileResults
      }
    } catch (error) {
      console.error('Error processing message:', error)
      throw error
    }
  }
} 
