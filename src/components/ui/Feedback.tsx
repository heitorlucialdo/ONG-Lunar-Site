import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center rounded-2xl border border-dashed border-line-strong bg-surface-2/40 px-6 py-14 text-center', className)}>
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <Icon className="h-7 w-7" strokeWidth={1.8} />
      </div>
      <h3 className="text-base font-bold text-ink">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton rounded-xl', className)} />
}

export function ProgressBar({ value, max = 100, tone = 'bg-brand-600', className }: { value: number; max?: number; tone?: string; className?: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-line', className)}>
      <div className={cn('h-full rounded-full transition-[width] duration-700 ease-out', tone)} style={{ width: `${pct}%` }} />
    </div>
  )
}
