import { Clock, GripVertical, MapPin } from 'lucide-react'
import { PetAvatar } from '@/components/pets/PetAvatar'
import { priorityMeta } from '@/lib/petMeta'
import { priorityLabel, speciesLabel, weight } from '@/lib/format'
import type { Pet, Tutor } from '@/data/types'
import { cn } from '@/lib/cn'

export function KanbanCard({
  pet,
  tutor,
  dragging,
  handleProps,
}: {
  pet: Pet
  tutor?: Tutor
  dragging?: boolean
  handleProps?: Record<string, unknown>
}) {
  const pending = pet.medications.find((m) => m.active)
  const pr = priorityMeta[pet.priority]
  const loc = [pet.location.canil, pet.location.box, pet.location.sala].filter(Boolean).join(' · ') || pet.location.setor

  return (
    <div
      className={cn(
        'group relative rounded-2xl border border-line bg-surface p-3.5 shadow-card transition-shadow',
        dragging ? 'rotate-1 shadow-pop ring-2 ring-brand-300' : 'hover:shadow-raise',
      )}
    >
      <span className={cn('absolute left-0 top-3 h-[calc(100%-1.5rem)] w-1 rounded-r-full', pr.bar)} />
      <div className="flex items-start gap-2.5 pl-1.5">
        <PetAvatar pet={pet} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-bold text-ink">{pet.name}</p>
            <button {...handleProps} className="ml-auto cursor-grab touch-none rounded-md p-0.5 text-faint opacity-0 transition-opacity hover:bg-surface-2 group-hover:opacity-100 active:cursor-grabbing" aria-label="Mover">
              <GripVertical className="h-4 w-4" />
            </button>
          </div>
          <p className="truncate text-xs text-muted">{pet.id} · {speciesLabel[pet.species]}</p>
        </div>
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-1.5 pl-1.5">
        <span className={cn('chip', pr.chip)} >{priorityLabel[pet.priority]}</span>
        <span className="chip bg-surface-2 text-ink-2">{weight(pet.weightKg)}</span>
      </div>

      {pending && (
        <div className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-info-soft px-2 py-1.5 pl-2.5 text-xs font-medium text-info-ink">
          <Clock className="h-3.5 w-3.5" /> {pending.name} · {pending.times[0]}
        </div>
      )}

      <div className="mt-2.5 flex items-center justify-between gap-2 pl-1.5 text-xs text-muted">
        <span className="inline-flex items-center gap-1 truncate"><MapPin className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{loc}</span></span>
        {tutor && <span className="truncate">{tutor.name.split(' ')[0]}</span>}
      </div>
    </div>
  )
}
