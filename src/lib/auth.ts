import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from './supabase/server'

export type AuthUser = { id: string; email: string } | null

type Credentials = { email: string; password: string }

function validateCredentials(data: unknown): Credentials {
  const { email, password } = (data ?? {}) as Partial<Credentials>
  if (typeof email !== 'string' || !email.includes('@')) {
    throw new Error('A valid email is required')
  }
  if (typeof password !== 'string' || password.length < 6) {
    throw new Error('Password must be at least 6 characters')
  }
  return { email, password }
}

export const fetchUser = createServerFn({ method: 'GET' }).handler(
  async (): Promise<AuthUser> => {
    const supabase = getSupabaseServerClient()
    const { data } = await supabase.auth.getUser()
    if (!data.user?.email) return null
    return { id: data.user.id, email: data.user.email }
  },
)

export const signIn = createServerFn({ method: 'POST' })
  .validator(validateCredentials)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.auth.signInWithPassword(data)
    if (error) return { error: error.message }
    return { error: null }
  })

export const signUp = createServerFn({ method: 'POST' })
  .validator(validateCredentials)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const { data: result, error } = await supabase.auth.signUp(data)
    if (error) return { error: error.message, needsConfirmation: false }
    // With email confirmation on (Supabase default), no session is returned yet.
    return { error: null, needsConfirmation: !result.session }
  })

export const signOut = createServerFn({ method: 'POST' }).handler(async () => {
  const supabase = getSupabaseServerClient()
  await supabase.auth.signOut()
})
