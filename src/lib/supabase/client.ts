import { createBrowserClient } from '@supabase/ssr'
import { type CookieOptions } from '@supabase/ssr'

// Create a single supabase instance to be reused
let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            if (typeof document === 'undefined') return undefined
            const cookie = document.cookie
              .split('; ')
              .find((row) => row.startsWith(`${name}=`))
            return cookie ? cookie.split('=')[1] : undefined
          },
          set(name: string, value: string, options: CookieOptions) {
            if (typeof document === 'undefined') return
            let cookie = `${name}=${value}; path=/`
            if (options.maxAge) cookie += `; max-age=${options.maxAge}`
            if (options.domain) cookie += `; domain=${options.domain}`
            if (options.secure) cookie += '; secure'
            if (options.sameSite) cookie += `; samesite=${options.sameSite}`
            document.cookie = cookie
          },
          remove(name: string, options: CookieOptions) {
            if (typeof document === 'undefined') return
            document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
          },
        },
      }
    )
  }
  return supabaseInstance
}

// Export a singleton instance
export const supabase = getSupabaseClient() 