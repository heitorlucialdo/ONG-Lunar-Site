import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Check, Copy, QrCode as QrIcon } from 'lucide-react'
import { Drawer } from '@/components/ui/Modal'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Field, Input, Select, Textarea } from '@/components/ui/Field'
import { PetAvatar } from './PetAvatar'
import { QrBadge } from './QrBadge'
import { useStore } from '@/services/store'
import { useToast } from '@/components/ui/Toast'
import { porteLabel, speciesLabel, temperamentoLabel } from '@/lib/format'
import type { Pet, Porte, Sex, Species, Temperamento } from '@/data/types'

interface PetFormContextValue {
  openCreate: () => void
  openEdit: (pet: Pet) => void
}
const PetFormContext = createContext<PetFormContextValue | null>(null)
export const usePetForm = () => {
  const ctx = useContext(PetFormContext)
  if (!ctx) throw new Error('usePetForm must be used within PetFormProvider')
  return ctx
}

const speciesOptions: Species[] = ['cachorro', 'gato', 'coelho', 'ave', 'roedor', 'outro']

interface FormState {
  name: string
  species: Species
  breed: string
  sex: Sex
  porte: Porte
  castrado: boolean
  temperamento: Temperamento
  ageLabel: string
  birthDate: string
  weightKg: string
  description: string
  photoUrl?: string
  tutorId: string
  newTutorName: string
  newTutorPhone: string
  allergies: string
  relatoDores: string
  notes: string
}

const emptyForm: FormState = {
  name: '', species: 'cachorro', breed: '', sex: 'macho', porte: 'M', castrado: false,
  temperamento: 'docil', ageLabel: '', birthDate: '', weightKg: '', description: '',
  photoUrl: undefined, tutorId: '', newTutorName: '', newTutorPhone: '', allergies: '',
  relatoDores: '', notes: '',
}

