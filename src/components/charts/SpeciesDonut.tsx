import { useMemo } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import type { Pet, Species } from '@/data/types'
import { speciesLabel } from '@/lib/format'
import { speciesMeta } from '@/lib/petMeta'

const speciesColor: Record<Species, string> = {
  cachorro: '#6D28D9',
  gato: '#8B5CF6',
  ave: '#14B8A6',
  coelho: '#F472B6',
  roedor: '#F59E0B',
  outro: '#94A3B8',
}

export function SpeciesDonut({ pets }: { pets: Pet[] }) {
  const data = useMemo(() => {
    const counts = new Map<Species, number>()
    pets.forEach((p) => counts.set(p.species, (counts.get(p.species) ?? 0) + 1))
    const total = pets.length || 1
    return (['cachorro', 'gato', 'ave', 'coelho', 'roedor', 'outro'] as Species[])
      .map((s) => ({ species: s, value: counts.get(s) ?? 0, pct: Math.round(((counts.get(s) ?? 0) / total) * 100) }))
      .filter((d) => d.value > 0)
  }, [pets])

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
      <div className="relative h-[168px] w-[168px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={58} outerRadius={82} paddingAngle={2.5} stroke="none" cornerRadius={5}>
              {data.map((d) => <Cell key={d.species} fill={speciesColor[d.species]} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-3xl font-extrabold text-ink">{pets.length}</span>
          <span className="text-xs font-medium text-muted">animais</span>
        </div>
      </div>
      <ul className="grid w-full flex-1 grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-1">
        {data.map((d) => {
          const Icon = speciesMeta[d.species].icon
          return (
            <li key={d.species} className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-md" style={{ background: `${speciesColor[d.species]}1a`, color: speciesColor[d.species] }}>
                <Icon className="h-3.5 w-3.5" strokeWidth={2.2} />
              </span>
              <span className="flex-1 text-sm font-medium text-ink-2">{speciesLabel[d.species]}</span>
              <span className="text-sm font-bold text-ink">{d.pct}%</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
