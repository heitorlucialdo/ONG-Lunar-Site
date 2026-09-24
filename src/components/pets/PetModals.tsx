import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Field, Input, Select, Textarea } from '@/components/ui/Field'
import { useStore } from '@/services/store'
import { useToast } from '@/components/ui/Toast'
import type { Pet, Stage, VaccineStatus } from '@/data/types'
import { stageLabel } from '@/lib/format'

const nowTime = () => {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
const today = () => new Date().toISOString().slice(0, 10)

export function AddWeightModal({ pet, open, onClose }: { pet: Pet; open: boolean; onClose: () => void }) {
  const { addWeight, user } = useStore()
  const toast = useToast()
  const [kg, setKg] = useState('')
  const [date, setDate] = useState(today())
  const [time, setTime] = useState(nowTime())
  const [note, setNote] = useState('')

  const save = () => {
    const value = Number(kg.replace(',', '.'))
    if (!value || Number.isNaN(value)) return toast({ kind: 'warning', title: 'Peso inválido', message: 'Informe um valor numérico.' })
    addWeight(pet.id, { kg: value, date, time, note: note.trim() || undefined, author: user.name })
    toast({ kind: 'success', title: 'Peso registrado', message: `${value.toLocaleString('pt-BR')} kg adicionado ao histórico.` })
    setKg(''); setNote(''); onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Registrar peso" description={`Nova medição para ${pet.name}.`}
      footer={<><Button variant="outline" onClick={onClose}>Cancelar</Button><Button onClick={save}>Salvar medição</Button></>}>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Peso (kg)" required className="col-span-2"><Input autoFocus inputMode="decimal" value={kg} onChange={(e) => setKg(e.target.value)} placeholder="12,4" /></Field>
        <Field label="Data"><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
        <Field label="Hora"><Input type="time" value={time} onChange={(e) => setTime(e.target.value)} /></Field>
        <Field label="Observação" className="col-span-2"><Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Opcional" /></Field>
      </div>
    </Modal>
  )
}

export function AddMedicationModal({ pet, open, onClose }: { pet: Pet; open: boolean; onClose: () => void }) {
  const { addMedication, user } = useStore()
  const toast = useToast()
  const [name, setName] = useState('')
  const [dose, setDose] = useState('')
  const [frequency, setFrequency] = useState('12/12h')
  const [times, setTimes] = useState('08:00, 20:00')
  const [start, setStart] = useState(today())
  const [end, setEnd] = useState('')
  const [notes, setNotes] = useState('')

  const save = () => {
    if (!name.trim()) return toast({ kind: 'warning', title: 'Informe o medicamento' })
    addMedication(pet.id, {
      name: name.trim(), dose: dose.trim() || '—', frequency,
      times: times.split(',').map((t) => t.trim()).filter(Boolean),
      startDate: start, endDate: end || undefined, responsible: user.name,
      notes: notes.trim() || undefined, active: true,
    })
    toast({ kind: 'success', title: 'Medicamento adicionado', message: `${name} incluído no protocolo.` })
    setName(''); setDose(''); setNotes(''); onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Adicionar medicamento" description={`Novo medicamento para ${pet.name}.`}
      footer={<><Button variant="outline" onClick={onClose}>Cancelar</Button><Button onClick={save}>Adicionar</Button></>}>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Medicamento" required className="col-span-2"><Input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Amoxicilina 500mg" /></Field>
        <Field label="Dose"><Input value={dose} onChange={(e) => setDose(e.target.value)} placeholder="1 comprimido" /></Field>
        <Field label="Frequência">
          <Select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
            {['24/24h', '12/12h', '8/8h', '6/6h', 'Contínuo', 'Dose única'].map((f) => <option key={f}>{f}</option>)}
          </Select>
        </Field>
        <Field label="Horários" hint="Separe por vírgula" className="col-span-2"><Input value={times} onChange={(e) => setTimes(e.target.value)} placeholder="08:00, 20:00" /></Field>
        <Field label="Início"><Input type="date" value={start} onChange={(e) => setStart(e.target.value)} /></Field>
        <Field label="Término"><Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} /></Field>
        <Field label="Observações" className="col-span-2"><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Opcional" /></Field>
      </div>
    </Modal>
  )
}

