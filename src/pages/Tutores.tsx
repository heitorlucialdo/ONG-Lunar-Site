import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Mail, MapPin, Phone, Search, User, Users } from 'lucide-react'
import { useStore } from '@/services/store'
import { PageHeader } from '@/components/layout/PageHeader'
import { Input } from '@/components/ui/Field'
import { Drawer } from '@/components/ui/Modal'
import { EmptyState, Skeleton } from '@/components/ui/Feedback'
import { PetAvatar } from '@/components/pets/PetAvatar'
import { StatusBadge } from '@/components/pets/PetBadges'
import { speciesLabel } from '@/lib/format'
import type { Tutor } from '@/data/types'

export function Tutores() {
  const { tutors, allPets, loading } = useStore()
  const [q, setQ] = useState('')
  const [params, setParams] = useSearchParams()
  const openId = params.get('id')

  const withCounts = useMemo(() => {
    const term = q.trim().toLowerCase()
    return tutors
      .map((t) => ({ tutor: t, pets: allPets.filter((p) => p.tutorId === t.id) }))
      .filter(({ tutor }) => !term || [tutor.name, tutor.phone, tutor.email].join(' ').toLowerCase().includes(term))
      .sort((a, b) => a.tutor.name.localeCompare(b.tutor.name))
  }, [tutors, allPets, q])

  const selected = openId ? tutors.find((t) => t.id === openId) : undefined
  const selectedPets = selected ? allPets.filter((p) => p.tutorId === selected.id) : []

  if (loading) return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-32" />)}</div>

  return (
    <div>
      <PageHeader title="Tutores e responsáveis" subtitle="Responsáveis e adotantes vinculados aos animais." />

      <div className="relative mb-5 max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-faint" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome, telefone ou e-mail…" className="pl-11" />
      </div>

      {withCounts.length === 0 ? (
        <EmptyState icon={Users} title="Nenhum tutor encontrado" description="Ajuste a busca para ver mais resultados." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {withCounts.map(({ tutor, pets }) => (
            <button key={tutor.id} onClick={() => setParams({ id: tutor.id })} className="card p-4 text-left transition-shadow hover:shadow-raise">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white">
                  {tutor.name.split(' ').slice(0, 2).map((n) => n[0]).join('')}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">{tutor.name}</p>
                  <p className="truncate text-xs text-muted">{tutor.phone}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 border-t border-line pt-3 text-xs text-muted">
                <User className="h-3.5 w-3.5" /> {pets.length} {pets.length === 1 ? 'animal vinculado' : 'animais vinculados'}
              </div>
            </button>
          ))}
        </div>
      )}

      <Drawer open={!!selected} onClose={() => setParams({})} title={selected?.name} description="Ficha do responsável" size="md">
        {selected && (
          <div className="space-y-6">
            <div className="space-y-2.5">
              <ContactRow icon={Phone} value={selected.phone} />
              <ContactRow icon={Mail} value={selected.email || '—'} />
              {selected.cpf && <ContactRow icon={User} value={`CPF: ${selected.cpf}`} />}
              {selected.address && <ContactRow icon={MapPin} value={selected.address} />}
            </div>
            {selected.notes && <div className="rounded-xl bg-surface-2/60 p-3.5 text-sm text-ink-2">{selected.notes}</div>}
            <div>
              <h3 className="mb-3 text-sm font-bold text-ink">Animais vinculados</h3>
              {selectedPets.length === 0 ? (
                <p className="text-sm text-muted">Nenhum animal vinculado.</p>
              ) : (
                <div className="space-y-2">
                  {selectedPets.map((p) => (
                    <Link key={p.id} to={`/pets/${p.id}`} onClick={() => setParams({})} className="flex items-center gap-3 rounded-xl border border-line p-3 transition-colors hover:bg-surface-2/60">
                      <PetAvatar pet={p} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink">{p.name}</p>
                        <p className="truncate text-xs text-muted">{speciesLabel[p.species]} · {p.breed}</p>
                      </div>
                      <StatusBadge status={p.status} />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}

function ContactRow({ icon: Icon, value }: { icon: typeof Phone; value: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-ink-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2 text-muted"><Icon className="h-4 w-4" /></span>
      {value}
    </div>
  )
}
