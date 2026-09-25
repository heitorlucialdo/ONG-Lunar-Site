import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity, AlertTriangle, ArrowRight, CalendarClock, ClipboardList, Clock, HeartPulse, LogOut, PawPrint, Stethoscope,
} from 'lucide-react'
import { useStore } from '@/services/store'
import { MetricCard } from '@/components/ui/MetricCard'
import { SpeciesDonut } from '@/components/charts/SpeciesDonut'
import { OccupancyPanel } from '@/components/home/OccupancyPanel'
import { AnimalMenagerie } from '@/components/home/AnimalMenagerie'
import { Timeline, type TimelineRow } from '@/components/shared/Timeline'
import { PetAvatar } from '@/components/pets/PetAvatar'
import { Skeleton } from '@/components/ui/Feedback'
import { alertIconMeta } from '@/lib/alertMeta'
import { appointmentTypeLabel, formatTime, formatDate, relativeFromNow } from '@/lib/format'
import { cn } from '@/lib/cn'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

const capitalizeFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export function Dashboard() {
  const { pets, appointments, alerts, alas, setores, tutors, loading } = useStore()

  const today = new Date().toISOString().slice(0, 10)
  const stats = useMemo(() => {
    const internados = pets.filter((p) => p.status === 'internado' || p.status === 'critico').length
    const consultasHoje = appointments.filter((a) => a.datetime.slice(0, 10) === today).length
    const aguardando = pets.filter((p) => p.stage === 'triagem').length
    const alertasMedicos = alerts.filter((a) => !a.read && (a.type === 'critico' || a.type === 'medicamento' || a.type === 'vacina')).length
    const altasPrevistas = pets.filter((p) => p.stage === 'alta').length
    return { internados, consultasHoje, aguardando, alertasMedicos, altasPrevistas }
  }, [pets, appointments, alerts, today])

  const todaysAppts = useMemo(
    () => appointments.filter((a) => a.datetime.slice(0, 10) === today).sort((a, b) => a.datetime.localeCompare(b.datetime)),
    [appointments, today],
  )

  const activity: TimelineRow[] = useMemo(() => {
    return pets
      .flatMap((p) => p.timeline.map((t) => ({ ...t, petName: p.name })))
      .sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`))
      .slice(0, 6)
      .map((t) => ({
        id: t.id, type: t.type, title: t.title,
        description: [t.petName, t.description].filter(Boolean).join(' · '),
        when: `${formatDate(t.date) === formatDate(today) ? 'Hoje' : formatDate(t.date)} · ${t.time}`,
      }))
  }, [pets, today])

  const topAlerts = alerts.filter((a) => !a.read).slice(0, 4)

  if (loading) return <DashboardSkeleton />

  return (
    <div className="space-y-7">
      {/* Greeting */}
      <div className="relative overflow-hidden rounded-3xl border border-line bg-surface p-6 lunar-atmos sm:p-7">
        <p className="text-sm font-medium text-brand-600">{capitalizeFirst(formatWeekdayLong(today))}, {formatDate(today)}</p>
        <h1 className="mt-1 font-display text-[28px] font-extrabold leading-tight text-ink sm:text-[34px]">
          {greeting()}, equipe Lunaar.
        </h1>
        <p className="mt-1.5 max-w-xl text-[15px] text-muted">
          Você tem <strong className="font-semibold text-ink">{stats.consultasHoje} atendimentos</strong> hoje,
          {' '}<strong className="font-semibold text-ink">{stats.internados} animais em tratamento</strong> e
          {' '}<strong className="font-semibold text-ink">{stats.alertasMedicos} alertas médicos</strong> aguardando.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-6">
        <MetricCard icon={PawPrint} label="Animais acolhidos" value={pets.length} tone="brand" delay={0} trend={{ dir: 'up', value: '+4', good: true }} />
        <MetricCard icon={HeartPulse} label="Em tratamento" value={stats.internados} tone="warning" delay={60} />
        <MetricCard icon={Stethoscope} label="Atendimentos hoje" value={stats.consultasHoje} tone="info" delay={120} />
        <MetricCard icon={Clock} label="Aguardando triagem" value={stats.aguardando} tone="brand" delay={180} />
        <MetricCard icon={AlertTriangle} label="Alertas médicos" value={stats.alertasMedicos} tone="danger" delay={240} />
        <MetricCard icon={LogOut} label="Aptos p/ adoção" value={stats.altasPrevistas} tone="success" delay={300} />
      </div>

      {/* Distribution + Occupancy */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="card p-5 sm:p-6">
          <SectionTitle icon={Activity} title="Distribuição por espécie" action={<Link to="/relatorios" className="link-more">Relatórios <ArrowRight className="h-3.5 w-3.5" /></Link>} />
          <div className="mt-5">
            <SpeciesDonut pets={pets} />
          </div>
        </section>
        <section className="card p-5 sm:p-6">
          <SectionTitle icon={ClipboardList} title="Ocupação das alas" action={<Link to="/logistica" className="link-more">Logística <ArrowRight className="h-3.5 w-3.5" /></Link>} />
          <div className="mt-5">
            <OccupancyPanel alas={alas} setores={setores} />
          </div>
        </section>
      </div>

      {/* Menagerie */}
      <AnimalMenagerie pets={pets} />

      {/* Agenda + Alerts + Activity */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Agenda de hoje */}
        <section className="card p-5 sm:p-6 lg:col-span-2">
          <SectionTitle icon={CalendarClock} title="Agenda de hoje" action={<Link to="/agenda" className="link-more">Ver agenda <ArrowRight className="h-3.5 w-3.5" /></Link>} />
          <div className="mt-4 divide-y divide-line">
            {todaysAppts.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted">Nenhum atendimento agendado para hoje.</p>
            ) : (
              todaysAppts.map((a) => {
                const pet = pets.find((p) => p.id === a.petId)
                const tutor = tutors.find((t) => t.id === a.tutorId)
                if (!pet) return null
                const done = a.status === 'concluido'
                return (
                  <Link key={a.id} to={`/pets/${pet.id}`} className="flex items-center gap-3 py-3 transition-colors hover:bg-surface-2/60 -mx-2 rounded-xl px-2">
                    <div className="w-14 shrink-0 text-center">
                      <div className={cn('text-sm font-bold', done ? 'text-faint line-through' : 'text-ink')}>{formatTime(a.datetime)}</div>
                    </div>
                    <PetAvatar pet={pet} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">{pet.name} <span className="font-normal text-muted">· {appointmentTypeLabel[a.type]}</span></p>
                      <p className="truncate text-xs text-muted">{tutor?.name} · {a.vet}</p>
                    </div>
                    <span className={cn('chip', done ? 'bg-success-soft text-success-ink' : a.status === 'em-andamento' ? 'bg-info-soft text-info-ink' : 'bg-surface-2 text-muted')}>
                      {done ? 'Concluído' : a.status === 'em-andamento' ? 'Em curso' : 'Agendado'}
                    </span>
                  </Link>
                )
              })
            )}
          </div>
        </section>

        {/* Alertas importantes */}
        <section className="card p-5 sm:p-6">
          <SectionTitle icon={AlertTriangle} title="Alertas" action={<Link to="/alertas" className="link-more">Todos <ArrowRight className="h-3.5 w-3.5" /></Link>} />
          <div className="mt-4 space-y-2.5">
            {topAlerts.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted">Sem alertas pendentes.</p>
            ) : (
              topAlerts.map((a) => {
                const m = alertIconMeta[a.type]
                const Icon = m.icon
                const inner = (
                  <div className="flex items-start gap-3 rounded-xl border border-line p-3 transition-colors hover:bg-surface-2/60">
                    <span className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', m.soft)}>
                      <Icon className="h-4 w-4" strokeWidth={2.1} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium leading-snug text-ink">{a.message}</p>
                      <p className="mt-0.5 text-xs text-faint">{relativeFromNow(a.date)}</p>
                    </div>
                  </div>
                )
                return a.petId ? <Link key={a.id} to={`/pets/${a.petId}`}>{inner}</Link> : <div key={a.id}>{inner}</div>
              })
            )}
          </div>
        </section>
      </div>

      {/* Atividade recente */}
      <section className="card p-5 sm:p-6">
        <SectionTitle icon={Activity} title="Atividade recente" />
        <div className="mt-5">
          <Timeline rows={activity} />
        </div>
      </section>
    </div>
  )
}

function SectionTitle({ icon: Icon, title, action }: { icon: typeof Activity; title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="flex items-center gap-2 text-base font-bold text-ink">
        <Icon className="h-[18px] w-[18px] text-brand-600" strokeWidth={2.1} />
        {title}
      </h2>
      {action}
    </div>
  )
}

function formatWeekdayLong(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(new Date(iso))
}

function DashboardSkeleton() {
  return (
    <div className="space-y-7">
      <Skeleton className="h-32 w-full rounded-3xl" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-32" />)}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="h-64" /><Skeleton className="h-64" />
      </div>
      <Skeleton className="h-52 w-full rounded-3xl" />
    </div>
  )
}
