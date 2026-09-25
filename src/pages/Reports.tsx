import { useMemo } from 'react'
import { Activity, PawPrint, ScissorsSquare, Syringe, Warehouse } from 'lucide-react'
import { useStore } from '@/services/store'
import { PageHeader } from '@/components/layout/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { SpeciesDonut } from '@/components/charts/SpeciesDonut'
import { OccupancyPanel } from '@/components/home/OccupancyPanel'
import { ProgressBar, Skeleton } from '@/components/ui/Feedback'
import { baseLabel, porteLabel } from '@/lib/format'
import type { Porte } from '@/data/types'

export function Reports() {
  const { pets, alas, setores, appointments, base, loading } = useStore()

  const kpis = useMemo(() => {
    const total = pets.length
    const castrados = pets.filter((p) => p.castrado).length
    const emTratamento = pets.filter((p) => p.status === 'internado' || p.status === 'critico').length
    const aptos = pets.filter((p) => p.stage === 'alta').length
    const vacinasAplicadas = pets.reduce((n, p) => n + p.vaccines.length, 0)
    const totalCap = alas.reduce((n, k) => n + k.capacity, 0)
    const totalOcc = alas.reduce((n, k) => n + k.occupied, 0)
    const ocupacao = totalCap ? Math.round((totalOcc / totalCap) * 100) : 0
    const medsAdmin = pets.reduce((n, p) => n + p.medications.filter((m) => m.active).length, 0)
    return { total, castrados, emTratamento, aptos, vacinasAplicadas, ocupacao, medsAdmin }
  }, [pets, alas])

  const porte = useMemo(() => {
    const c: Record<Porte, number> = { P: 0, M: 0, G: 0 }
    pets.forEach((p) => { c[p.porte] += 1 })
    return c
  }, [pets])

  if (loading) return <div className="space-y-4"><Skeleton className="h-28" /><Skeleton className="h-80" /></div>

  return (
    <div>
      <PageHeader title="Relatórios" subtitle={`Indicadores operacionais — ${baseLabel[base]}.`} />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <MetricCard icon={PawPrint} label="Animais acolhidos" value={kpis.total} tone="brand" />
        <MetricCard icon={Activity} label="Em tratamento" value={kpis.emTratamento} tone="warning" />
        <MetricCard icon={ScissorsSquare} label="Castrados" value={`${kpis.total ? Math.round((kpis.castrados / kpis.total) * 100) : 0}%`} tone="success" />
        <MetricCard icon={Warehouse} label="Ocupação média" value={`${kpis.ocupacao}%`} tone="info" />
        <MetricCard icon={Syringe} label="Vacinas aplicadas" value={kpis.vacinasAplicadas} tone="brand" />
        <MetricCard icon={Activity} label="Medicações ativas" value={kpis.medsAdmin} tone="info" />
        <MetricCard icon={PawPrint} label="Aptos p/ adoção" value={kpis.aptos} tone="success" />
        <MetricCard icon={Activity} label="Atendimentos" value={appointments.length} tone="warning" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="card p-5 sm:p-6">
          <h2 className="mb-5 text-base font-bold text-ink">Distribuição por espécie</h2>
          <SpeciesDonut pets={pets} />
        </section>

        <section className="card p-5 sm:p-6">
          <h2 className="mb-5 text-base font-bold text-ink">Ocupação das alas</h2>
          <div className="grid grid-cols-1 gap-x-8 gap-y-4">
            <OccupancyPanel alas={alas} setores={setores} />
          </div>
        </section>

        <section className="card p-5 sm:p-6">
          <h2 className="mb-5 text-base font-bold text-ink">Distribuição por porte</h2>
          <div className="space-y-4">
            {(['P', 'M', 'G'] as Porte[]).map((p) => (
              <div key={p}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-ink-2">{p} — {porteLabel[p]}</span>
                  <span className="font-bold text-ink">{porte[p]}</span>
                </div>
                <ProgressBar value={porte[p]} max={kpis.total || 1} />
              </div>
            ))}
          </div>
        </section>

        <section className="card p-5 sm:p-6">
          <h2 className="mb-5 text-base font-bold text-ink">Situação clínica</h2>
          <div className="space-y-4">
            {[
              { label: 'Saudáveis', value: pets.filter((p) => p.status === 'saudavel').length, tone: 'bg-success' },
              { label: 'Em observação', value: pets.filter((p) => p.status === 'observacao').length, tone: 'bg-info' },
              { label: 'Em tratamento', value: pets.filter((p) => p.status === 'internado').length, tone: 'bg-warning' },
              { label: 'Críticos', value: pets.filter((p) => p.status === 'critico').length, tone: 'bg-danger' },
            ].map((r) => (
              <div key={r.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-ink-2">{r.label}</span>
                  <span className="font-bold text-ink">{r.value}</span>
                </div>
                <ProgressBar value={r.value} max={kpis.total || 1} tone={r.tone} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
