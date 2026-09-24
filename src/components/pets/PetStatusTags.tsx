import { Activity, HeartPulse, Pill, ScissorsSquare, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { porteLabel, temperamentoLabel } from '@/lib/format'
import type { Pet } from '@/data/types'

/** Tags visuais de situação do animal (castrado, vacinado, em medicação, dor). */
export function PetStatusTags({ pet, compact }: { pet: Pet; compact?: boolean }) {
  const vacinadoEmDia = pet.vaccines.length > 0 && pet.vaccines.every((v) => v.status === 'em-dia')
  const emMedicacao = pet.medications.some((m) => m.active)
  const comDor = !!pet.relatoDores

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {pet.castrado ? (
        <Badge className="bg-success-soft text-success-ink"><ScissorsSquare className="h-3.5 w-3.5" />Castrado</Badge>
      ) : (
        !compact && <Badge className="bg-surface-2 text-muted"><ScissorsSquare className="h-3.5 w-3.5" />Não castrado</Badge>
      )}
      {vacinadoEmDia && <Badge className="bg-success-soft text-success-ink"><ShieldCheck className="h-3.5 w-3.5" />Vacinado</Badge>}
      {emMedicacao && <Badge className="bg-info-soft text-info-ink"><Pill className="h-3.5 w-3.5" />Em medicação</Badge>}
      {comDor && <Badge className="bg-warning-soft text-warning-ink"><HeartPulse className="h-3.5 w-3.5" />Com dor</Badge>}
      {!compact && <Badge className="bg-brand-50 text-brand-700"><Activity className="h-3.5 w-3.5" />{temperamentoLabel[pet.temperamento]}</Badge>}
    </div>
  )
}

export function PorteBadge({ porte }: { porte: Pet['porte'] }) {
  return (
    <span className="inline-flex h-6 items-center gap-1 rounded-full bg-surface-2 px-2 text-xs font-bold text-ink-2" title={porteLabel[porte]}>
      <span className="flex h-4 w-4 items-center justify-center rounded bg-brand-600 text-[10px] font-extrabold text-white">{porte}</span>
      {porteLabel[porte]}
    </span>
  )
}
