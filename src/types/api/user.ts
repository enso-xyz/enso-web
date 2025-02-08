export interface User {
  id: string
  email: string
  full_name?: string | null
  avatar_url?: string | null
  created_at?: string
  last_seen_at?: string
  settings?: UserSettings
}

export interface UserSettings {
  theme?: 'light' | 'dark' | 'system'
  notifications?: {
    email?: boolean
    push?: boolean
    mentions?: boolean
  }
  shortcuts?: {
    [key: string]: string[]
  }
}

export interface UserProfile extends User {
  joined_at?: string
  status?: 'online' | 'offline' | 'away'
  bio?: string
} 