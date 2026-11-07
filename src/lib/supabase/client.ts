import { createBrowserClient } from '@supabase/ssr'

/**
 * Supabase client for browser-only code (e.g. realtime subscriptions, storage uploads).
 * Shares the same cookie-based session as the server client.
 */
export function getSupabaseBrowserClient() {
  return createBrowserClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  )
}
