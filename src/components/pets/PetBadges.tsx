import { Badge } from '@/components/ui/Badge'
import { priorityMeta, speciesMeta, statusMeta } from '@/lib/petMeta'
import { clinicalStatusLabel, priorityLabel, speciesLabel } from '@/lib/format'
import type { ClinicalStatus, Priority, Species } from '@/data/types'

export function StatusBadge({ status }: { status: ClinicalStatus }) {
  const m = statusMeta[status]
  return <Badge className={m.chip} dot={m.dot}>{clinicalStatusLabel[status]}</Badge>
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const m = priorityMeta[priority]
  return <Badge className={m.chip} dot={m.dot}>{priorityLabel[priority]}</Badge>
}

export function SpeciesBadge({ species }: { species: Species }) {
  const m = speciesMeta[species]
  const Icon = m.icon
  return (
    <Badge className={m.soft}>
      <Icon className="h-3.5 w-3.5" strokeWidth={2.2} />
      {speciesLabel[species]}
    </Badge>
  )
}
