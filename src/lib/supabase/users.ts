import { createBrowserClient } from "@supabase/ssr"
import { User, UserProfile } from '@/types'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function searchUsers(query: string): Promise<User[]> {
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  if (!currentUser) throw new Error('Not authenticated')

  // Search by email or name
  const { data: users, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, avatar_url')
    .or(`email.ilike.%${query}%,full_name.ilike.%${query}%`)
    .neq('id', currentUser.id) // Exclude current user
    .limit(5)

  if (error) throw error
  if (!users) return []

  return users as User[]
}

export async function getChatParticipants(chatId: string): Promise<UserProfile[]> {
  const { data: participants, error } = await supabase
    .from('chat_participants')
    .select(`
      user_id,
      joined_at,
      profiles (
        id,
        email,
        full_name,
        avatar_url
      )
    `)
    .eq('chat_id', chatId)

  if (error) throw error
  if (!participants) return []

  return participants.map(p => ({
    id: p.profiles?.[0]?.id,
    email: p.profiles?.[0]?.email,
    full_name: p.profiles?.[0]?.full_name,
    avatar_url: p.profiles?.[0]?.avatar_url,
    joined_at: p.joined_at
  })) as UserProfile[]
} 