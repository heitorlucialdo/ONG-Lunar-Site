import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Syringe } from 'lucide-react'
import { useStore } from '@/services/store'
import { PageHeader } from '@/components/layout/PageHeader'
import { PetAvatar } from '@/components/pets/PetAvatar'
import { SegmentedControl } from '@/components/ui/Tabs'
import { EmptyState, Skeleton } from '@/components/ui/Feedback'
import { vaccineMeta } from '@/lib/petMeta'
import { formatDate, vaccineStatusLabel } from '@/lib/format'
import type { Pet, Vaccine, VaccineStatus } from '@/data/types'
import { cn } from '@/lib/cn'

type Filter = 'todas' | VaccineStatus

export function Vaccines() {
  const { pets, loading } = useStore()
  const [filter, setFilter] = useState<Filter>('todas')

  const rows = useMemo(() => {
    const all: { pet: Pet; vaccine: Vaccine }[] = []
    pets.forEach((p) => p.vaccines.forEach((v) => all.push({ pet: p, vaccine: v })))
    return all.sort((a, b) => (a.vaccine.nextDate ?? '9999').localeCompare(b.vaccine.nextDate ?? '9999'))
  }, [pets])

  const counts = rows.reduce(
    (acc, r) => { acc[r.vaccine.status] += 1; return acc },
    { 'em-dia': 0, proxima: 0, atrasada: 0 } as Record<VaccineStatus, number>,
  )

  const filtered = filter === 'todas' ? rows : rows.filter((r) => r.vaccine.status === filter)

  if (loading) return <div className="space-y-4"><Skeleton className="h-24" /><Skeleton className="h-96" /></div>

  return (
    <div>
      <PageHeader title="Vacinas" subtitle="Controle da carteira de vacinação dos animais acolhidos." />

      <div className="mb-5 grid grid-cols-3 gap-3">
        <Stat label="Em dia" value={counts['em-dia']} tone="bg-success-soft text-success-ink" />
        <Stat label="Próximas" value={counts.proxima} tone="bg-warning-soft text-warning-ink" />
        <Stat label="Atrasadas" value={counts.atrasada} tone="bg-danger-soft text-danger-ink" />
      </div>

      <div className="mb-4">
        <SegmentedControl
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'todas', label: 'Todas' },
            { value: 'em-dia', label: 'Em dia' },
            { value: 'proxima', label: 'Próximas' },
            { value: 'atrasada', label: 'Atrasadas' },
          ]}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Syringe} title="Nenhuma vacina" description="Não há registros de vacinação para este filtro." />
      ) : (
        <section className="card divide-y divide-line overflow-hidden">
          {filtered.map(({ pet, vaccine }) => (
            <div key={`${pet.id}-${vaccine.id}`} className="flex items-center gap-4 px-5 py-3.5">
              <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', vaccineMeta[vaccine.status].chip)}><Syringe className="h-5 w-5" /></span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{vaccine.name}</p>
                <p className="truncate text-xs text-muted">Aplicada em {formatDate(vaccine.date)} · {vaccine.responsible}</p>
              </div>
              <Link to={`/pets/${pet.id}`} className="hidden items-center gap-2 sm:flex">
                <PetAvatar pet={pet} size="sm" />
                <span className="text-sm font-medium text-ink-2">{pet.name}</span>
              </Link>
              <div className="hidden w-28 text-right text-xs text-muted md:block">
                <p className="font-semibold text-ink-2">Próxima</p>
                <p>{vaccine.nextDate ? formatDate(vaccine.nextDate) : '—'}</p>
              </div>
              <span className={cn('chip shrink-0', vaccineMeta[vaccine.status].chip)}>{vaccineStatusLabel[vaccine.status]}</span>
            </div>
          ))}
        </section>
      )}
    </div>
  )
}

function Stat({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="card flex items-center gap-3 p-4">
      <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl text-lg font-extrabold', tone)}>{value}</span>
      <span className="text-sm font-semibold text-ink-2">{label}</span>
    </div>
  )
}
