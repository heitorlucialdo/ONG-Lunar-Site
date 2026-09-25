import { useMemo, useState } from 'react'
import {
  Building2, ChevronDown, DoorOpen, LayoutGrid, MapPin, MoreVertical, Pencil, Plus, Trash2, Warehouse,
} from 'lucide-react'
import { useStore } from '@/services/store'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Field, Input, Select, Textarea } from '@/components/ui/Field'
import { Popover } from '@/components/ui/Popover'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { ProgressBar, EmptyState, Skeleton } from '@/components/ui/Feedback'
import { useToast } from '@/components/ui/Toast'
import { alaKindLabel, baseLabel } from '@/lib/format'
import type { Ala, AlaKind, Sede, Setor } from '@/data/types'
import { cn } from '@/lib/cn'

type ModalState =
  | { kind: 'sede'; editing?: Sede }
  | { kind: 'setor'; sedeId: string; editing?: Setor }
  | { kind: 'ala'; sedeId: string; setorId: string; editing?: Ala }
  | null

export function Locais() {
  const { sedes, setores, alas, base, loading, deleteSede, deleteSetor, deleteAla } = useStore()
  const toast = useToast()
  const [modal, setModal] = useState<ModalState>(null)
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const [confirm, setConfirm] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null)

  const totals = useMemo(() => {
    const cap = alas.reduce((n, a) => n + a.capacity, 0)
    const occ = alas.reduce((n, a) => n + a.occupied, 0)
    return { sedes: sedes.length, setores: setores.length, alas: alas.length, cap, occ, pct: cap ? Math.round((occ / cap) * 100) : 0 }
  }, [sedes, setores, alas])

  const toggle = (id: string) => setCollapsed((prev) => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  if (loading) return <div className="space-y-4"><Skeleton className="h-24" /><Skeleton className="h-96" /></div>

  return (
    <div>
      <PageHeader
        title="Locais"
        subtitle={`Cadastro da estrutura física — sedes, setores e alas/canis de ${baseLabel[base]}.`}
        actions={<Button icon={Plus} onClick={() => setModal({ kind: 'sede' })}>Nova sede</Button>}
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon={Building2} label="Sedes" value={totals.sedes} />
        <Stat icon={LayoutGrid} label="Setores" value={totals.setores} />
        <Stat icon={Warehouse} label="Alas / Canis" value={totals.alas} />
        <Stat icon={DoorOpen} label="Ocupação geral" value={`${totals.occ}/${totals.cap}`} hint={`${totals.pct}%`} />
      </div>

      {sedes.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="Nenhuma sede cadastrada"
          description="Comece cadastrando a sede desta base. Depois adicione setores e alas."
          action={<Button icon={Plus} onClick={() => setModal({ kind: 'sede' })}>Cadastrar sede</Button>}
        />
      ) : (
        <div className="space-y-4">
          {sedes.map((sede) => {
            const sedeSetores = setores.filter((s) => s.sedeId === sede.id)
            const isCollapsed = collapsed.has(sede.id)
            const sedeAlas = alas.filter((a) => a.sedeId === sede.id)
            const cap = sedeAlas.reduce((n, a) => n + a.capacity, 0)
            const occ = sedeAlas.reduce((n, a) => n + a.occupied, 0)
            return (
              <section key={sede.id} className="card overflow-hidden">
                {/* Sede header */}
                <div className="flex items-center gap-3 border-b border-line bg-surface-2/40 px-5 py-4">
                  <button onClick={() => toggle(sede.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-surface-2" aria-label="Expandir">
                    <ChevronDown className={cn('h-5 w-5 transition-transform', isCollapsed && '-rotate-90')} />
                  </button>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><Building2 className="h-5 w-5" /></span>
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate font-bold text-ink">{sede.name}</h2>
                    <p className="truncate text-xs text-muted">{sede.address ?? 'Sem endereço'} · {sedeSetores.length} setores · {occ}/{cap} vagas</p>
                  </div>
                  <Button size="sm" variant="soft" icon={Plus} onClick={() => setModal({ kind: 'setor', sedeId: sede.id })}>Setor</Button>
                  <RowMenu
                    onEdit={() => setModal({ kind: 'sede', editing: sede })}
                    onDelete={() => setConfirm({
                      title: 'Excluir sede',
                      message: `Excluir "${sede.name}" e todos os seus setores e alas? Esta ação não pode ser desfeita.`,
                      onConfirm: () => { deleteSede(sede.id); toast({ kind: 'success', title: 'Sede excluída' }) },
                    })}
                  />
                </div>

                {!isCollapsed && (
                  <div className="divide-y divide-line">
                    {sedeSetores.length === 0 ? (
                      <p className="px-5 py-6 text-center text-sm text-muted">Nenhum setor. Adicione o primeiro setor desta sede.</p>
                    ) : (
                      sedeSetores.map((setor) => {
                        const setorAlas = alas.filter((a) => a.setorId === setor.id)
                        return (
                          <div key={setor.id} className="px-5 py-4">
                            <div className="mb-3 flex items-center gap-2">
                              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600"><LayoutGrid className="h-4 w-4" /></span>
                              <div className="min-w-0 flex-1">
                                <h3 className="truncate text-sm font-bold text-ink">{setor.name}</h3>
                                {setor.description && <p className="truncate text-xs text-muted">{setor.description}</p>}
                              </div>
                              <Button size="sm" variant="ghost" icon={Plus} onClick={() => setModal({ kind: 'ala', sedeId: sede.id, setorId: setor.id })}>Ala</Button>
                              <RowMenu
                                small
                                onEdit={() => setModal({ kind: 'setor', sedeId: sede.id, editing: setor })}
                                onDelete={() => setConfirm({
                                  title: 'Excluir setor',
                                  message: `Excluir "${setor.name}" e suas alas?`,
                                  onConfirm: () => { deleteSetor(setor.id); toast({ kind: 'success', title: 'Setor excluído' }) },
                                })}
                              />
                            </div>

                            {setorAlas.length === 0 ? (
                              <p className="rounded-xl border border-dashed border-line-strong bg-surface-2/30 px-4 py-4 text-center text-xs text-faint">Nenhuma ala neste setor.</p>
                            ) : (
                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                {setorAlas.map((ala) => (
                                  <AlaCard
                                    key={ala.id}
                                    ala={ala}
                                    onEdit={() => setModal({ kind: 'ala', sedeId: sede.id, setorId: setor.id, editing: ala })}
                                    onDelete={() => setConfirm({
                                      title: 'Excluir ala',
                                      message: `Excluir "${ala.name}"?`,
                                      onConfirm: () => { deleteAla(ala.id); toast({ kind: 'success', title: 'Ala excluída' }) },
                                    })}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      })
                    )}
                  </div>
                )}
              </section>
            )
          })}
        </div>
      )}

      {modal?.kind === 'sede' && <SedeModal editing={modal.editing} onClose={() => setModal(null)} />}
      {modal?.kind === 'setor' && <SetorModal sedeId={modal.sedeId} editing={modal.editing} onClose={() => setModal(null)} />}
      {modal?.kind === 'ala' && <AlaModal sedeId={modal.sedeId} setorId={modal.setorId} editing={modal.editing} onClose={() => setModal(null)} />}

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() => confirm?.onConfirm()}
        danger
        title={confirm?.title ?? ''}
        message={confirm?.message ?? ''}
        confirmLabel="Excluir"
      />
    </div>
  )
}

function Stat({ icon: Icon, label, value, hint }: { icon: typeof Building2; label: string; value: string | number; hint?: string }) {
  return (
    <div className="card flex items-center gap-3 p-4">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><Icon className="h-[18px] w-[18px]" strokeWidth={2.1} /></span>
      <div>
        <div className="font-display text-xl font-extrabold leading-none text-ink">{value}</div>
        <div className="mt-1 text-xs text-muted">{label}{hint && <span className="ml-1 font-semibold text-brand-600">{hint}</span>}</div>
      </div>
    </div>
  )
}

function AlaCard({ ala, onEdit, onDelete }: { ala: Ala; onEdit: () => void; onDelete: () => void }) {
  const pct = ala.capacity ? Math.round((ala.occupied / ala.capacity) * 100) : 0
  const tone = pct >= 90 ? 'bg-danger' : pct >= 70 ? 'bg-warning' : 'bg-brand-600'
  return (
    <div className="rounded-xl border border-line p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600"><Warehouse className="h-4 w-4" /></span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-ink">{ala.name}</p>
              <p className="text-xs text-muted">{alaKindLabel[ala.kind]}</p>
            </div>
          </div>
        </div>
        <RowMenu small onEdit={onEdit} onDelete={onDelete} />
      </div>
      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-muted">Ocupação</span>
          <span className={cn('font-bold', pct >= 90 ? 'text-danger' : 'text-ink')}>{ala.occupied}/{ala.capacity}</span>
        </div>
        <ProgressBar value={ala.occupied} max={ala.capacity} tone={tone} />
      </div>
      {ala.notes && <p className="mt-2 truncate text-xs text-faint">{ala.notes}</p>}
    </div>
  )
}

function RowMenu({ onEdit, onDelete, small }: { onEdit: () => void; onDelete: () => void; small?: boolean }) {
  return (
    <Popover
      align="end"
      trigger={({ toggle }) => (
        <button onClick={toggle} className={cn('btn-ghost rounded-lg text-muted', small ? 'h-8 w-8' : 'h-9 w-9')} aria-label="Ações">
          <MoreVertical className={small ? 'h-4 w-4' : 'h-5 w-5'} />
        </button>
      )}
    >
      {(close) => (
        <div className="space-y-1">
          <button onClick={() => { onEdit(); close() }} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-2 hover:bg-surface-2"><Pencil className="h-4 w-4" /> Editar</button>
          <button onClick={() => { onDelete(); close() }} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-danger hover:bg-danger-soft"><Trash2 className="h-4 w-4" /> Excluir</button>
        </div>
      )}
    </Popover>
  )
}

// ── Modais ─────────────────────────────────────────────────────────────
function SedeModal({ editing, onClose }: { editing?: Sede; onClose: () => void }) {
  const { addSede, updateSede } = useStore()
  const toast = useToast()
  const [name, setName] = useState(editing?.name ?? '')
  const [address, setAddress] = useState(editing?.address ?? '')
  const [notes, setNotes] = useState(editing?.notes ?? '')

  const save = () => {
    if (!name.trim()) return toast({ kind: 'warning', title: 'Informe o nome da sede' })
    if (editing) { updateSede(editing.id, { name: name.trim(), address: address.trim() || undefined, notes: notes.trim() || undefined }); toast({ kind: 'success', title: 'Sede atualizada' }) }
    else { addSede({ name: name.trim(), address: address.trim() || undefined, notes: notes.trim() || undefined }); toast({ kind: 'success', title: 'Sede cadastrada', message: name }) }
    onClose()
  }
  return (
    <Modal open onClose={onClose} title={editing ? 'Editar sede' : 'Nova sede'} description="Unidade física da instituição."
      footer={<><Button variant="outline" onClick={onClose}>Cancelar</Button><Button onClick={save}>{editing ? 'Salvar' : 'Cadastrar'}</Button></>}>
      <div className="space-y-4">
        <Field label="Nome da sede" required><Input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Sede ONG Lunaar" /></Field>
        <Field label="Endereço / localização"><Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Cidade — UF" /></Field>
        <Field label="Observações"><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Opcional" /></Field>
      </div>
    </Modal>
  )
}

function SetorModal({ sedeId, editing, onClose }: { sedeId: string; editing?: Setor; onClose: () => void }) {
  const { addSetor, updateSetor } = useStore()
  const toast = useToast()
  const [name, setName] = useState(editing?.name ?? '')
  const [description, setDescription] = useState(editing?.description ?? '')

  const save = () => {
    if (!name.trim()) return toast({ kind: 'warning', title: 'Informe o nome do setor' })
    if (editing) { updateSetor(editing.id, { name: name.trim(), description: description.trim() || undefined }); toast({ kind: 'success', title: 'Setor atualizado' }) }
    else { addSetor({ sedeId, name: name.trim(), description: description.trim() || undefined }); toast({ kind: 'success', title: 'Setor cadastrado', message: name }) }
    onClose()
  }
  return (
    <Modal open onClose={onClose} title={editing ? 'Editar setor' : 'Novo setor'} description="Área dentro da sede (ex.: Alojamento, Tratamento)."
      footer={<><Button variant="outline" onClick={onClose}>Cancelar</Button><Button onClick={save}>{editing ? 'Salvar' : 'Cadastrar'}</Button></>}>
      <div className="space-y-4">
        <Field label="Nome do setor" required><Input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Tratamento" /></Field>
        <Field label="Descrição"><Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Opcional" /></Field>
      </div>
    </Modal>
  )
}

function AlaModal({ sedeId, setorId, editing, onClose }: { sedeId: string; setorId: string; editing?: Ala; onClose: () => void }) {
  const { addAla, updateAla } = useStore()
  const toast = useToast()
  const [name, setName] = useState(editing?.name ?? '')
  const [kind, setKind] = useState<AlaKind>(editing?.kind ?? 'ala')
  const [capacity, setCapacity] = useState(String(editing?.capacity ?? ''))
  const [notes, setNotes] = useState(editing?.notes ?? '')

  const save = () => {
    if (!name.trim()) return toast({ kind: 'warning', title: 'Informe o nome da ala' })
    const cap = Number(capacity) || 0
    if (editing) { updateAla(editing.id, { name: name.trim(), kind, capacity: cap, notes: notes.trim() || undefined }); toast({ kind: 'success', title: 'Ala atualizada' }) }
    else { addAla({ sedeId, setorId, name: name.trim(), kind, capacity: cap, occupied: 0, notes: notes.trim() || undefined }); toast({ kind: 'success', title: 'Ala cadastrada', message: name }) }
    onClose()
  }
  return (
    <Modal open onClose={onClose} title={editing ? 'Editar ala / canil' : 'Nova ala / canil'} description="Espaço físico de alojamento, com tamanho definido."
      footer={<><Button variant="outline" onClick={onClose}>Cancelar</Button><Button onClick={save}>{editing ? 'Salvar' : 'Cadastrar'}</Button></>}>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nome" required className="col-span-2 sm:col-span-1"><Input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Ala A" /></Field>
        <Field label="Tipo" className="col-span-2 sm:col-span-1">
          <Select value={kind} onChange={(e) => setKind(e.target.value as AlaKind)}>
            {(['ala', 'canil', 'baia', 'recinto', 'isolamento'] as AlaKind[]).map((k) => <option key={k} value={k}>{alaKindLabel[k]}</option>)}
          </Select>
        </Field>
        <Field label="Tamanho (vagas)" required hint="Capacidade total de alojamento" className="col-span-2 sm:col-span-1"><Input inputMode="numeric" value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="10" /></Field>
        <Field label="Observações" className="col-span-2"><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Opcional" /></Field>
      </div>
      <p className="mt-4 rounded-xl bg-brand-50/60 px-3.5 py-2.5 text-xs text-brand-700">
        A ocupação é calculada automaticamente pelos animais alocados nesta ala (em Pets → Alterar localização).
      </p>
    </Modal>
  )
}
