import { Link, useRouteContext, useRouter } from '@tanstack/react-router'
import ThemeToggle from './ThemeToggle'
import { signOut } from '../lib/auth'

export default function Header() {
  const { user } = useRouteContext({ from: '__root__' })
  const router = useRouter()

  async function handleSignOut() {
    await signOut()
    await router.invalidate()
    await router.navigate({ to: '/' })
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 backdrop-blur-lg">
      <nav className="page-wrap flex flex-wrap items-center gap-x-3 gap-y-2 py-3 sm:py-4">
        <h2 className="m-0 flex-shrink-0 text-base font-semibold tracking-tight">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm text-[var(--sea-ink)] no-underline shadow-[0_8px_24px_rgba(30,90,72,0.08)] sm:px-4 sm:py-2"
          >
            <span className="h-2 w-2 rounded-full bg-[linear-gradient(90deg,#56c6be,#7ed3bf)]" />
            My App
          </Link>
        </h2>

        <div className="order-3 flex w-full flex-wrap items-center gap-x-4 gap-y-1 pb-1 text-sm font-semibold sm:order-none sm:w-auto sm:flex-nowrap sm:pb-0">
          <Link
            to="/"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            Home
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />

          {user ? (
            <>
              <span className="hidden text-sm text-[var(--sea-ink-soft)] sm:inline">
                {user.email}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className="nav-link text-sm font-semibold"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-link text-sm font-semibold">
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
