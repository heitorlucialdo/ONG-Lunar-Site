import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, Check } from 'lucide-react'
import { useStore } from '@/services/store'
import { alertIconMeta } from '@/lib/alertMeta'
import { relativeFromNow } from '@/lib/format'
import { cn } from '@/lib/cn'

export function NotificationBell() {
  const { alerts, markAllAlertsRead, markAlertRead } = useStore()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const unread = alerts.filter((a) => !a.read).length

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl text-ink-2 transition-colors hover:bg-surface-2"
        aria-label="Notificações"
      >
        <Bell className="h-[20px] w-[20px]" strokeWidth={2} />
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white ring-2 ring-surface">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-50 w-[min(88vw,22rem)] overflow-hidden rounded-2xl border border-line bg-surface shadow-pop animate-scale-in">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <span className="text-sm font-bold text-ink">Alertas</span>
            {unread > 0 && (
              <button onClick={markAllAlertsRead} className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700">
                <Check className="h-3.5 w-3.5" /> Marcar todos
              </button>
            )}
          </div>
          <div className="max-h-[60vh] overflow-y-auto">
            {alerts.slice(0, 6).map((a) => {
              const m = alertIconMeta[a.type]
              const Icon = m.icon
              return (
                <button
                  key={a.id}
                  onClick={() => { markAlertRead(a.id); setOpen(false); if (a.petId) navigate(`/pets/${a.petId}`) }}
                  className={cn('flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-2', !a.read && 'bg-brand-50/40')}
                >
                  <span className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', m.soft)}>
                    <Icon className="h-4 w-4" strokeWidth={2.1} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-medium leading-snug text-ink">{a.message}</span>
                    <span className="mt-0.5 block text-xs text-faint">{relativeFromNow(a.date)}</span>
                  </span>
                  {!a.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />}
                </button>
              )
            })}
          </div>
          <Link to="/alertas" onClick={() => setOpen(false)} className="block border-t border-line px-4 py-3 text-center text-sm font-semibold text-brand-600 hover:bg-surface-2">
            Ver todos os alertas
          </Link>
        </div>
      )}
    </div>
  )
}
