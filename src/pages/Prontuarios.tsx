import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, Search } from 'lucide-react'
import { useStore } from '@/services/store'
import { PageHeader } from '@/components/layout/PageHeader'
import { PetAvatar } from '@/components/pets/PetAvatar'
import { Input } from '@/components/ui/Field'
import { EmptyState, Skeleton } from '@/components/ui/Feedback'
import { formatDate } from '@/lib/format'
import type { MedicalRecord, Pet } from '@/data/types'

export function Prontuarios() {
  const { pets, loading } = useStore()
  const [q, setQ] = useState('')

  const records = useMemo(() => {
    const all: { pet: Pet; record: MedicalRecord }[] = []
    pets.forEach((p) => p.records.forEach((r) => all.push({ pet: p, record: r })))
    const term = q.trim().toLowerCase()
    return all
      .filter(({ pet, record }) =>
        !term || [pet.name, pet.id, record.complaint, record.diagnosis, record.vet].filter(Boolean).join(' ').toLowerCase().includes(term),
      )
      .sort((a, b) => b.record.date.localeCompare(a.record.date))
  }, [pets, q])

  if (loading) return <div className="space-y-4"><Skeleton className="h-14" /><Skeleton className="h-96" /></div>

  return (
    <div>
      <PageHeader title="Prontuários" subtitle="Registros clínicos dos animais acolhidos, do mais recente ao mais antigo." />

      <div className="relative mb-5 max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-faint" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por animal, diagnóstico ou responsável…" className="pl-11" />
      </div>

      {records.length === 0 ? (
        <EmptyState icon={ClipboardList} title="Nenhum prontuário" description="Registros clínicos aparecem aqui. Abra um animal e registre uma consulta." />
      ) : (
        <div className="space-y-3">
          {records.map(({ pet, record }) => (
            <Link key={`${pet.id}-${record.id}`} to={`/pets/${pet.id}`} className="card block p-4 transition-shadow hover:shadow-raise">
              <div className="flex items-start gap-3">
                <PetAvatar pet={pet} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-ink">{pet.name} <span className="font-mono text-xs font-normal text-muted">{pet.id}</span></p>
                    <span className="text-xs text-muted">{formatDate(record.date)}</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-ink-2">{record.diagnosis || record.complaint}</p>
                  <p className="mt-0.5 text-sm text-muted"><span className="text-faint">Queixa:</span> {record.complaint}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                    {record.temperature && <span>{record.temperature.toLocaleString('pt-BR')} °C</span>}
                    {record.heartRate && <span>{record.heartRate} bpm</span>}
                    {record.respRate && <span>{record.respRate} rpm</span>}
                    <span className="ml-auto font-semibold text-ink-2">{record.vet}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
