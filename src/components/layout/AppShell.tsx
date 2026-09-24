import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Menu, Plus, Search, X, MoreHorizontal } from 'lucide-react'
import { primaryNav, secondaryNav, mobileNav } from '@/lib/nav'
import { LunarWordmark } from '@/components/brand/LunarMark'
import { NotificationBell } from './NotificationBell'
import { CommandSearch } from './CommandSearch'
import { BaseSwitcher } from './BaseSwitcher'
import { usePetForm } from '@/components/pets/PetFormProvider'
import { useStore } from '@/services/store'
import { cn } from '@/lib/cn'

const roleLabel: Record<string, string> = {
  admin: 'Administrador', veterinario: 'Veterinária', recepcao: 'Recepção', enfermagem: 'Enfermagem',
}

function initials(name: string) {
  return name.replace(/^(Dra?\.|Enf\.|Recep\.|Aux\.)\s*/i, '').split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <nav className="flex flex-col gap-1">
        {primaryNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) => cn('nav-link', isActive && 'nav-link-active')}
          >
            <item.icon className="h-[19px] w-[19px] shrink-0" strokeWidth={2.1} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="my-3 h-px bg-line" />
      <nav className="flex flex-col gap-1">
        {secondaryNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) => cn('nav-link', isActive && 'nav-link-active')}
          >
            <item.icon className="h-[19px] w-[19px] shrink-0" strokeWidth={2.1} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </>
  )
}

function UserCard({ compact }: { compact?: boolean }) {
  const { user } = useStore()
  return (
    <div className={cn('flex items-center gap-3 rounded-xl border border-line bg-surface-2/60 p-2.5', compact && 'border-0 bg-transparent p-0')}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-[13px] font-bold text-white">
        {initials(user.name)}
      </div>
      <div className="min-w-0 leading-tight">
        <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
        <p className="truncate text-xs text-muted">{roleLabel[user.role]}</p>
      </div>
    </div>
  )
}

export function AppShell() {
  const { openCreate } = usePetForm()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMobileOpen(false)
    setMoreOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="min-h-dvh bg-canvas">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] flex-col border-r border-line bg-surface px-4 py-5 lg:flex">
        <div className="px-1">
          <LunarWordmark />
        </div>
        <div className="mt-7 flex-1 overflow-y-auto pr-0.5">
          <NavList />
        </div>
        <div className="pt-3">
          <UserCard />
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-fade-in" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[280px] flex-col bg-surface px-4 py-5 shadow-pop animate-slide-in-right">
            <div className="flex items-center justify-between px-1">
              <LunarWordmark />
              <button className="btn-ghost h-9 w-9 rounded-full" onClick={() => setMobileOpen(false)} aria-label="Fechar menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6 flex-1 overflow-y-auto">
              <NavList onNavigate={() => setMobileOpen(false)} />
            </div>
            <div className="pt-3"><UserCard /></div>
          </div>
        </div>
      )}

      {/* Main column */}
      <div className="lg:pl-[264px]">
        {/* Topbar */}
        <header className="sticky top-0 z-20 border-b border-line glass">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button className="btn-ghost h-10 w-10 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Abrir menu">
              <Menu className="h-5 w-5" />
            </button>
            <div className="lg:hidden"><LunarWordmark compact /></div>

            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="ml-auto flex h-10 items-center gap-2.5 rounded-xl border border-line bg-surface px-3 text-sm text-faint transition-colors hover:border-line-strong lg:ml-0 lg:mr-auto lg:w-full lg:max-w-md"
            >
              <Search className="h-[18px] w-[18px]" />
              <span className="hidden sm:inline">Buscar pet, tutor, código…</span>
              <kbd className="ml-auto hidden rounded-md border border-line bg-surface-2 px-1.5 py-0.5 text-[11px] font-semibold text-faint lg:inline">⌘K</kbd>
            </button>

            <BaseSwitcher />

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button onClick={openCreate} className="btn-primary h-10 px-3.5 sm:px-4">
                <Plus className="h-[18px] w-[18px]" strokeWidth={2.4} />
                <span className="hidden sm:inline">Cadastrar animal</span>
              </button>
              <NotificationBell />
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1360px] px-4 pb-28 pt-6 sm:px-6 lg:pb-10">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line glass lg:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="grid grid-cols-5">
          {mobileNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => cn('flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition-colors', isActive ? 'text-brand-600' : 'text-muted')}
            >
              <item.icon className="h-[21px] w-[21px]" strokeWidth={2.1} />
              {item.label}
            </NavLink>
          ))}
          <button onClick={() => setMoreOpen(true)} className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold text-muted">
            <MoreHorizontal className="h-[21px] w-[21px]" strokeWidth={2.1} />
            Mais
          </button>
        </div>
      </nav>

      {/* Mobile "more" sheet */}
      {moreOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-fade-in" onClick={() => setMoreOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-surface p-4 pb-8 shadow-pop animate-fade-up">
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-line-strong" />
            <div className="grid grid-cols-3 gap-2">
              {[...primaryNav, ...secondaryNav]
                .filter((n) => !mobileNav.some((m) => m.to === n.to))
                .map((item) => (
                  <NavLink key={item.to} to={item.to} onClick={() => setMoreOpen(false)} className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-surface-2/50 px-2 py-4 text-center text-xs font-semibold text-ink-2">
                    <item.icon className="h-5 w-5 text-brand-600" strokeWidth={2} />
                    {item.label}
                  </NavLink>
                ))}
            </div>
          </div>
        </div>
      )}

      <CommandSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}
