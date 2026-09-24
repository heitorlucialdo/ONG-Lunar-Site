import { Building2, ShieldCheck, TreePine, UserCog, Users } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { LunarGlyph } from '@/components/brand/LunarMark'
import { team } from '@/data/seed'
import { cn } from '@/lib/cn'

const roleMeta: Record<string, { label: string; chip: string }> = {
  admin: { label: 'Administrador', chip: 'bg-brand-50 text-brand-700' },
  usuario: { label: 'Usuário comum', chip: 'bg-surface-2 text-ink-2' },
  veterinario: { label: 'Veterinário', chip: 'bg-info-soft text-info-ink' },
  recepcao: { label: 'Recepção', chip: 'bg-surface-2 text-ink-2' },
  enfermagem: { label: 'Enfermagem', chip: 'bg-surface-2 text-ink-2' },
}

export function Settings() {
  return (
    <div>
      <PageHeader title="Configurações" subtitle="Instituição, equipe e preferências do sistema." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="card p-5 sm:p-6">
          <h2 className="mb-4 text-base font-bold text-ink">Instituições</h2>
          <div className="space-y-3">
            <OrgRow icon={Building2} name="ONG Lunaar" desc="Associação de proteção animal · base principal" />
            <OrgRow icon={TreePine} name="Recanto" desc="Unidade de acolhimento · base segregada" />
          </div>
          <p className="mt-4 rounded-xl bg-surface-2/60 p-3 text-xs text-muted">
            Os registros da ONG e do Recanto são mantidos em bases separadas. Use o seletor no topo para alternar entre elas.
          </p>
        </section>

        <section className="card p-5 sm:p-6">
          <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-ink"><UserCog className="h-[18px] w-[18px] text-brand-600" /> Perfis de acesso</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-brand-600" />
              <div><p className="font-semibold text-ink">Administrador</p><p className="text-muted">Acesso total: gestão de contas, alas, alternância entre bases e auditoria.</p></div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="mt-0.5 h-5 w-5 text-muted" />
              <div><p className="font-semibold text-ink">Usuário comum</p><p className="text-muted">Lançamentos diários: cadastro de animais, prontuário e movimentação.</p></div>
            </div>
          </div>
        </section>

        <section className="card p-5 sm:p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-bold text-ink"><Users className="h-[18px] w-[18px] text-brand-600" /> Equipe</h2>
            <span className="text-xs font-semibold text-muted">{team.length} de 5 operadores</span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {team.map((u) => (
              <div key={u.id} className="flex items-center gap-3 rounded-xl border border-line p-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white">
                  {u.name.split(' ').slice(0, 2).map((n) => n[0]).join('')}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{u.name}</p>
                  <p className="truncate text-xs text-muted">{u.email}</p>
                </div>
                <span className={cn('chip', roleMeta[u.role]?.chip)}>{roleMeta[u.role]?.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card flex flex-col items-center p-6 text-center lg:col-span-2">
          <LunarGlyph className="h-12 w-12" />
          <p className="mt-3 font-display text-lg font-extrabold text-ink">Projeto Lunaar</p>
          <p className="text-sm text-muted">Sistema de gestão de acolhimento animal · versão 0.1.0</p>
          <p className="mt-2 max-w-md text-xs text-faint">
            Projeto de extensão UniSenai-MT. Conformidade com LGPD (Lei nº 13.709/2018) e diretrizes de acessibilidade WCAG 2.1.
          </p>
        </section>
      </div>
    </div>
  )
}

function OrgRow({ icon: Icon, name, desc }: { icon: typeof Building2; name: string; desc: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line p-3.5">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><Icon className="h-5 w-5" /></span>
      <div><p className="text-sm font-semibold text-ink">{name}</p><p className="text-xs text-muted">{desc}</p></div>
    </div>
  )
}
