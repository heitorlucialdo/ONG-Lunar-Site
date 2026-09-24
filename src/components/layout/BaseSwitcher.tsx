import { Building2, TreePine } from 'lucide-react'
import { useStore } from '@/services/store'
import { useToast } from '@/components/ui/Toast'
import { baseLabel } from '@/lib/format'
import type { Base } from '@/data/types'
import { cn } from '@/lib/cn'

const items: { base: Base; label: string; icon: typeof Building2 }[] = [
  { base: 'ong', label: 'ONG Lunaar', icon: Building2 },
  { base: 'recanto', label: 'Recanto', icon: TreePine },
]

export function BaseSwitcher({ className }: { className?: string }) {
  const { base, setBase } = useStore()
  const toast = useToast()

  const change = (b: Base) => {
    if (b === base) return
    setBase(b)
    toast({ kind: 'info', title: 'Base alterada', message: `Exibindo registros de ${baseLabel[b]}.` })
  }

  return (
    <div className={cn('inline-flex rounded-xl border border-line bg-surface-2 p-1', className)} role="tablist" aria-label="Base de dados">
      {items.map((it) => {
        const on = it.base === base
        const Icon = it.icon
        return (
          <button
            key={it.base}
            role="tab"
            aria-selected={on}
            onClick={() => change(it.base)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-semibold transition-all',
              on ? 'bg-surface text-brand-700 shadow-card' : 'text-muted hover:text-ink',
            )}
          >
            <Icon className="h-4 w-4" strokeWidth={2.1} />
            <span className="hidden md:inline">{it.label}</span>
          </button>
        )
      })}
    </div>
  )
}
