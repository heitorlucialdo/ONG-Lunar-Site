import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarClock, Plus } from 'lucide-react'
import { useStore } from '@/services/store'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { SegmentedControl } from '@/components/ui/Tabs'
import { EmptyState, Skeleton } from '@/components/ui/Feedback'
import { PetAvatar } from '@/components/pets/PetAvatar'
import { Modal } from '@/components/ui/Modal'
import { Field, Select } from '@/components/ui/Field'
import { Input } from '@/components/ui/Field'
import { useToast } from '@/components/ui/Toast'
import { appointmentTypeLabel, formatTime, formatWeekday, formatDate, capitalize } from '@/lib/format'
import type { Appointment, AppointmentType } from '@/data/types'
import { cn } from '@/lib/cn'

type Range = 'dia' | 'semana' | 'mes'
const statusChip: Record<Appointment['status'], string> = {
  agendado: 'bg-surface-2 text-muted', confirmado: 'bg-info-soft text-info-ink',
  'em-andamento': 'bg-warning-soft text-warning-ink', concluido: 'bg-success-soft text-success-ink',
  cancelado: 'bg-danger-soft text-danger-ink',
}
const statusLabel: Record<Appointment['status'], string> = {
  agendado: 'Agendado', confirmado: 'Confirmado', 'em-andamento': 'Em andamento', concluido: 'Concluído', cancelado: 'Cancelado',
}

export function Agenda() {
  const { appointments, pets, tutors, loading } = useStore()
  const [range, setRange] = useState<Range>('dia')
  const [open, setOpen] = useState(false)

  const now = new Date()
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()

  const filtered = useMemo(() => {
    const end =
      range === 'dia' ? startToday + 86400000
      : range === 'semana' ? startToday + 7 * 86400000
      : new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime()
    return appointments
      .filter((a) => { const t = new Date(a.datetime).getTime(); return t >= startToday && t < end })
      .sort((a, b) => a.datetime.localeCompare(b.datetime))
  }, [appointments, range, startToday, now])

  const grouped = useMemo(() => {
    const map = new Map<string, Appointment[]>()
    filtered.forEach((a) => {
      const key = a.datetime.slice(0, 10)
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(a)
    })
    return Array.from(map.entries())
  }, [filtered])

  if (loading) return <div className="space-y-4"><Skeleton className="h-14" /><Skeleton className="h-96" /></div>

  return (
    <div>
      <PageHeader
        title="Agenda"
        subtitle="Consultas, retornos, exames e procedimentos programados."
        actions={<Button icon={Plus} onClick={() => setOpen(true)}>Nova consulta</Button>}
      />

      <div className="mb-5">
        <SegmentedControl value={range} onChange={setRange} options={[{ value: 'dia', label: 'Dia' }, { value: 'semana', label: 'Semana' }, { value: 'mes', label: 'Mês' }]} />
      </div>

      {grouped.length === 0 ? (
        <EmptyState icon={CalendarClock} title="Nenhum agendamento" description="Não há eventos programados para este período." action={<Button icon={Plus} onClick={() => setOpen(true)}>Nova consulta</Button>} />
      ) : (
        <div className="space-y-6">
          {grouped.map(([day, items]) => (
            <section key={day}>
              <div className="mb-2 flex items-center gap-2">
                <h2 className="text-sm font-bold text-ink">{capitalize(formatWeekday(day))}</h2>
                <span className="text-sm text-muted">{formatDate(day)}</span>
                <span className="ml-auto text-xs font-semibold text-faint">{items.length} evento{items.length > 1 ? 's' : ''}</span>
              </div>
              <div className="card divide-y divide-line overflow-hidden">
                {items.map((a) => {
                  const pet = pets.find((p) => p.id === a.petId)
                  const tutor = tutors.find((t) => t.id === a.tutorId)
                  if (!pet) return null
                  return (
                    <div key={a.id} className="flex items-center gap-4 px-5 py-3.5">
                      <div className="w-14 shrink-0 text-center"><div className="font-display text-lg font-bold text-ink">{formatTime(a.datetime)}</div><div className="text-[11px] text-faint">{a.durationMin}min</div></div>
                      <span className="h-10 w-1 rounded-full bg-brand-500/70" />
                      <Link to={`/pets/${pet.id}`}><PetAvatar pet={pet} size="sm" /></Link>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink">{pet.name} <span className="font-normal text-muted">· {appointmentTypeLabel[a.type]}</span></p>
                        <p className="truncate text-xs text-muted">{tutor?.name} · {a.vet}</p>
                      </div>
                      <span className={cn('chip shrink-0', statusChip[a.status])}>{statusLabel[a.status]}</span>
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      <NewAppointmentModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}

function NewAppointmentModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { pets, addAppointment, user } = useStore()
  const toast = useToast()
  const [petId, setPetId] = useState('')
  const [type, setType] = useState<AppointmentType>('consulta')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [time, setTime] = useState('09:00')

  const save = () => {
    const pet = pets.find((p) => p.id === petId)
    if (!pet) return toast({ kind: 'warning', title: 'Selecione um animal' })
    addAppointment({ petId: pet.id, tutorId: pet.tutorId, vet: user.name, datetime: new Date(`${date}T${time}`).toISOString(), durationMin: 30, type, status: 'agendado' })
    toast({ kind: 'success', title: 'Consulta agendada', message: `${pet.name} · ${date} ${time}` })
    onClose(); setPetId('')
  }

  return (
    <Modal open={open} onClose={onClose} title="Nova consulta" description="Agende um atendimento para um animal."
      footer={<><Button variant="outline" onClick={onClose}>Cancelar</Button><Button onClick={save}>Agendar</Button></>}>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Animal" required className="col-span-2">
          {(id) => (
            <Select id={id} value={petId} onChange={(e) => setPetId(e.target.value)}>
              <option value="">Selecione…</option>
              {pets.map((p) => <option key={p.id} value={p.id}>{p.name} · {p.id}</option>)}
            </Select>
          )}
        </Field>
        <Field label="Tipo" className="col-span-2">
          {(id) => (
            <Select id={id} value={type} onChange={(e) => setType(e.target.value as AppointmentType)}>
              {(Object.keys(appointmentTypeLabel) as AppointmentType[]).map((t) => <option key={t} value={t}>{appointmentTypeLabel[t]}</option>)}
            </Select>
          )}
        </Field>
        <Field label="Data">{(id) => <Input id={id} type="date" value={date} onChange={(e) => setDate(e.target.value)} />}</Field>
        <Field label="Hora">{(id) => <Input id={id} type="time" value={time} onChange={(e) => setTime(e.target.value)} />}</Field>
      </div>
    </Modal>
  )
}
