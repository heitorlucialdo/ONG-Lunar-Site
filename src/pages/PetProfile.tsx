import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft, CalendarClock, Camera, ClipboardList, Copy, FileText, MapPin, MoreVertical, Pencil, Pill,
  Plus, Scale, Stethoscope, Syringe, Trash2, TriangleAlert, Upload,
} from 'lucide-react'
import { useStore, usePet, useTutor } from '@/services/store'
import { usePetForm } from '@/components/pets/PetFormProvider'
import { PetAvatar } from '@/components/pets/PetAvatar'
import { StatusBadge, PriorityBadge, SpeciesBadge } from '@/components/pets/PetBadges'
import { PetStatusTags, PorteBadge } from '@/components/pets/PetStatusTags'
import { Button } from '@/components/ui/Button'
import { Tabs, type TabItem } from '@/components/ui/Tabs'
import { Popover } from '@/components/ui/Popover'
import { EmptyState } from '@/components/ui/Feedback'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { WeightChart } from '@/components/charts/WeightChart'
import { Timeline, type TimelineRow } from '@/components/shared/Timeline'
import { QrBadge } from '@/components/pets/QrBadge'
import { useToast } from '@/components/ui/Toast'
import {
  AddConsultationModal, AddMedicationModal, AddVaccineModal, AddWeightModal, ChangeLocationModal, UploadDocModal,
} from '@/components/pets/PetModals'
import { medMeta, vaccineMeta } from '@/lib/petMeta'
import {
  formatDate, formatDateShort, sexToLabel, vaccineStatusLabel, weight,
} from '@/lib/format'
import type { Pet } from '@/data/types'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/cn'

type TabId = 'visao' | 'prontuario' | 'medicamentos' | 'vacinas' | 'peso' | 'consultas' | 'documentos' | 'historico'
type ModalId = null | 'weight' | 'medication' | 'vaccine' | 'consultation' | 'location' | 'document'

