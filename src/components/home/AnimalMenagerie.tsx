import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Pet, Species } from '@/data/types'
import { speciesMeta } from '@/lib/petMeta'
import { speciesLabel } from '@/lib/format'
import { cn } from '@/lib/cn'

const order: Species[] = ['cachorro', 'gato', 'ave', 'coelho', 'roedor', 'outro']

export function AnimalMenagerie({ pets }: { pets: Pet[] }) {
  const groups = useMemo(() => {
    const counts = new Map<Species, number>()
    pets.forEach((p) => counts.set(p.species, (counts.get(p.species) ?? 0) + 1))
    return order.map((s) => ({ species: s, count: counts.get(s) ?? 0 })).filter((g) => g.count > 0)
  }, [pets])

  return (
    <div className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 p-6 text-white shadow-glow sm:p-8">
      {/* atmospheric orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-brand-400/30 blur-3xl" />
        <div className="absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-brand-300/20 blur-3xl" />
        <div className="absolute right-24 top-8 h-1.5 w-1.5 rounded-full bg-white/80 animate-float" style={{ animationDelay: '0.4s' }} />
        <div className="absolute right-10 top-24 h-1 w-1 rounded-full bg-white/60 animate-float" style={{ animationDelay: '1.1s' }} />
        <div className="absolute left-1/3 top-6 h-1 w-1 rounded-full bg-white/50 animate-float" style={{ animationDelay: '0.7s' }} />
      </div>

      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-100/90">Espécies sob cuidado</p>
          <h3 className="mt-2 font-display text-2xl font-extrabold leading-tight text-balance">
            Cada animal, um universo de cuidado.
          </h3>
          <p className="mt-2 text-sm text-brand-100/85">
            {pets.length} animais cadastrados na LUNAR, acompanhados em tempo real pela equipe.
          </p>
          <Link to="/pets" className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-white/12 px-3.5 py-2 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20">
            Ver todos os pets <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4 md:max-w-md">
          {groups.map((g, i) => {
            const Icon = speciesMeta[g.species].icon
            return (
              <div
                key={g.species}
                className="group relative flex flex-col items-center gap-2 rounded-2xl bg-white/10 p-4 backdrop-blur-sm ring-1 ring-white/15 animate-fade-up"
                style={{ animationDelay: `${120 + i * 90}ms` }}
              >
                <span
                  className={cn('flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white transition-transform duration-500 group-hover:-translate-y-1')}
                  style={{ animation: `float 6s ease-in-out ${i * 0.5}s infinite` }}
                >
                  <Icon className="h-6 w-6" strokeWidth={1.9} />
                </span>
                <span className="text-2xl font-extrabold leading-none">{g.count}</span>
                <span className="text-[11px] font-medium text-brand-100/85">{speciesLabel[g.species]}{g.count > 1 ? 's' : ''}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
