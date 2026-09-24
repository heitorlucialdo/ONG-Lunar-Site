import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Circle, CircleDot, ListChecks, Plus } from 'lucide-react'
import { useStore } from '@/services/store'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Field, Input, Select } from '@/components/ui/Field'
import { EmptyState, Skeleton } from '@/components/ui/Feedback'
import { PriorityBadge } from '@/components/pets/PetBadges'
import { useToast } from '@/components/ui/Toast'
import { formatDate, formatTime, taskStatusLabel } from '@/lib/format'
import type { Priority, Task, TaskStatus } from '@/data/types'
import { cn } from '@/lib/cn'

const columns: { status: TaskStatus; icon: typeof Circle; tone: string }[] = [
  { status: 'pendente', icon: Circle, tone: 'text-faint' },
  { status: 'em-andamento', icon: CircleDot, tone: 'text-info' },
  { status: 'concluida', icon: CheckCircle2, tone: 'text-success' },
]
const nextStatus: Record<TaskStatus, TaskStatus> = { pendente: 'em-andamento', 'em-andamento': 'concluida', concluida: 'pendente' }

export function Tasks() {
  const { tasks, pets, setTaskStatus, loading } = useStore()
  const toast = useToast()
  const [open, setOpen] = useState(false)

  if (loading) return <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-80" />)}</div>

  return (
    <div>
      <PageHeader title="Tarefas" subtitle="Central operacional das tarefas da equipe." actions={<Button icon={Plus} onClick={() => setOpen(true)}>Nova tarefa</Button>} />

      {tasks.length === 0 ? (
        <EmptyState icon={ListChecks} title="Nenhuma tarefa" description="Crie a primeira tarefa da equipe." action={<Button icon={Plus} onClick={() => setOpen(true)}>Nova tarefa</Button>} />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {columns.map((col) => {
            const items = tasks.filter((t) => t.status === col.status)
            const Icon = col.icon
            return (
              <div key={col.status} className="rounded-2xl border border-line bg-surface-2/30 p-3">
                <div className="mb-3 flex items-center gap-2 px-1">
                  <Icon className={cn('h-4 w-4', col.tone)} />
                  <h3 className="text-sm font-bold text-ink">{taskStatusLabel[col.status]}</h3>
                  <span className="rounded-full bg-surface px-2 py-0.5 text-xs font-bold text-muted">{items.length}</span>
                </div>
                <div className="space-y-2.5">
                  {items.map((t) => {
                    const pet = t.petId ? pets.find((p) => p.id === t.petId) : undefined
                    return (
                      <div key={t.id} className="rounded-xl border border-line bg-surface p-3.5 shadow-card">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn('text-sm font-semibold text-ink', t.status === 'concluida' && 'text-muted line-through')}>{t.title}</p>
                          <PriorityBadge priority={t.priority} />
                        </div>
                        {pet && <Link to={`/pets/${pet.id}`} className="mt-1 inline-block text-xs font-medium text-brand-600 hover:text-brand-700">{pet.name} · {pet.id}</Link>}
                        <div className="mt-2 flex items-center justify-between border-t border-line pt-2 text-xs text-muted">
                          <span>{t.assignee}</span>
                          <span>{formatDate(t.dueDate)} · {formatTime(t.dueDate)}</span>
                        </div>
                        <button
                          onClick={() => { setTaskStatus(t.id, nextStatus[t.status]); toast({ kind: 'info', title: 'Tarefa atualizada', message: taskStatusLabel[nextStatus[t.status]] }) }}
                          className="mt-2.5 w-full rounded-lg bg-surface-2 py-1.5 text-xs font-semibold text-ink-2 transition-colors hover:bg-brand-50 hover:text-brand-700"
                        >
                          {t.status === 'concluida' ? 'Reabrir' : t.status === 'pendente' ? 'Iniciar' : 'Concluir'}
                        </button>
                      </div>
                    )
                  })}
                  {items.length === 0 && <p className="py-4 text-center text-xs text-faint">Vazio</p>}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <NewTaskModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}

function NewTaskModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { pets, addTask, user } = useStore()
  const toast = useToast()
  const [title, setTitle] = useState('')
  const [petId, setPetId] = useState('')
  const [priority, setPriority] = useState<Priority>('normal')
  const [category, setCategory] = useState<Task['category']>('geral')
  const [due, setDue] = useState(() => new Date(Date.now() + 3600000).toISOString().slice(0, 16))

  const save = () => {
    if (!title.trim()) return toast({ kind: 'warning', title: 'Informe o título da tarefa' })
    addTask({ title: title.trim(), petId: petId || undefined, assignee: user.name, priority, dueDate: new Date(due).toISOString(), status: 'pendente', category })
    toast({ kind: 'success', title: 'Tarefa criada', message: title })
    setTitle(''); setPetId(''); onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Nova tarefa" description="Atribua uma tarefa à equipe."
      footer={<><Button variant="outline" onClick={onClose}>Cancelar</Button><Button onClick={save}>Criar tarefa</Button></>}>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Título" required className="col-span-2">{(id) => <Input id={id} autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: Administrar medicamento" />}</Field>
        <Field label="Animal (opcional)" className="col-span-2">
          {(id) => <Select id={id} value={petId} onChange={(e) => setPetId(e.target.value)}><option value="">Nenhum</option>{pets.map((p) => <option key={p.id} value={p.id}>{p.name} · {p.id}</option>)}</Select>}
        </Field>
        <Field label="Prioridade">{(id) => <Select id={id} value={priority} onChange={(e) => setPriority(e.target.value as Priority)}><option value="baixa">Baixa</option><option value="normal">Normal</option><option value="alta">Alta</option><option value="critica">Crítica</option></Select>}</Field>
        <Field label="Categoria">{(id) => <Select id={id} value={category} onChange={(e) => setCategory(e.target.value as Task['category'])}><option value="geral">Geral</option><option value="medicacao">Medicação</option><option value="exame">Exame</option><option value="higiene">Higiene</option><option value="monitoramento">Monitoramento</option><option value="alta">Alta</option></Select>}</Field>
        <Field label="Prazo" className="col-span-2">{(id) => <Input id={id} type="datetime-local" value={due} onChange={(e) => setDue(e.target.value)} />}</Field>
      </div>
    </Modal>
  )
}
