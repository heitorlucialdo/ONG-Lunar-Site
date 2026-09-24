import { Info, Warehouse } from 'lucide-react'
import { useStore } from '@/services/store'
import { PageHeader } from '@/components/layout/PageHeader'
import { KanbanBoard } from '@/components/kanban/KanbanBoard'
import { OccupancyPanel } from '@/components/home/OccupancyPanel'
import { Skeleton } from '@/components/ui/Feedback'
import { baseLabel } from '@/lib/format'

export function Logistics() {
  const { kennels, base, loading } = useStore()

  return (
    <div>
      <PageHeader
        title="Logística"
        subtitle="Visualize onde cada animal está e o que precisa ser feito."
      />

      {loading ? (
        <Skeleton className="h-[420px] w-full rounded-2xl" />
      ) : (
        <div className="space-y-6">
          <section className="card p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-bold text-ink">
                <Warehouse className="h-[18px] w-[18px] text-brand-600" strokeWidth={2.1} />
                Ocupação das alas — {baseLabel[base]}
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              <OccupancyPanel kennels={kennels} />
            </div>
          </section>

          <div>
            <div className="mb-3 flex items-center gap-2 text-sm text-muted">
              <Info className="h-4 w-4 text-brand-500" />
              Arraste os cards entre as colunas para mover o animal no ciclo de acolhimento. A movimentação é registrada no histórico.
            </div>
            <KanbanBoard />
          </div>
        </div>
      )}
    </div>
  )
}
