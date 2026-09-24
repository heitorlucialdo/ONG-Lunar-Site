import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react'
import { cn } from '@/lib/cn'

type ToastKind = 'success' | 'info' | 'warning'
interface ToastItem {
  id: number
  kind: ToastKind
  title: string
  message?: string
}

const ToastContext = createContext<(t: Omit<ToastItem, 'id'>) => void>(() => {})
export const useToast = () => useContext(ToastContext)

const icons = { success: CheckCircle2, info: Info, warning: AlertTriangle }
const accents: Record<ToastKind, string> = {
  success: 'text-success',
  info: 'text-brand-600',
  warning: 'text-warning',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const push = useCallback((t: Omit<ToastItem, 'id'>) => {
    const id = Date.now() + Math.random()
    setItems((prev) => [...prev, { id, ...t }])
    setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== id)), 4200)
  }, [])

  const dismiss = (id: number) => setItems((prev) => prev.filter((i) => i.id !== id))

  return (
    <ToastContext.Provider value={push}>
      {children}
      {createPortal(
        <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2.5">
          {items.map((t) => {
            const Icon = icons[t.kind]
            return (
              <div key={t.id} className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-line bg-surface p-3.5 shadow-pop animate-slide-in-right">
                <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', accents[t.kind])} strokeWidth={2.2} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink">{t.title}</p>
                  {t.message && <p className="mt-0.5 text-[13px] text-muted">{t.message}</p>}
                </div>
                <button onClick={() => dismiss(t.id)} className="btn-ghost -mr-1 -mt-1 h-7 w-7 rounded-full" aria-label="Dispensar">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )
          })}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  )
}