export function AddVaccineModal({ pet, open, onClose }: { pet: Pet; open: boolean; onClose: () => void }) {
  const { addVaccine, user } = useStore()
  const toast = useToast()
  const [name, setName] = useState('')
  const [date, setDate] = useState(today())
  const [nextDate, setNextDate] = useState('')
  const [status, setStatus] = useState<VaccineStatus>('em-dia')
  const [notes, setNotes] = useState('')

  const save = () => {
    if (!name.trim()) return toast({ kind: 'warning', title: 'Informe a vacina' })
    addVaccine(pet.id, { name: name.trim(), date, nextDate: nextDate || undefined, status, responsible: user.name, notes: notes.trim() || undefined })
    toast({ kind: 'success', title: 'Vacina registrada', message: name })
    setName(''); setNotes(''); onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Registrar vacina" description={`Nova vacina para ${pet.name}.`}
      footer={<><Button variant="outline" onClick={onClose}>Cancelar</Button><Button onClick={save}>Registrar</Button></>}>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Vacina" required className="col-span-2"><Input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: V10 (Polivalente)" /></Field>
        <Field label="Data de aplicação"><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
        <Field label="Próxima dose"><Input type="date" value={nextDate} onChange={(e) => setNextDate(e.target.value)} /></Field>
        <Field label="Status" className="col-span-2">
          <Select value={status} onChange={(e) => setStatus(e.target.value as VaccineStatus)}>
            <option value="em-dia">Em dia</option><option value="proxima">Próxima</option><option value="atrasada">Atrasada</option>
          </Select>
        </Field>
        <Field label="Observações" className="col-span-2"><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Opcional" /></Field>
      </div>
    </Modal>
  )
}

export function AddConsultationModal({ pet, open, onClose }: { pet: Pet; open: boolean; onClose: () => void }) {
  const { addRecord, user } = useStore()
  const toast = useToast()
  const [complaint, setComplaint] = useState('')
  const [symptoms, setSymptoms] = useState('')
  const [diagnosis, setDiagnosis] = useState('')
  const [temp, setTemp] = useState('')
  const [hr, setHr] = useState('')
  const [rr, setRr] = useState('')
  const [w, setW] = useState('')
  const [rec, setRec] = useState('')

  const save = () => {
    if (!complaint.trim()) return toast({ kind: 'warning', title: 'Informe a queixa principal' })
    addRecord(pet.id, {
      date: new Date().toISOString(), vet: user.name, complaint: complaint.trim(),
      symptoms: symptoms.trim() || undefined, diagnosis: diagnosis.trim() || undefined,
      temperature: temp ? Number(temp.replace(',', '.')) : undefined,
      heartRate: hr ? Number(hr) : undefined, respRate: rr ? Number(rr) : undefined,
      weight: w ? Number(w.replace(',', '.')) : undefined, recommendations: rec.trim() || undefined,
    })
    toast({ kind: 'success', title: 'Consulta registrada', message: `Prontuário de ${pet.name} atualizado.` })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} size="lg" title="Nova consulta" description={`Registro clínico para ${pet.name}. Preencha com as informações do profissional.`}
      footer={<><Button variant="outline" onClick={onClose}>Cancelar</Button><Button onClick={save}>Registrar consulta</Button></>}>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Queixa principal" required className="col-span-2"><Input autoFocus value={complaint} onChange={(e) => setComplaint(e.target.value)} placeholder="Motivo do atendimento" /></Field>
        <Field label="Sintomas" className="col-span-2"><Textarea value={symptoms} onChange={(e) => setSymptoms(e.target.value)} /></Field>
        <Field label="Diagnóstico" className="col-span-2"><Textarea value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="Registrado pelo veterinário" /></Field>
        <Field label="Temperatura (°C)"><Input inputMode="decimal" value={temp} onChange={(e) => setTemp(e.target.value)} placeholder="38,5" /></Field>
        <Field label="Peso (kg)"><Input inputMode="decimal" value={w} onChange={(e) => setW(e.target.value)} placeholder="12,4" /></Field>
        <Field label="Freq. cardíaca (bpm)"><Input inputMode="numeric" value={hr} onChange={(e) => setHr(e.target.value)} placeholder="90" /></Field>
        <Field label="Freq. respiratória (rpm)"><Input inputMode="numeric" value={rr} onChange={(e) => setRr(e.target.value)} placeholder="28" /></Field>
        <Field label="Recomendações" className="col-span-2"><Textarea value={rec} onChange={(e) => setRec(e.target.value)} /></Field>
      </div>
    </Modal>
  )
}

