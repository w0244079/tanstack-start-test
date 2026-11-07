import { useState } from 'react'
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { signIn, signUp } from '#/lib/auth'

export const Route = createFileRoute('/login')({
  beforeLoad: ({ context }) => {
    if (context.user) throw redirect({ to: '/' })
  },
  component: LoginPage,
})

function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [message, setMessage] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const data = {
      email: String(form.get('email') ?? ''),
      password: String(form.get('password') ?? ''),
    }
    setPending(true)
    setMessage(null)
    try {
      if (mode === 'signin') {
        const res = await signIn({ data })
        if (res.error) return setMessage(res.error)
      } else {
        const res = await signUp({ data })
        if (res.error) return setMessage(res.error)
        if (res.needsConfirmation) {
          return setMessage('Check your email to confirm your account.')
        }
      }
      await router.invalidate()
      await router.navigate({ to: '/' })
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="page-wrap px-4 py-12">
      <div className="mx-auto max-w-sm">
        <h1 className="mb-6 text-2xl font-semibold">
          {mode === 'signin' ? 'Sign in' : 'Create an account'}
        </h1>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="rounded-lg border border-[var(--line)] bg-transparent px-3 py-2"
          />
          <input
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete={
              mode === 'signin' ? 'current-password' : 'new-password'
            }
            placeholder="Password"
            className="rounded-lg border border-[var(--line)] bg-transparent px-3 py-2"
          />
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-[var(--sea-ink)] px-3 py-2 font-semibold text-white disabled:opacity-60"
          >
            {pending ? '…' : mode === 'signin' ? 'Sign in' : 'Sign up'}
          </button>
        </form>
        {message && <p className="mt-4 text-sm">{message}</p>}
        <button
          type="button"
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin')
            setMessage(null)
          }}
          className="mt-6 text-sm underline"
        >
          {mode === 'signin'
            ? "Don't have an account? Sign up"
            : 'Already have an account? Sign in'}
        </button>
      </div>
    </main>
  )
}
