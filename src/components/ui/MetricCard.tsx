import { ArrowDown, ArrowUp, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

export function MetricCard({
  icon: Icon,
  label,
  value,
  hint,
  trend,
  tone = 'brand',
  delay = 0,
}: {
  icon: LucideIcon
  label: string
  value: string | number
  hint?: string
  trend?: { dir: 'up' | 'down'; value: string; good?: boolean }
  tone?: 'brand' | 'warning' | 'danger' | 'success' | 'info'
  delay?: number
}) {
  const tones = {
    brand: 'bg-brand-50 text-brand-600',
    warning: 'bg-warning-soft text-warning',
    danger: 'bg-danger-soft text-danger',
    success: 'bg-success-soft text-success',
    info: 'bg-info-soft text-info',
  }
  return (
    <div className="card animate-fade-up p-4 sm:p-5" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-start justify-between">
        <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl', tones[tone])}>
          <Icon className="h-[19px] w-[19px]" strokeWidth={2.1} />
        </span>
        {trend && (
          <span className={cn('inline-flex items-center gap-0.5 text-xs font-bold', trend.good ?? trend.dir === 'up' ? 'text-success' : 'text-danger')}>
            {trend.dir === 'up' ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}
            {trend.value}
          </span>
        )}
      </div>
      <div className="mt-3.5">
        <div className="font-display text-[28px] font-extrabold leading-none text-ink">{value}</div>
        <div className="mt-1.5 text-[13px] font-medium text-muted">{label}</div>
        {hint && <div className="mt-0.5 text-xs text-faint">{hint}</div>}
      </div>
    </div>
  )
}