export function PetProfile() {
  const { id } = useParams()
  const pet = usePet(id)
  const tutor = useTutor(pet?.tutorId)
  const { deletePet } = useStore()
  const { openEdit } = usePetForm()
  const toast = useToast()
  const navigate = useNavigate()
  const [tab, setTab] = useState<TabId>('visao')
  const [modal, setModal] = useState<ModalId>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (!pet) {
    return (
      <EmptyState icon={TriangleAlert} title="Pet não encontrado" description="O animal solicitado não existe ou foi removido."
        action={<Link to="/pets" className="btn-primary h-10 px-4">Voltar para Pets</Link>} />
    )
  }

  const activeMeds = pet.medications.filter((m) => m.active)
  const tabs: TabItem[] = [
    { id: 'visao', label: 'Visão geral' },
    { id: 'prontuario', label: 'Prontuário' },
    { id: 'medicamentos', label: 'Medicamentos', count: activeMeds.length },
    { id: 'vacinas', label: 'Vacinas', count: pet.vaccines.length },
    { id: 'peso', label: 'Peso' },
    { id: 'consultas', label: 'Consultas', count: pet.records.length },
    { id: 'documentos', label: 'Documentos', count: pet.documents.length },
    { id: 'historico', label: 'Histórico' },
  ]

  const copyId = () => { navigator.clipboard?.writeText(pet.id); toast({ kind: 'info', title: 'Código copiado', message: pet.id }) }
  const loc = [pet.location.setor, pet.location.canil, pet.location.box, pet.location.sala].filter(Boolean).join(' · ')

  return (
    <div>
      <Link to="/pets" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Pets
      </Link>

      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-line bg-surface p-5 lunar-atmos sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="relative">
            <PetAvatar pet={pet} size="xl" />
            <button onClick={() => openEdit(pet)} className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-surface text-brand-600 shadow-raise ring-1 ring-line transition-transform hover:scale-105" aria-label="Editar foto">
              <Camera className="h-4 w-4" />
            </button>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">{pet.name}</h1>
              <StatusBadge status={pet.status} />
              <PriorityBadge priority={pet.priority} />
            </div>
            <button onClick={copyId} className="group mt-1.5 inline-flex items-center gap-1.5 rounded-lg bg-surface-2 px-2 py-1 font-mono text-[13px] font-semibold text-ink-2 transition-colors hover:bg-brand-50 hover:text-brand-700">
              {pet.id} <Copy className="h-3.5 w-3.5 text-faint group-hover:text-brand-500" />
            </button>

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-ink-2">
              <SpeciesBadge species={pet.species} />
              <PorteBadge porte={pet.porte} />
              <Fact label="Raça" value={pet.breed} />
              <Fact label="Sexo" value={sexToLabel(pet.sex)} />
              <Fact label="Idade" value={pet.ageLabel} />
              <Fact label="Peso" value={weight(pet.weightKg)} />
            </div>
            <div className="mt-3">
              <PetStatusTags pet={pet} />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface-2 px-2.5 py-1.5 text-[13px] font-medium text-ink-2">
                <MapPin className="h-4 w-4 text-brand-500" /> {loc}
              </span>
              <button onClick={() => setModal('location')} className="text-[13px] font-semibold text-brand-600 hover:text-brand-700">Alterar</button>
              {tutor && <Link to={`/tutores?id=${tutor.id}`} className="inline-flex items-center gap-1.5 rounded-lg bg-surface-2 px-2.5 py-1.5 text-[13px] font-medium text-ink-2 hover:bg-brand-50 hover:text-brand-700">Tutor: {tutor.name}</Link>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" icon={Pencil} onClick={() => openEdit(pet)} className="hidden sm:inline-flex">Editar</Button>
            <Button icon={Stethoscope} onClick={() => setModal('consultation')}>Nova consulta</Button>
            <Popover
              align="end"
              trigger={({ toggle }) => <button onClick={toggle} className="btn-outline h-10 w-10" aria-label="Mais ações"><MoreVertical className="h-5 w-5" /></button>}
            >
              {(close) => (
                <div className="space-y-1">
                  <button onClick={() => { openEdit(pet); close() }} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-2 hover:bg-surface-2"><Pencil className="h-4 w-4" /> Editar animal</button>
                  <button onClick={() => { setModal('document'); close() }} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-2 hover:bg-surface-2"><Upload className="h-4 w-4" /> Enviar documento</button>
                  <div className="my-1 h-px bg-line" />
                  <button onClick={() => { setConfirmDelete(true); close() }} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-danger hover:bg-danger-soft"><Trash2 className="h-4 w-4" /> Excluir animal</button>
                </div>
              )}
            </Popover>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6"><Tabs items={tabs} active={tab} onChange={(t) => setTab(t as TabId)} /></div>

      <div className="mt-6">
        {tab === 'visao' && <OverviewTab pet={pet} onAddWeight={() => setModal('weight')} />}
        {tab === 'prontuario' && <ProntuarioTab pet={pet} onNew={() => setModal('consultation')} />}
        {tab === 'medicamentos' && <MedicationsTab pet={pet} onAdd={() => setModal('medication')} />}
        {tab === 'vacinas' && <VaccinesTab pet={pet} onAdd={() => setModal('vaccine')} />}
        {tab === 'peso' && <WeightTab pet={pet} onAdd={() => setModal('weight')} />}
        {tab === 'consultas' && <ConsultasTab pet={pet} onNew={() => setModal('consultation')} />}
        {tab === 'documentos' && <DocumentsTab pet={pet} onUpload={() => setModal('document')} />}
        {tab === 'historico' && <HistoryTab pet={pet} />}
      </div>

      {/* Modals */}
      <AddWeightModal pet={pet} open={modal === 'weight'} onClose={() => setModal(null)} />
      <AddMedicationModal pet={pet} open={modal === 'medication'} onClose={() => setModal(null)} />
      <AddVaccineModal pet={pet} open={modal === 'vaccine'} onClose={() => setModal(null)} />
      <AddConsultationModal pet={pet} open={modal === 'consultation'} onClose={() => setModal(null)} />
      <ChangeLocationModal pet={pet} open={modal === 'location'} onClose={() => setModal(null)} />
      <UploadDocModal pet={pet} open={modal === 'document'} onClose={() => setModal(null)} />
      <ConfirmDialog
        open={confirmDelete} onClose={() => setConfirmDelete(false)}
        onConfirm={() => { deletePet(pet.id); toast({ kind: 'success', title: 'Animal excluído', message: `${pet.name} foi removido.` }); navigate('/pets') }}
        danger title="Excluir animal" message={`Tem certeza que deseja excluir ${pet.name}? Esta ação não pode ser desfeita.`} confirmLabel="Excluir"
      />
    </div>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return <span><span className="text-faint">{label}: </span><span className="font-semibold text-ink">{value}</span></span>
}

function Panel({ title, action, children, className }: { title: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn('card p-5', className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-ink">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  )
}

// ── Visão geral ──────────────────────────────────────────────────────
function OverviewTab({ pet, onAddWeight }: { pet: Pet; onAddWeight: () => void }) {
  const activeMeds = pet.medications.filter((m) => m.active)
  const upcomingVax = pet.vaccines.filter((v) => v.status !== 'em-dia')
  const rows: TimelineRow[] = pet.timeline.slice(0, 8).map((t) => ({ id: t.id, type: t.type, title: t.title, description: t.description, when: `${formatDateShort(t.date)} · ${t.time}` }))

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <QuickFact icon={Scale} label="Peso atual" value={weight(pet.weightKg)} tone="brand" onAction={onAddWeight} actionLabel="Registrar" />
        <QuickFact icon={Stethoscope} label="Última consulta" value={formatDateShort(pet.lastVisit)} tone="info" />
        <QuickFact icon={CalendarClock} label="Próxima consulta" value={pet.nextVisit ? formatDateShort(pet.nextVisit) : '—'} tone="success" />
        <QuickFact icon={MapPin} label="Localização" value={pet.location.setor} tone="warning" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-1">
          {pet.allergies.length > 0 && (
            <Panel title="Alergias">
              <div className="flex flex-wrap gap-2">
                {pet.allergies.map((a) => <span key={a} className="chip bg-danger-soft text-danger-ink"><TriangleAlert className="h-3.5 w-3.5" />{a}</span>)}
              </div>
            </Panel>
          )}
          {pet.notes && <Panel title="Observações importantes"><p className="text-sm leading-relaxed text-ink-2">{pet.notes}</p></Panel>}
          <Panel title="Medicamentos ativos">
            {activeMeds.length === 0 ? <p className="text-sm text-muted">Nenhum medicamento ativo.</p> : (
              <ul className="space-y-2.5">
                {activeMeds.map((m) => (
                  <li key={m.id} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-info-soft text-info"><Pill className="h-4 w-4" /></span>
                    <div className="min-w-0"><p className="text-sm font-semibold text-ink">{m.name}</p><p className="text-xs text-muted">{m.dose} · {m.frequency}</p></div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          {upcomingVax.length > 0 && (
            <Panel title="Vacinas a acompanhar">
              <ul className="space-y-2.5">
                {upcomingVax.map((v) => (
                  <li key={v.id} className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-ink"><Syringe className="h-4 w-4 text-warning" />{v.name}</span>
                    <span className={cn('chip', vaccineMeta[v.status].chip)}>{vaccineStatusLabel[v.status]}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </div>

        <div className="lg:col-span-2">
          <Panel title="Linha do tempo">
            {rows.length === 0 ? <p className="text-sm text-muted">Sem eventos.</p> : <Timeline rows={rows} />}
          </Panel>
        </div>
      </div>
    </div>
  )
}

function QuickFact({ icon: Icon, label, value, tone, onAction, actionLabel }: { icon: typeof Scale; label: string; value: string; tone: 'brand' | 'info' | 'success' | 'warning'; onAction?: () => void; actionLabel?: string }) {
  const tones = { brand: 'bg-brand-50 text-brand-600', info: 'bg-info-soft text-info', success: 'bg-success-soft text-success', warning: 'bg-warning-soft text-warning' }
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <span className={cn('flex h-9 w-9 items-center justify-center rounded-lg', tones[tone])}><Icon className="h-[18px] w-[18px]" strokeWidth={2.1} /></span>
        {onAction && <button onClick={onAction} className="text-xs font-semibold text-brand-600 hover:text-brand-700">{actionLabel}</button>}
      </div>
      <p className="mt-3 text-lg font-bold text-ink">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  )
}

// ── Prontuário ───────────────────────────────────────────────────────
function ProntuarioTab({ pet, onNew }: { pet: Pet; onNew: () => void }) {
  const latest = pet.records[0]
  return (
    <div className="space-y-5">
      <Panel title="Sinais vitais — último registro" action={<Button size="sm" icon={Plus} onClick={onNew}>Nova consulta</Button>}>
        {latest ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Vital label="Temperatura" value={latest.temperature ? `${latest.temperature.toLocaleString('pt-BR')} °C` : '—'} />
            <Vital label="Freq. cardíaca" value={latest.heartRate ? `${latest.heartRate} bpm` : '—'} />
            <Vital label="Freq. respiratória" value={latest.respRate ? `${latest.respRate} rpm` : '—'} />
            <Vital label="Peso" value={latest.weight ? weight(latest.weight) : weight(pet.weightKg)} />
          </div>
        ) : <p className="text-sm text-muted">Nenhuma consulta registrada ainda.</p>}
      </Panel>

      {latest && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Panel title="Quadro clínico">
            <dl className="space-y-3 text-sm">
              <Row label="Queixa principal" value={latest.complaint} />
              {latest.symptoms && <Row label="Sintomas" value={latest.symptoms} />}
              {latest.diagnosis && <Row label="Diagnóstico" value={latest.diagnosis} />}
              {pet.relatoDores && <Row label="Relato de dores" value={pet.relatoDores} />}
              {latest.recommendations && <Row label="Recomendações" value={latest.recommendations} />}
              <Row label="Responsável" value={latest.vet} />
            </dl>
          </Panel>
          <Panel title="Procedimentos e exames">
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Procedimentos</p>
                <div className="flex flex-wrap gap-2">
                  {(latest.procedures ?? []).length ? latest.procedures!.map((p) => <span key={p} className="chip bg-brand-50 text-brand-700">{p}</span>) : <span className="text-sm text-muted">—</span>}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Exames</p>
                <div className="flex flex-wrap gap-2">
                  {(latest.exams ?? []).length ? latest.exams!.map((e) => <span key={e} className="chip bg-info-soft text-info-ink">{e}</span>) : <span className="text-sm text-muted">—</span>}
                </div>
              </div>
            </div>
          </Panel>
        </div>
      )}
    </div>
  )
}
function Vital({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-surface-2/60 p-3"><p className="text-xs text-muted">{label}</p><p className="mt-1 text-lg font-bold text-ink">{value}</p></div>
}
function Row({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</dt><dd className="mt-0.5 text-ink-2">{value}</dd></div>
}

// ── Medicamentos ─────────────────────────────────────────────────────
function MedicationsTab({ pet, onAdd }: { pet: Pet; onAdd: () => void }) {
  const { toggleMedicationActive } = useStore()
  if (pet.medications.length === 0) return <EmptyState icon={Pill} title="Nenhum medicamento" description="Este pet não possui medicamentos registrados." action={<Button icon={Plus} onClick={onAdd}>Adicionar medicamento</Button>} />
  return (
    <Panel title="Protocolo medicamentoso" action={<Button size="sm" icon={Plus} onClick={onAdd}>Adicionar</Button>}>
      <div className="space-y-3">
        {pet.medications.map((m) => (
          <div key={m.id} className={cn('rounded-xl border p-4 transition-colors', m.active ? 'border-line' : 'border-line bg-surface-2/40 opacity-70')}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-info-soft text-info"><Pill className="h-5 w-5" /></span>
                <div>
                  <p className="font-semibold text-ink">{m.name}</p>
                  <p className="text-sm text-muted">{m.dose} · {m.frequency}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {m.times.map((t) => <span key={t} className="chip bg-surface-2 text-ink-2">{t}</span>)}
                  </div>
                </div>
              </div>
              <button onClick={() => toggleMedicationActive(pet.id, m.id)} className={cn('chip', m.active ? 'bg-success-soft text-success-ink' : 'bg-surface-2 text-muted')}>
                {m.active ? 'Ativo' : 'Encerrado'}
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 border-t border-line pt-3 text-xs text-muted">
              <span>Início: <strong className="font-semibold text-ink-2">{formatDate(m.startDate)}</strong></span>
              {m.endDate && <span>Término: <strong className="font-semibold text-ink-2">{formatDate(m.endDate)}</strong></span>}
              <span>Responsável: <strong className="font-semibold text-ink-2">{m.responsible}</strong></span>
              {m.notes && <span className="w-full">Obs.: {m.notes}</span>}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

// ── Vacinas ──────────────────────────────────────────────────────────
function VaccinesTab({ pet, onAdd }: { pet: Pet; onAdd: () => void }) {
  if (pet.vaccines.length === 0) return <EmptyState icon={Syringe} title="Nenhuma vacina" description="Registre a carteira de vacinação deste pet." action={<Button icon={Plus} onClick={onAdd}>Registrar vacina</Button>} />
  return (
    <Panel title="Carteira de vacinação" action={<Button size="sm" icon={Plus} onClick={onAdd}>Registrar</Button>}>
      <div className="space-y-3">
        {pet.vaccines.map((v) => (
          <div key={v.id} className="flex items-center gap-3 rounded-xl border border-line p-4">
            <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl', vaccineMeta[v.status].chip)}><Syringe className="h-5 w-5" /></span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-ink">{v.name}</p>
              <p className="text-sm text-muted">Aplicada em {formatDate(v.date)}{v.nextDate && ` · próxima: ${formatDate(v.nextDate)}`}</p>
            </div>
            <span className={cn('chip', vaccineMeta[v.status].chip)}>{vaccineStatusLabel[v.status]}</span>
          </div>
        ))}
      </div>
    </Panel>
  )
}

// ── Peso ─────────────────────────────────────────────────────────────
function WeightTab({ pet, onAdd }: { pet: Pet; onAdd: () => void }) {
  const values = pet.weights.map((w) => w.kg)
  const max = values.length ? Math.max(...values) : 0
  const min = values.length ? Math.min(...values) : 0
  const last = pet.weights[pet.weights.length - 1]
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <QuickFact icon={Scale} label="Peso atual" value={weight(pet.weightKg)} tone="brand" onAction={onAdd} actionLabel="Registrar" />
        <QuickFact icon={Scale} label="Maior registrado" value={weight(max)} tone="warning" />
        <QuickFact icon={Scale} label="Menor registrado" value={weight(min)} tone="info" />
        <QuickFact icon={CalendarClock} label="Última atualização" value={last ? formatDateShort(last.date) : '—'} tone="success" />
      </div>
      <Panel title="Evolução do peso">
        <WeightChart weights={pet.weights} height={260} />
      </Panel>
      <Panel title="Medições" action={<Button size="sm" icon={Plus} onClick={onAdd}>Nova medição</Button>}>
        <div className="divide-y divide-line">
          {[...pet.weights].reverse().map((w) => (
            <div key={w.id} className="flex items-center justify-between py-3">
              <div><p className="font-semibold text-ink">{weight(w.kg)}</p>{w.note && <p className="text-xs text-muted">{w.note}</p>}</div>
              <div className="text-right text-xs text-muted"><p>{formatDate(w.date)} · {w.time}</p><p>{w.author}</p></div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}

// ── Consultas ────────────────────────────────────────────────────────
function ConsultasTab({ pet, onNew }: { pet: Pet; onNew: () => void }) {
  if (pet.records.length === 0) return <EmptyState icon={ClipboardList} title="Nenhuma consulta" description="Registre a primeira consulta deste pet." action={<Button icon={Plus} onClick={onNew}>Nova consulta</Button>} />
  return (
    <Panel title="Histórico de consultas" action={<Button size="sm" icon={Plus} onClick={onNew}>Nova consulta</Button>}>
      <div className="space-y-4">
        {pet.records.map((r) => (
          <div key={r.id} className="rounded-xl border border-line p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold text-ink">{r.diagnosis || r.complaint}</p>
              <span className="text-xs text-muted">{formatDate(r.date)}</span>
            </div>
            <p className="mt-1 text-sm text-ink-2"><span className="text-muted">Queixa:</span> {r.complaint}</p>
            {r.recommendations && <p className="mt-1 text-sm text-ink-2"><span className="text-muted">Recomendações:</span> {r.recommendations}</p>}
            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line pt-2.5 text-xs text-muted">
              {r.temperature && <span>{r.temperature.toLocaleString('pt-BR')} °C</span>}
              {r.heartRate && <span>{r.heartRate} bpm</span>}
              {r.respRate && <span>{r.respRate} rpm</span>}
              <span className="ml-auto font-semibold text-ink-2">{r.vet}</span>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

// ── Documentos ───────────────────────────────────────────────────────
const docKindMeta: Record<string, string> = { exame: 'bg-info-soft text-info', receituario: 'bg-brand-50 text-brand-600', laudo: 'bg-teal-50 text-teal-600', foto: 'bg-rose-50 text-rose-600', documento: 'bg-surface-2 text-muted' }
function DocumentsTab({ pet, onUpload }: { pet: Pet; onUpload: () => void }) {
  const { deleteDocument } = useStore()
  const toast = useToast()
  if (pet.documents.length === 0) return <EmptyState icon={FileText} title="Nenhum documento" description="Anexe exames, laudos, receituários e fotos deste pet." action={<Button icon={Upload} onClick={onUpload}>Enviar documento</Button>} />
  return (
    <Panel title="Documentos" action={<Button size="sm" icon={Upload} onClick={onUpload}>Enviar</Button>}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {pet.documents.map((d) => (
          <div key={d.id} className="flex items-center gap-3 rounded-xl border border-line p-3.5">
            <span className={cn('flex h-10 w-10 items-center justify-center rounded-lg', docKindMeta[d.kind])}><FileText className="h-5 w-5" /></span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{d.name}</p>
              <p className="text-xs text-muted capitalize">{d.kind} · {d.sizeKb} KB · {formatDateShort(d.uploadedAt)}</p>
            </div>
            <button onClick={() => { deleteDocument(pet.id, d.id); toast({ kind: 'info', title: 'Documento removido' }) }} className="btn-ghost h-8 w-8 rounded-lg text-muted hover:text-danger" aria-label="Remover"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </Panel>
  )
}

// ── Histórico ────────────────────────────────────────────────────────
function HistoryTab({ pet }: { pet: Pet }) {
  const rows: TimelineRow[] = pet.timeline.map((t) => ({ id: t.id, type: t.type, title: t.title, description: t.description, when: `${formatDate(t.date)} · ${t.time}` }))
  return <Panel title="Histórico completo">{rows.length ? <Timeline rows={rows} /> : <p className="text-sm text-muted">Sem histórico.</p>}</Panel>
}
