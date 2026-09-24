import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Clock, Pill } from 'lucide-react'
import { useStore } from '@/services/store'
import { PageHeader } from '@/components/layout/PageHeader'
import { PetAvatar } from '@/components/pets/PetAvatar'
import { EmptyState, Skeleton } from '@/components/ui/Feedback'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/cn'
import type { Pet } from '@/data/types'

interface Dose {
  key: string
  time: string
  medName: string
  dose: string
  pet: Pet
}

const nowHM = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes() }
const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m }

export function Medications() {
  const { pets, loading } = useStore()
  const toast = useToast()
  const [done, setDone] = useState<Set<string>>(new Set())

  const doses = useMemo<Dose[]>(() => {
    const list: Dose[] = []
    pets.forEach((p) => p.medications.filter((m) => m.active).forEach((m) =>
      m.times.forEach((t) => list.push({ key: `${p.id}:${m.id}:${t}`, time: t, medName: m.name, dose: m.dose, pet: p })),
    ))
    return list.sort((a, b) => a.time.localeCompare(b.time))
  }, [pets])

  const now = nowHM()
  const statusOf = (d: Dose): 'administrado' | 'pendente' | 'atrasado' => {
    if (done.has(d.key)) return 'administrado'
    return toMin(d.time) < now ? 'atrasado' : 'pendente'
  }

  const counts = doses.reduce(
    (acc, d) => { acc[statusOf(d)] += 1; return acc },
    { administrado: 0, pendente: 0, atrasado: 0 } as Record<string, number>,
  )

  const mark = (d: Dose) => {
    setDone((prev) => {
      const next = new Set(prev)
      if (next.has(d.key)) next.delete(d.key)
      else { next.add(d.key); toast({ kind: 'success', title: 'Dose administrada', message: `${d.medName} · ${d.pet.name}` }) }
      return next
    })
  }

  if (loading) return <div className="space-y-4"><Skeleton className="h-24" /><Skeleton className="h-96" /></div>

  return (
    <div>
      <PageHeader title="Medicamentos" subtitle="Agenda de administração e controle de medicações ativas." />

      <div className="mb-5 grid grid-cols-3 gap-3">
        <StatPill label="Pendentes" value={counts.pendente} tone="bg-info-soft text-info-ink" />
        <StatPill label="Administrados" value={counts.administrado} tone="bg-success-soft text-success-ink" />
        <StatPill label="Atrasados" value={counts.atrasado} tone="bg-danger-soft text-danger-ink" />
      </div>

      {doses.length === 0 ? (
        <EmptyState icon={Pill} title="Nenhuma medicação ativa" description="Não há doses agendadas para os animais desta base." />
      ) : (
        <section className="card overflow-hidden">
          <div className="border-b border-line px-5 py-4">
            <h2 className="flex items-center gap-2 text-base font-bold text-ink"><Clock className="h-[18px] w-[18px] text-brand-600" /> Agenda de doses de hoje</h2>
          </div>
          <ul className="divide-y divide-line">
            {doses.map((d) => {
              const st = statusOf(d)
              return (
                <li key={d.key} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="w-14 shrink-0 text-center font-display text-lg font-bold text-ink">{d.time}</div>
                  <Link to={`/pets/${d.pet.id}`}><PetAvatar pet={d.pet} size="sm" /></Link>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{d.medName}</p>
                    <p className="truncate text-xs text-muted">{d.dose} · {d.pet.name} · {d.pet.location.setor}</p>
                  </div>
                  <span className={cn('chip', st === 'administrado' ? 'bg-success-soft text-success-ink' : st === 'atrasado' ? 'bg-danger-soft text-danger-ink' : 'bg-info-soft text-info-ink')}>
                    {st === 'administrado' ? 'Administrado' : st === 'atrasado' ? 'Atrasado' : 'Pendente'}
                  </span>
                  <button
                    onClick={() => mark(d)}
                    className={cn('btn h-9 w-9 rounded-lg', st === 'administrado' ? 'bg-success text-white' : 'btn-outline')}
                    aria-label={st === 'administrado' ? 'Desmarcar' : 'Marcar como administrado'}
                  >
                    <Check className="h-4 w-4" strokeWidth={2.6} />
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </div>
  )
}

function StatPill({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="card flex items-center gap-3 p-4">
      <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl text-lg font-extrabold', tone)}>{value}</span>
      <span className="text-sm font-semibold text-ink-2">{label}</span>
    </div>
  )
}
