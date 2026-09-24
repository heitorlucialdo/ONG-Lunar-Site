import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowDownUp, Filter, LayoutGrid, List, MapPin, PawPrint, Plus, Search, X,
} from 'lucide-react'
import { useStore } from '@/services/store'
import { usePetForm } from '@/components/pets/PetFormProvider'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Field'
import { Popover } from '@/components/ui/Popover'
import { SegmentedControl } from '@/components/ui/Tabs'
import { EmptyState, Skeleton } from '@/components/ui/Feedback'
import { PetCard } from '@/components/pets/PetCard'
import { PetAvatar } from '@/components/pets/PetAvatar'
import { StatusBadge, PriorityBadge } from '@/components/pets/PetBadges'
import { clinicalStatusLabel, priorityLabel, speciesLabel, weight, formatDateShort } from '@/lib/format'
import type { ClinicalStatus, Priority, Sex, Species } from '@/data/types'
import { cn } from '@/lib/cn'

type SortKey = 'recent' | 'name' | 'weight' | 'priority'
const priorityRank: Record<Priority, number> = { critica: 0, alta: 1, normal: 2, baixa: 3 }

export function Pets() {
  const { pets, tutors, loading } = useStore()
  const { openCreate } = usePetForm()

  const [q, setQ] = useState('')
  const [view, setView] = useState<'cards' | 'table'>('cards')
  const [sort, setSort] = useState<SortKey>('recent')
  const [fSpecies, setFSpecies] = useState<Species | ''>('')
  const [fSex, setFSex] = useState<Sex | ''>('')
  const [fStatus, setFStatus] = useState<ClinicalStatus | ''>('')
  const [fPriority, setFPriority] = useState<Priority | ''>('')

  const activeFilters = [fSpecies, fSex, fStatus, fPriority].filter(Boolean).length
  const clearFilters = () => { setFSpecies(''); setFSex(''); setFStatus(''); setFPriority('') }

  const result = useMemo(() => {
    const term = q.trim().toLowerCase()
    let list = pets.filter((p) => {
      if (fSpecies && p.species !== fSpecies) return false
      if (fSex && p.sex !== fSex) return false
      if (fStatus && p.status !== fStatus) return false
      if (fPriority && p.priority !== fPriority) return false
      if (term) {
        const tutor = tutors.find((t) => t.id === p.tutorId)
        const hay = [p.name, p.id, p.breed, speciesLabel[p.species], tutor?.name].filter(Boolean).join(' ').toLowerCase()
        if (!hay.includes(term)) return false
      }
      return true
    })
    list = [...list].sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name)
      if (sort === 'weight') return b.weightKg - a.weightKg
      if (sort === 'priority') return priorityRank[a.priority] - priorityRank[b.priority]
      return b.createdAt.localeCompare(a.createdAt)
    })
    return list
  }, [pets, tutors, q, fSpecies, fSex, fStatus, fPriority, sort])

  return (
    <div>
      <PageHeader
        title="Animais"
        subtitle="Gerencie os animais acolhidos pela ONG Lunaar e pelo Recanto."
        actions={<Button icon={Plus} onClick={openCreate}>Cadastrar animal</Button>}
      />

      {/* Toolbar */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-faint" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome, código, raça ou tutor…" className="pl-11" />
        </div>
        <div className="flex items-center gap-2">
          <Popover
            align="end"
            trigger={({ toggle }) => (
              <button onClick={toggle} className={cn('btn-outline h-10 px-3.5', activeFilters > 0 && 'border-brand-300 bg-brand-50 text-brand-700')}>
                <Filter className="h-[18px] w-[18px]" />
                Filtros
                {activeFilters > 0 && <span className="ml-0.5 rounded-full bg-brand-600 px-1.5 text-[11px] font-bold text-white">{activeFilters}</span>}
              </button>
            )}
          >
            {(close) => (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-ink">Filtrar pets</span>
                  {activeFilters > 0 && <button onClick={clearFilters} className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600"><X className="h-3.5 w-3.5" />Limpar</button>}
                </div>
                <label className="label-base">Espécie</label>
                <Select value={fSpecies} onChange={(e) => setFSpecies(e.target.value as Species)}>
                  <option value="">Todas</option>
                  {(['cachorro', 'gato', 'ave', 'coelho', 'roedor', 'outro'] as Species[]).map((s) => <option key={s} value={s}>{speciesLabel[s]}</option>)}
                </Select>
                <label className="label-base">Sexo</label>
                <Select value={fSex} onChange={(e) => setFSex(e.target.value as Sex)}>
                  <option value="">Todos</option><option value="macho">Macho</option><option value="femea">Fêmea</option>
                </Select>
                <label className="label-base">Status</label>
                <Select value={fStatus} onChange={(e) => setFStatus(e.target.value as ClinicalStatus)}>
                  <option value="">Todos</option>
                  {(Object.keys(clinicalStatusLabel) as ClinicalStatus[]).map((s) => <option key={s} value={s}>{clinicalStatusLabel[s]}</option>)}
                </Select>
                <label className="label-base">Prioridade</label>
                <Select value={fPriority} onChange={(e) => setFPriority(e.target.value as Priority)}>
                  <option value="">Todas</option>
                  {(Object.keys(priorityLabel) as Priority[]).map((p) => <option key={p} value={p}>{priorityLabel[p]}</option>)}
                </Select>
                <Button className="w-full" onClick={close}>Aplicar</Button>
              </div>
            )}
          </Popover>

          <Popover
            align="end"
            trigger={({ toggle }) => (
              <button onClick={toggle} className="btn-outline h-10 px-3.5"><ArrowDownUp className="h-[18px] w-[18px]" /><span className="hidden sm:inline">Ordenar</span></button>
            )}
          >
            {(close) => (
              <div className="space-y-1">
                {([['recent', 'Mais recentes'], ['name', 'Nome (A-Z)'], ['weight', 'Peso (maior)'], ['priority', 'Prioridade']] as [SortKey, string][]).map(([k, label]) => (
                  <button key={k} onClick={() => { setSort(k); close() }} className={cn('flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-surface-2', sort === k ? 'text-brand-700' : 'text-ink-2')}>
                    {label}{sort === k && <span className="h-2 w-2 rounded-full bg-brand-600" />}
                  </button>
                ))}
              </div>
            )}
          </Popover>

          <SegmentedControl
            className="hidden sm:inline-flex"
            value={view}
            onChange={setView}
            options={[{ value: 'cards', label: 'Cards' }, { value: 'table', label: 'Tabela' }]}
          />
        </div>
      </div>

      {/* Count */}
      {!loading && (
        <p className="mb-3 text-sm text-muted">{result.length} {result.length === 1 ? 'pet encontrado' : 'pets encontrados'}</p>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-40" />)}
        </div>
      ) : result.length === 0 ? (
        <EmptyState
          icon={q || activeFilters ? Search : PawPrint}
          title={q || activeFilters ? 'Nenhum pet encontrado' : 'Nenhum pet cadastrado'}
          description={q || activeFilters ? 'Ajuste a busca ou os filtros para ver mais resultados.' : 'Comece cadastrando o primeiro animal da clínica.'}
          action={q || activeFilters ? <Button variant="outline" onClick={() => { setQ(''); clearFilters() }}>Limpar busca</Button> : <Button icon={Plus} onClick={openCreate}>Cadastrar primeiro pet</Button>}
        />
      ) : view === 'cards' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {result.map((p, i) => <PetCard key={p.id} pet={p} tutor={tutors.find((t) => t.id === p.tutorId)} delay={Math.min(i * 40, 320)} />)}
        </div>
      ) : (
        <PetTable pets={result} />
      )}
    </div>
  )
}

