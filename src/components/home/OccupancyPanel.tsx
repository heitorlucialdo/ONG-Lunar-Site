import { Warehouse } from 'lucide-react'
import { ProgressBar } from '@/components/ui/Feedback'
import type { Kennel } from '@/data/types'
import { cn } from '@/lib/cn'

export function OccupancyPanel({ kennels }: { kennels: Kennel[] }) {
  return (
    <div className="space-y-4">
      {kennels.map((k) => {
        const pct = Math.round((k.occupied / k.capacity) * 100)
        const tone = pct >= 90 ? 'bg-danger' : pct >= 70 ? 'bg-warning' : 'bg-brand-600'
        return (
          <div key={k.id}>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
                <Warehouse className="h-4 w-4 text-muted" strokeWidth={2} />
                {k.name}
                <span className="text-xs font-normal text-faint">· {k.sector}</span>
              </span>
              <span className={cn('text-sm font-bold', pct >= 90 ? 'text-danger' : 'text-ink')}>
                {k.occupied}/{k.capacity}
              </span>
            </div>
            <ProgressBar value={k.occupied} max={k.capacity} tone={tone} />
          </div>
        )
      })}
    </div>
  )
}
