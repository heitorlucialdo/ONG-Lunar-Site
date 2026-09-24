import {
  ArrowRightLeft, Calendar, ClipboardList, FileText, LogOut, Pill, Scale, Stethoscope, Syringe, UserPlus,
  type LucideIcon,
} from 'lucide-react'
import type { TimelineType } from '@/data/types'
import { cn } from '@/lib/cn'

export const timelineMeta: Record<TimelineType, { icon: LucideIcon; tone: string }> = {
  consulta: { icon: Stethoscope, tone: 'bg-brand-50 text-brand-600' },
  medicamento: { icon: Pill, tone: 'bg-info-soft text-info' },
  transferencia: { icon: ArrowRightLeft, tone: 'bg-indigo-50 text-indigo-600' },
  peso: { icon: Scale, tone: 'bg-brand-50 text-brand-600' },
  vacina: { icon: Syringe, tone: 'bg-warning-soft text-warning' },
  exame: { icon: FileText, tone: 'bg-teal-50 text-teal-600' },
  internacao: { icon: ClipboardList, tone: 'bg-warning-soft text-warning' },
  alta: { icon: LogOut, tone: 'bg-success-soft text-success' },
  cadastro: { icon: UserPlus, tone: 'bg-surface-2 text-muted' },
}

export interface TimelineRow {
  id: string
  type: TimelineType
  title: string
  description?: string
  when: string
  meta?: string
}

export function Timeline({ rows }: { rows: TimelineRow[] }) {
  return (
    <ol className="relative space-y-4">
      <span className="absolute bottom-2 left-[19px] top-2 w-px bg-line" aria-hidden />
      {rows.map((r) => {
        const m = timelineMeta[r.type]
        const Icon = m.icon
        return (
          <li key={r.id} className="relative flex gap-4">
            <span className={cn('relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-4 ring-surface', m.tone)}>
              <Icon className="h-[18px] w-[18px]" strokeWidth={2.1} />
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p className="text-sm font-semibold text-ink">{r.title}</p>
                <span className="text-xs text-faint">{r.when}</span>
              </div>
              {r.description && <p className="mt-0.5 text-[13px] text-muted">{r.description}</p>}
              {r.meta && <span className="mt-1 inline-block text-xs font-medium text-brand-600">{r.meta}</span>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
