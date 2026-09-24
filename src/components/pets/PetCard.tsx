import { Link } from 'react-router-dom'
import { MapPin, Scale, ChevronRight } from 'lucide-react'
import { PetAvatar } from './PetAvatar'
import { StatusBadge, PriorityBadge } from './PetBadges'
import { PetStatusTags, PorteBadge } from './PetStatusTags'
import type { Pet, Tutor } from '@/data/types'
import { speciesLabel, weight } from '@/lib/format'

export function PetCard({ pet, tutor, delay = 0 }: { pet: Pet; tutor?: Tutor; delay?: number }) {
  const loc = [pet.location.setor, pet.location.canil, pet.location.box, pet.location.sala].filter(Boolean).join(' · ')
  return (
    <Link
      to={`/pets/${pet.id}`}
      className="group card animate-fade-up p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-raise"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start gap-3">
        <PetAvatar pet={pet} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-[15px] font-bold text-ink">{pet.name}</h3>
            <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-brand-500" />
          </div>
          <p className="truncate text-xs text-muted">{pet.id}</p>
          <p className="mt-0.5 truncate text-[13px] text-ink-2">{speciesLabel[pet.species]} · {pet.breed}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <StatusBadge status={pet.status} />
        {(pet.priority === 'alta' || pet.priority === 'critica') && <PriorityBadge priority={pet.priority} />}
      </div>
      <div className="mt-2">
        <PetStatusTags pet={pet} compact />
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-line pt-3 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5"><Scale className="h-3.5 w-3.5" /> {weight(pet.weightKg)} · {pet.porte}</span>
        <span className="inline-flex items-center gap-1.5 truncate"><MapPin className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">{loc}</span></span>
      </div>
      {tutor && <p className="mt-2 truncate text-xs text-faint">Tutor: {tutor.name}</p>}
    </Link>
  )
}