function PetTable({ pets }: { pets: import('@/data/types').Pet[] }) {
  return (
    <div className="hidden overflow-hidden rounded-2xl border border-line bg-surface sm:block">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line bg-surface-2/50 text-left text-xs font-semibold uppercase tracking-wide text-muted">
            <th className="px-4 py-3">Pet</th>
            <th className="px-4 py-3">Espécie / Raça</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Peso</th>
            <th className="px-4 py-3">Localização</th>
            <th className="px-4 py-3">Última consulta</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {pets.map((p) => {
            const loc = [p.location.setor, p.location.canil, p.location.box, p.location.sala].filter(Boolean).join(' · ')
            return (
              <tr key={p.id} className="group transition-colors hover:bg-surface-2/50">
                <td className="px-4 py-3">
                  <Link to={`/pets/${p.id}`} className="flex items-center gap-3">
                    <PetAvatar pet={p} size="sm" />
                    <div>
                      <div className="flex items-center gap-2 font-semibold text-ink group-hover:text-brand-700">
                        {p.name}
                        {(p.priority === 'alta' || p.priority === 'critica') && <PriorityBadge priority={p.priority} />}
                      </div>
                      <div className="text-xs text-muted">{p.id}</div>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink-2">{speciesLabel[p.species]} · {p.breed}</td>
                <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                <td className="px-4 py-3 font-medium text-ink-2">{weight(p.weightKg)}</td>
                <td className="px-4 py-3"><span className="inline-flex items-center gap-1.5 text-ink-2"><MapPin className="h-3.5 w-3.5 text-faint" />{loc}</span></td>
                <td className="px-4 py-3 text-muted">{formatDateShort(p.lastVisit)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
