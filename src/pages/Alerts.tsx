import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BellOff, Check } from 'lucide-react'
import { useStore } from '@/services/store'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { SegmentedControl } from '@/components/ui/Tabs'
import { EmptyState, Skeleton } from '@/components/ui/Feedback'
import { alertIconMeta } from '@/lib/alertMeta'
import { PriorityBadge } from '@/components/pets/PetBadges'
import { formatDate, relativeFromNow } from '@/lib/format'
import { cn } from '@/lib/cn'

export function Alerts() {
  const { alerts, pets, markAlertRead, markAllAlertsRead, loading } = useStore()
  const [filter, setFilter] = useState<'todos' | 'nao-lidos'>('todos')

  const list = filter === 'nao-lidos' ? alerts.filter((a) => !a.read) : alerts
  const unread = alerts.filter((a) => !a.read).length

  if (loading) return <div className="space-y-4"><Skeleton className="h-14" /><Skeleton className="h-96" /></div>

  return (
    <div>
      <PageHeader
        title="Central de alertas"
        subtitle="Acompanhe pendências médicas, vacinas e prazos importantes."
        actions={unread > 0 ? <Button variant="outline" icon={Check} onClick={markAllAlertsRead}>Marcar todos como lidos</Button> : undefined}
      />

      <div className="mb-4">
        <SegmentedControl value={filter} onChange={setFilter} options={[{ value: 'todos', label: `Todos (${alerts.length})` }, { value: 'nao-lidos', label: `Não lidos (${unread})` }]} />
      </div>

      {list.length === 0 ? (
        <EmptyState icon={BellOff} title="Nenhum alerta" description="Você está em dia. Nenhuma pendência para exibir." />
      ) : (
        <div className="space-y-2.5">
          {list.map((a) => {
            const m = alertIconMeta[a.type]
            const Icon = m.icon
            const pet = a.petId ? pets.find((p) => p.id === a.petId) : undefined
            return (
              <div key={a.id} className={cn('card flex items-start gap-4 p-4', !a.read && 'ring-1 ring-brand-100')}>
                <span className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', m.soft)}><Icon className="h-5 w-5" strokeWidth={2.1} /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-ink">{a.message}</p>
                    <PriorityBadge priority={a.priority} />
                    {!a.read && <span className="h-2 w-2 rounded-full bg-brand-500" />}
                  </div>
                  <p className="mt-0.5 text-xs text-faint">{formatDate(a.date)} · {relativeFromNow(a.date)}</p>
                  <div className="mt-2.5 flex items-center gap-2">
                    {pet && <Link to={`/pets/${pet.id}`} className="btn-soft h-8 px-3 text-xs">{a.action ?? 'Ver animal'}</Link>}
                    {!a.read && <button onClick={() => markAlertRead(a.id)} className="btn-ghost h-8 px-3 text-xs text-muted">Marcar como lido</button>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