export function PetFormProvider({ children }: { children: ReactNode }) {
  const { tutors, addPet, updatePet, addTutor } = useStore()
  const toast = useToast()
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Pet | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [created, setCreated] = useState<Pet | null>(null)

  const openCreate = useCallback(() => {
    setEditing(null); setForm(emptyForm); setErrors({}); setCreated(null); setOpen(true)
  }, [])

  const openEdit = useCallback((pet: Pet) => {
    setEditing(pet)
    setForm({
      name: pet.name, species: pet.species, breed: pet.breed, sex: pet.sex,
      porte: pet.porte, castrado: pet.castrado, temperamento: pet.temperamento,
      ageLabel: pet.ageLabel, birthDate: pet.birthDate ?? '', weightKg: String(pet.weightKg),
      description: pet.description ?? '', photoUrl: pet.photoUrl, tutorId: pet.tutorId,
      newTutorName: '', newTutorPhone: '', allergies: pet.allergies.join(', '),
      relatoDores: pet.relatoDores ?? '', notes: pet.notes ?? '',
    })
    setErrors({}); setCreated(null); setOpen(true)
  }, [])

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }))

  const onPhoto = (file?: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => set('photoUrl', reader.result as string)
    reader.readAsDataURL(file)
  }

  const validate = (): boolean => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Informe o nome do animal.'
    if (!form.breed.trim()) e.breed = 'Informe a raça.'
    if (!form.tutorId && !form.newTutorName.trim()) e.tutor = 'Selecione ou cadastre um tutor.'
    if (form.tutorId === '__new__' && !form.newTutorName.trim()) e.tutor = 'Informe o nome do novo tutor.'
    if (form.weightKg && Number.isNaN(Number(form.weightKg.replace(',', '.')))) e.weightKg = 'Peso inválido.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const resolveTutor = (): string => {
    if (form.tutorId && form.tutorId !== '__new__') return form.tutorId
    const t = addTutor({ name: form.newTutorName.trim(), phone: form.newTutorPhone.trim(), email: '' })
    return t.id
  }

  const submit = () => {
    if (!validate()) return
    const weightKg = form.weightKg ? Number(form.weightKg.replace(',', '.')) : 0
    const allergies = form.allergies.split(',').map((s) => s.trim()).filter(Boolean)

    if (editing) {
      updatePet(editing.id, {
        name: form.name.trim(), species: form.species, breed: form.breed.trim(), sex: form.sex,
        porte: form.porte, castrado: form.castrado, temperamento: form.temperamento,
        ageLabel: form.ageLabel.trim() || editing.ageLabel, birthDate: form.birthDate || undefined,
        weightKg, description: form.description.trim() || undefined, photoUrl: form.photoUrl,
        tutorId: form.tutorId && form.tutorId !== '__new__' ? form.tutorId : resolveTutor(),
        allergies, relatoDores: form.relatoDores.trim() || undefined, notes: form.notes.trim() || undefined,
      })
      toast({ kind: 'success', title: 'Animal atualizado', message: `${form.name} foi salvo.` })
      setOpen(false)
      return
    }

    const tutorId = resolveTutor()
    const pet = addPet({
      name: form.name.trim(), species: form.species, breed: form.breed.trim(), sex: form.sex,
      porte: form.porte, castrado: form.castrado, temperamento: form.temperamento,
      ageLabel: form.ageLabel.trim() || 'Não informada', birthDate: form.birthDate || undefined,
      weightKg, description: form.description.trim() || undefined, photoUrl: form.photoUrl,
      tutorId, allergies, relatoDores: form.relatoDores.trim() || undefined, notes: form.notes.trim() || undefined,
      status: 'saudavel', stage: 'triagem', priority: 'normal',
      location: { setor: 'Triagem' },
    })
    toast({ kind: 'success', title: 'Animal cadastrado', message: `Código ${pet.id} gerado.` })
    setCreated(pet)
  }

  const copyId = (id: string) => {
    navigator.clipboard?.writeText(id)
    toast({ kind: 'info', title: 'Código copiado', message: id })
  }

  const value = useMemo(() => ({ openCreate, openEdit }), [openCreate, openEdit])

  return (
    <PetFormContext.Provider value={value}>
      {children}
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        size="md"
        title={created ? 'Animal cadastrado' : editing ? 'Editar animal' : 'Cadastrar animal'}
        description={created ? undefined : 'Preencha as informações do animal. O código é gerado automaticamente.'}
        footer={
          created ? undefined : (
            <>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button icon={Check} onClick={submit}>{editing ? 'Salvar alterações' : 'Cadastrar animal'}</Button>
            </>
          )
        }
      >
        {created ? (
          <CreatedView pet={created} onCopy={() => copyId(created.id)} onAnother={openCreate} onView={() => { setOpen(false); navigate(`/pets/${created.id}`) }} />
        ) : (
          <div className="space-y-5">
            {/* Foto */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="group relative"
                aria-label="Enviar foto"
              >
                <PetAvatar pet={{ name: form.name || 'Pet', species: form.species, photoUrl: form.photoUrl }} size="xl" />
                <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white shadow-raise ring-2 ring-white transition-transform group-hover:scale-105">
                  <Camera className="h-4 w-4" />
                </span>
              </button>
              <div className="text-sm text-muted">
                <p className="font-semibold text-ink">Foto do animal</p>
                <p className="mt-0.5">Opcional. JPG ou PNG.</p>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onPhoto(e.target.files?.[0])} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Nome" required error={errors.name} className="col-span-2 sm:col-span-1">
                {(id) => <Input id={id} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Ex.: Luna" invalid={!!errors.name} />}
              </Field>
              <Field label="Sexo" className="col-span-2 sm:col-span-1">
                {(id) => (
                  <Select id={id} value={form.sex} onChange={(e) => set('sex', e.target.value as Sex)}>
                    <option value="macho">Macho</option>
                    <option value="femea">Fêmea</option>
                  </Select>
                )}
              </Field>
              <Field label="Espécie" required className="col-span-2 sm:col-span-1">
                {(id) => (
                  <Select id={id} value={form.species} onChange={(e) => set('species', e.target.value as Species)}>
                    {speciesOptions.map((s) => <option key={s} value={s}>{speciesLabel[s]}</option>)}
                  </Select>
                )}
              </Field>
              <Field label="Raça" required error={errors.breed} className="col-span-2 sm:col-span-1">
                {(id) => <Input id={id} value={form.breed} onChange={(e) => set('breed', e.target.value)} placeholder="Ex.: Border Collie" invalid={!!errors.breed} />}
              </Field>
              <Field label="Idade" hint="Ex.: 3 anos" className="col-span-2 sm:col-span-1">
                {(id) => <Input id={id} value={form.ageLabel} onChange={(e) => set('ageLabel', e.target.value)} placeholder="3 anos" />}
              </Field>
              <Field label="Data de nascimento" className="col-span-2 sm:col-span-1">
                {(id) => <Input id={id} type="date" value={form.birthDate} onChange={(e) => set('birthDate', e.target.value)} />}
              </Field>
              <Field label="Peso (kg)" error={errors.weightKg} className="col-span-2 sm:col-span-1">
                {(id) => <Input id={id} inputMode="decimal" value={form.weightKg} onChange={(e) => set('weightKg', e.target.value)} placeholder="12,4" invalid={!!errors.weightKg} />}
              </Field>
              <Field label="Porte" className="col-span-2 sm:col-span-1">
                {(id) => (
                  <Select id={id} value={form.porte} onChange={(e) => set('porte', e.target.value as Porte)}>
                    {(['P', 'M', 'G'] as Porte[]).map((p) => <option key={p} value={p}>{p} — {porteLabel[p]}</option>)}
                  </Select>
                )}
              </Field>
              <Field label="Temperamento" className="col-span-2 sm:col-span-1">
                {(id) => (
                  <Select id={id} value={form.temperamento} onChange={(e) => set('temperamento', e.target.value as Temperamento)}>
                    <option value="docil">Dócil</option><option value="ativo">Ativo</option>
                  </Select>
                )}
              </Field>
            </div>

            <label className="flex items-center justify-between rounded-xl border border-line bg-surface-2/50 px-4 py-3">
              <span className="text-sm font-semibold text-ink">Animal castrado</span>
              <button
                type="button"
                role="switch"
                aria-checked={form.castrado}
                onClick={() => set('castrado', !form.castrado)}
                className={`relative h-6 w-11 rounded-full transition-colors ${form.castrado ? 'bg-brand-600' : 'bg-line-strong'}`}
              >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${form.castrado ? 'left-[22px]' : 'left-0.5'}`} />
              </button>
            </label>

            <Field label="Tutor / responsável" required error={errors.tutor}>
              {(id) => (
                <Select id={id} value={form.tutorId} onChange={(e) => set('tutorId', e.target.value)}>
                  <option value="">Selecione um tutor…</option>
                  {tutors.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  <option value="__new__">+ Cadastrar novo tutor</option>
                </Select>
              )}
            </Field>

            {form.tutorId === '__new__' && (
              <div className="grid grid-cols-2 gap-4 rounded-xl bg-surface-2/70 p-4">
                <Field label="Nome do tutor" required className="col-span-2 sm:col-span-1">
                  {(id) => <Input id={id} value={form.newTutorName} onChange={(e) => set('newTutorName', e.target.value)} placeholder="Nome completo" />}
                </Field>
                <Field label="Telefone" className="col-span-2 sm:col-span-1">
                  {(id) => <Input id={id} value={form.newTutorPhone} onChange={(e) => set('newTutorPhone', e.target.value)} placeholder="(11) 90000-0000" />}
                </Field>
              </div>
            )}

            <Field label="Alergias" hint="Separe por vírgula. Ex.: Dipirona, Frango">
              {(id) => <Input id={id} value={form.allergies} onChange={(e) => set('allergies', e.target.value)} placeholder="Nenhuma conhecida" />}
            </Field>
            <Field label="Relato de dores" hint="Se houver, descreva">
              {(id) => <Input id={id} value={form.relatoDores} onChange={(e) => set('relatoDores', e.target.value)} placeholder="Ex.: Claudicação de pata dianteira" />}
            </Field>
            <Field label="Descrição">
              {(id) => <Textarea id={id} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Comportamento, temperamento, motivo da visita…" />}
            </Field>
            <Field label="Observações importantes">
              {(id) => <Textarea id={id} value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Informações que a equipe deve saber." />}
            </Field>
          </div>
        )}
      </Drawer>
    </PetFormContext.Provider>
  )
}

function CreatedView({ pet, onCopy, onAnother, onView }: { pet: Pet; onCopy: () => void; onAnother: () => void; onView: () => void }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative">
        <PetAvatar pet={pet} size="xl" />
        <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-success text-white shadow-raise ring-2 ring-white">
          <Check className="h-4 w-4" />
        </span>
      </div>
      <h3 className="mt-4 text-xl font-bold text-ink">{pet.name}</h3>
      <p className="text-sm text-muted">{speciesLabel[pet.species]} · {pet.breed}</p>

      <div className="mt-5 flex items-center gap-2 rounded-xl border border-line bg-surface-2/70 px-3 py-2">
        <span className="font-mono text-sm font-semibold tracking-wide text-ink">{pet.id}</span>
        <button onClick={onCopy} className="btn-soft h-8 px-2.5 text-xs"><Copy className="h-3.5 w-3.5" /> Copiar ID</button>
      </div>

      <div className="mt-6 flex flex-col items-center gap-2">
        <QrBadge value={pet.id} size={132} />
        <p className="flex items-center gap-1.5 text-xs text-faint"><QrIcon className="h-3.5 w-3.5" /> Identificação rápida do animal</p>
      </div>

      <div className="mt-7 flex w-full gap-3">
        <Button variant="outline" className="flex-1" onClick={onAnother}>Cadastrar outro</Button>
        <ButtonLink to={`/pets/${pet.id}`} className="flex-1" onClick={onView}>Ver perfil</ButtonLink>
      </div>
    </div>
  )
}