const STAGES: Stage[] = ['triagem', 'consultorio', 'internacao', 'canil', 'isolamento', 'observacao', 'alta']

export function ChangeLocationModal({ pet, open, onClose }: { pet: Pet; open: boolean; onClose: () => void }) {
  const { updateLocation } = useStore()
  const toast = useToast()
  const [setor, setSetor] = useState(pet.location.setor)
  const [canil, setCanil] = useState(pet.location.canil ?? '')
  const [box, setBox] = useState(pet.location.box ?? '')
  const [sala, setSala] = useState(pet.location.sala ?? '')
  const [stage, setStage] = useState<Stage>(pet.stage)

  const save = () => {
    updateLocation(pet.id, { setor: setor.trim() || 'Recepção', canil: canil.trim() || undefined, box: box.trim() || undefined, sala: sala.trim() || undefined }, stage)
    toast({ kind: 'success', title: 'Localização atualizada', message: `${pet.name} movido para ${setor}.` })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Alterar localização" description={`Onde está ${pet.name} agora?`}
      footer={<><Button variant="outline" onClick={onClose}>Cancelar</Button><Button onClick={save}>Salvar</Button></>}>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Etapa (Kanban)" className="col-span-2">
          <Select value={stage} onChange={(e) => setStage(e.target.value as Stage)}>
            {STAGES.map((s) => <option key={s} value={s}>{stageLabel[s]}</option>)}
          </Select>
        </Field>
        <Field label="Setor"><Input value={setor} onChange={(e) => setSetor(e.target.value)} placeholder="Internação" /></Field>
        <Field label="Canil"><Input value={canil} onChange={(e) => setCanil(e.target.value)} placeholder="Canil B" /></Field>
        <Field label="Box"><Input value={box} onChange={(e) => setBox(e.target.value)} placeholder="Box 04" /></Field>
        <Field label="Sala"><Input value={sala} onChange={(e) => setSala(e.target.value)} placeholder="Sala 2" /></Field>
      </div>
    </Modal>
  )
}

export function UploadDocModal({ pet, open, onClose }: { pet: Pet; open: boolean; onClose: () => void }) {
  const { addDocument, user } = useStore()
  const toast = useToast()
  const [name, setName] = useState('')
  const [kind, setKind] = useState<Pet['documents'][number]['kind']>('exame')

  const onFile = (file?: File) => {
    if (!file) return
    setName(file.name)
    addDocument(pet.id, { name: file.name, kind, sizeKb: Math.max(1, Math.round(file.size / 1024)), uploadedAt: new Date().toISOString(), by: user.name })
    toast({ kind: 'success', title: 'Documento enviado', message: file.name })
    setName(''); onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Enviar documento" description={`Anexar arquivo ao histórico de ${pet.name}.`}
      footer={<Button variant="outline" onClick={onClose}>Fechar</Button>}>
      <Field label="Tipo de documento" className="mb-4">
        <Select value={kind} onChange={(e) => setKind(e.target.value as typeof kind)}>
          <option value="exame">Exame</option><option value="receituario">Receituário</option>
          <option value="laudo">Laudo</option><option value="foto">Foto</option><option value="documento">Documento</option>
        </Select>
      </Field>
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line-strong bg-surface-2/40 px-6 py-10 text-center transition-colors hover:border-brand-300 hover:bg-brand-50/40">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
        </span>
        <span className="text-sm font-semibold text-ink">Clique para enviar</span>
        <span className="text-xs text-muted">{name || 'PDF, JPG ou PNG até 10 MB'}</span>
        <input type="file" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      </label>
    </Modal>
  )
}
