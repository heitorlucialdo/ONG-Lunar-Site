import { cn } from '@/lib/cn'

export interface TabItem {
  id: string
  label: string
  count?: number
}

export function Tabs({
  items,
  active,
  onChange,
  className,
}: {
  items: TabItem[]
  active: string
  onChange: (id: string) => void
  className?: string
}) {
  return (
    <div className={cn('no-scrollbar -mx-1 flex gap-1 overflow-x-auto border-b border-line', className)}>
      {items.map((t) => {
        const on = t.id === active
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={cn(
              'relative whitespace-nowrap px-3.5 py-3 text-sm font-semibold transition-colors',
              on ? 'text-brand-700' : 'text-muted hover:text-ink',
            )}
          >
            {t.label}
            {typeof t.count === 'number' && (
              <span className={cn('ml-1.5 rounded-full px-1.5 py-0.5 text-[11px] font-bold', on ? 'bg-brand-100 text-brand-700' : 'bg-surface-2 text-faint')}>
                {t.count}
              </span>
            )}
            {on && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brand-600" />}
          </button>
        )
      })}
    </div>
  )
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
  className?: string
}) {
  return (
    <div className={cn('inline-flex rounded-xl border border-line bg-surface-2 p-1', className)}>
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            'rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-all',
            value === o.value ? 'bg-surface text-ink shadow-card' : 'text-muted hover:text-ink',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
