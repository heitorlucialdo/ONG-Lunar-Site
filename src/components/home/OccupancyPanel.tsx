import { Warehouse } from 'lucide-react'
import { ProgressBar } from '@/components/ui/Feedback'
import type { Ala, Setor } from '@/data/types'
import { cn } from '@/lib/cn'

export function OccupancyPanel({ alas, setores }: { alas: Ala[]; setores: Setor[] }) {
  if (alas.length === 0) {
    return <p className="text-sm text-muted">Nenhuma ala cadastrada nesta base.</p>
  }
  return (
    <div className="space-y-4">
      {alas.map((a) => {
        const pct = a.capacity ? Math.round((a.occupied / a.capacity) * 100) : 0
        const tone = pct >= 90 ? 'bg-danger' : pct >= 70 ? 'bg-warning' : 'bg-brand-600'
        const setor = setores.find((s) => s.id === a.setorId)
        return (
          <div key={a.id}>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
                <Warehouse className="h-4 w-4 text-muted" strokeWidth={2} />
                {a.name}
                {setor && <span className="text-xs font-normal text-faint">· {setor.name}</span>}
              </span>
              <span className={cn('text-sm font-bold', pct >= 90 ? 'text-danger' : 'text-ink')}>
                {a.occupied}/{a.capacity}
              </span>
            </div>
            <ProgressBar value={a.occupied} max={a.capacity} tone={tone} />
          </div>
        )
      })}
    </div>
  )
}
