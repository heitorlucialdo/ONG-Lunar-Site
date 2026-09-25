import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { repository, type Snapshot } from './repository'
import { formatPetCode, uid } from '@/lib/id'
import { nextPetSeq } from '@/data/seed'
import type {
  Ala,
  Alert,
  Appointment,
  AppUser,
  Base,
  MedicalRecord,
  Medication,
  Pet,
  Sede,
  Setor,
  Stage,
  Task,
  TaskStatus,
  TimelineEvent,
  Tutor,
  Vaccine,
  WeightEntry,
} from '@/data/types'
import { stageLabel } from '@/lib/format'

type NewPetInput = Omit<
  Pet,
  'id' | 'createdAt' | 'base' | 'intakeDate' | 'weights' | 'medications' | 'vaccines' | 'records' | 'timeline' | 'documents'
> & { initialWeightNote?: string }

interface StoreValue {
  loading: boolean
  base: Base
  setBase: (base: Base) => void
  pets: Pet[]
  allPets: Pet[]
  tutors: Tutor[]
  appointments: Appointment[]
  tasks: Task[]
  alerts: Alert[]
  sedes: Sede[]
  setores: Setor[]
  alas: Ala[]
  user: AppUser
  // pets
  addPet: (input: NewPetInput) => Pet
  updatePet: (id: string, patch: Partial<Pet>) => void
  deletePet: (id: string) => void
  movePetStage: (id: string, stage: Stage) => void
  updateLocation: (id: string, location: Pet['location'], setorStage?: Stage, alaId?: string) => void
  // nested records
  addWeight: (petId: string, entry: Omit<WeightEntry, 'id'>) => void
  addMedication: (petId: string, med: Omit<Medication, 'id'>) => void
  toggleMedicationActive: (petId: string, medId: string) => void
  addVaccine: (petId: string, vaccine: Omit<Vaccine, 'id'>) => void
  addRecord: (petId: string, record: Omit<MedicalRecord, 'id'>) => void
  addDocument: (petId: string, doc: Omit<Pet['documents'][number], 'id'>) => void
  deleteDocument: (petId: string, docId: string) => void
  // agenda / tasks / alerts / tutors
  addAppointment: (appt: Omit<Appointment, 'id'>) => void
  updateAppointment: (id: string, patch: Partial<Appointment>) => void
  addTask: (task: Omit<Task, 'id'>) => void
  setTaskStatus: (id: string, status: TaskStatus) => void
  markAlertRead: (id: string) => void
  markAllAlertsRead: () => void
  addTutor: (tutor: Omit<Tutor, 'id'>) => Tutor
  updateTutor: (id: string, patch: Partial<Tutor>) => void
  // estrutura física (locais)
  addSede: (sede: Omit<Sede, 'id' | 'base'>) => void
  updateSede: (id: string, patch: Partial<Sede>) => void
  deleteSede: (id: string) => void
  addSetor: (setor: Omit<Setor, 'id' | 'base'>) => void
  updateSetor: (id: string, patch: Partial<Setor>) => void
  deleteSetor: (id: string) => void
  addAla: (ala: Omit<Ala, 'id' | 'base'>) => void
  updateAla: (id: string, patch: Partial<Ala>) => void
  deleteAla: (id: string) => void
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [snap, setSnap] = useState<Snapshot | null>(null)
  const [seq, setSeq] = useState(nextPetSeq)
  const [base, setBase] = useState<Base>('ong')

  useEffect(() => {
    let alive = true
    repository.loadAll().then((data) => {
      if (!alive) return
      setSnap(data)
      setLoading(false)
    })
    return () => {
      alive = false
    }
  }, [])

  const setPets = useCallback((fn: (prev: Pet[]) => Pet[]) => {
    setSnap((s) => (s ? { ...s, pets: fn(s.pets) } : s))
  }, [])

  const patchPet = useCallback(
    (id: string, updater: (p: Pet) => Pet) => {
      setPets((prev) => prev.map((p) => (p.id === id ? updater(p) : p)))
    },
    [setPets],
  )

  const pushTimeline = (p: Pet, ev: Omit<TimelineEvent, 'id'>): Pet => ({
    ...p,
    timeline: [{ id: uid('tl'), ...ev }, ...p.timeline],
  })

  const nowParts = () => {
    const d = new Date()
    return {
      date: d.toISOString().slice(0, 10),
      time: `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`,
    }
  }

  const addPet = useCallback<StoreValue['addPet']>(
    (input) => {
      const id = formatPetCode(seq)
      setSeq((n) => n + 1)
      const { date, time } = nowParts()
      const pet: Pet = {
        ...input,
        id,
        base,
        intakeDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        weights: input.weightKg
          ? [{ id: uid('w'), kg: input.weightKg, date, time, note: input.initialWeightNote, author: 'Recepção' }]
          : [],
        medications: [],
        vaccines: [],
        records: [],
        documents: [],
        timeline: [{ id: uid('tl'), date, time, type: 'cadastro', title: 'Pet cadastrado', description: `Código ${id} gerado.` }],
      }
      setPets((prev) => [pet, ...prev])
      void repository.persistPet(pet)
      return pet
    },
    [seq, base, setPets],
  )

  const updatePet = useCallback<StoreValue['updatePet']>(
    (id, patch) => patchPet(id, (p) => ({ ...p, ...patch })),
    [patchPet],
  )

  const deletePet = useCallback<StoreValue['deletePet']>(
    (id) => {
      setPets((prev) => prev.filter((p) => p.id !== id))
      void repository.removePet(id)
    },
    [setPets],
  )

  const movePetStage = useCallback<StoreValue['movePetStage']>(
    (id, stage) => {
      const { date, time } = nowParts()
      patchPet(id, (p) => {
        if (p.stage === stage) return p
        const status =
          stage === 'alta' ? 'alta'
          : stage === 'isolamento' || stage === 'internacao' ? 'internado'
          : stage === 'observacao' ? 'observacao'
          : p.status
        return pushTimeline(
          { ...p, stage, status },
          { date, time, type: 'transferencia', title: 'Pet transferido', description: `${stageLabel[p.stage]} → ${stageLabel[stage]}` },
        )
      })
    },
    [patchPet],
  )

  const updateLocation = useCallback<StoreValue['updateLocation']>(
    (id, location, setorStage, alaId) => {
      const { date, time } = nowParts()
      patchPet(id, (p) =>
        pushTimeline(
          { ...p, location, stage: setorStage ?? p.stage, alaId },
          { date, time, type: 'transferencia', title: 'Localização alterada', description: [location.setor, location.canil, location.box, location.sala].filter(Boolean).join(' · ') },
        ),
      )
    },
    [patchPet],
  )

  const addWeight = useCallback<StoreValue['addWeight']>(
    (petId, entry) => {
      patchPet(petId, (p) =>
        pushTimeline(
          { ...p, weightKg: entry.kg, weights: [...p.weights, { id: uid('w'), ...entry }] },
          { date: entry.date, time: entry.time, type: 'peso', title: 'Peso atualizado', description: `${entry.kg.toLocaleString('pt-BR')} kg` },
        ),
      )
    },
    [patchPet],
  )

  const addMedication = useCallback<StoreValue['addMedication']>(
    (petId, med) => {
      const { date, time } = nowParts()
      patchPet(petId, (p) =>
        pushTimeline(
          { ...p, medications: [...p.medications, { id: uid('m'), ...med }] },
          { date, time, type: 'medicamento', title: 'Medicamento iniciado', description: `${med.name} — ${med.frequency}` },
        ),
      )
    },
    [patchPet],
  )

  const toggleMedicationActive = useCallback<StoreValue['toggleMedicationActive']>(
    (petId, medId) =>
      patchPet(petId, (p) => ({
        ...p,
        medications: p.medications.map((m) => (m.id === medId ? { ...m, active: !m.active } : m)),
      })),
    [patchPet],
  )

  const addVaccine = useCallback<StoreValue['addVaccine']>(
    (petId, vaccine) => {
      const { date, time } = nowParts()
      patchPet(petId, (p) =>
        pushTimeline(
          { ...p, vaccines: [...p.vaccines, { id: uid('v'), ...vaccine }] },
          { date, time, type: 'vacina', title: 'Vacina registrada', description: vaccine.name },
        ),
      )
    },
    [patchPet],
  )

  const addRecord = useCallback<StoreValue['addRecord']>(
    (petId, record) => {
      patchPet(petId, (p) => {
        const next = pushTimeline(
          { ...p, records: [{ id: uid('r'), ...record }, ...p.records], lastVisit: record.date },
          { date: record.date.slice(0, 10), time: '—', type: 'consulta', title: 'Consulta registrada', description: record.diagnosis || record.complaint },
        )
        return record.weight ? { ...next, weightKg: record.weight } : next
      })
    },
    [patchPet],
  )

  const addDocument = useCallback<StoreValue['addDocument']>(
    (petId, doc) => patchPet(petId, (p) => ({ ...p, documents: [{ id: uid('doc'), ...doc }, ...p.documents] })),
    [patchPet],
  )

  const deleteDocument = useCallback<StoreValue['deleteDocument']>(
    (petId, docId) => patchPet(petId, (p) => ({ ...p, documents: p.documents.filter((d) => d.id !== docId) })),
    [patchPet],
  )

  const addAppointment = useCallback<StoreValue['addAppointment']>((appt) => {
    setSnap((s) => (s ? { ...s, appointments: [...s.appointments, { id: uid('a'), ...appt }] } : s))
  }, [])

  const updateAppointment = useCallback<StoreValue['updateAppointment']>((id, patch) => {
    setSnap((s) => (s ? { ...s, appointments: s.appointments.map((a) => (a.id === id ? { ...a, ...patch } : a)) } : s))
  }, [])

  const addTask = useCallback<StoreValue['addTask']>((task) => {
    setSnap((s) => (s ? { ...s, tasks: [{ id: uid('tk'), ...task }, ...s.tasks] } : s))
  }, [])

  const setTaskStatus = useCallback<StoreValue['setTaskStatus']>((id, status) => {
    setSnap((s) => (s ? { ...s, tasks: s.tasks.map((t) => (t.id === id ? { ...t, status } : t)) } : s))
  }, [])

  const markAlertRead = useCallback<StoreValue['markAlertRead']>((id) => {
    setSnap((s) => (s ? { ...s, alerts: s.alerts.map((a) => (a.id === id ? { ...a, read: true } : a)) } : s))
  }, [])

  const markAllAlertsRead = useCallback<StoreValue['markAllAlertsRead']>(() => {
    setSnap((s) => (s ? { ...s, alerts: s.alerts.map((a) => ({ ...a, read: true })) } : s))
  }, [])

  const addTutor = useCallback<StoreValue['addTutor']>((tutor) => {
    const created: Tutor = { id: uid('tut'), ...tutor }
    setSnap((s) => (s ? { ...s, tutors: [created, ...s.tutors] } : s))
    return created
  }, [])

  const updateTutor = useCallback<StoreValue['updateTutor']>((id, patch) => {
    setSnap((s) => (s ? { ...s, tutors: s.tutors.map((t) => (t.id === id ? { ...t, ...patch } : t)) } : s))
  }, [])

  // ── Estrutura física (Sede → Setor → Ala) ────────────────────────────
  const addSede = useCallback<StoreValue['addSede']>((sede) => {
    setSnap((s) => (s ? { ...s, sedes: [...s.sedes, { id: uid('sede'), base, ...sede }] } : s))
  }, [base])
  const updateSede = useCallback<StoreValue['updateSede']>((id, patch) => {
    setSnap((s) => (s ? { ...s, sedes: s.sedes.map((x) => (x.id === id ? { ...x, ...patch } : x)) } : s))
  }, [])
  const deleteSede = useCallback<StoreValue['deleteSede']>((id) => {
    setSnap((s) => {
      if (!s) return s
      const setorIds = new Set(s.setores.filter((x) => x.sedeId === id).map((x) => x.id))
      return {
        ...s,
        sedes: s.sedes.filter((x) => x.id !== id),
        setores: s.setores.filter((x) => x.sedeId !== id),
        alas: s.alas.filter((x) => x.sedeId !== id && !setorIds.has(x.setorId)),
      }
    })
  }, [])

  const addSetor = useCallback<StoreValue['addSetor']>((setor) => {
    setSnap((s) => (s ? { ...s, setores: [...s.setores, { id: uid('set'), base, ...setor }] } : s))
  }, [base])
  const updateSetor = useCallback<StoreValue['updateSetor']>((id, patch) => {
    setSnap((s) => (s ? { ...s, setores: s.setores.map((x) => (x.id === id ? { ...x, ...patch } : x)) } : s))
  }, [])
  const deleteSetor = useCallback<StoreValue['deleteSetor']>((id) => {
    setSnap((s) => (s ? { ...s, setores: s.setores.filter((x) => x.id !== id), alas: s.alas.filter((x) => x.setorId !== id) } : s))
  }, [])

  const addAla = useCallback<StoreValue['addAla']>((ala) => {
    setSnap((s) => (s ? { ...s, alas: [...s.alas, { id: uid('ala'), base, ...ala }] } : s))
  }, [base])
  const updateAla = useCallback<StoreValue['updateAla']>((id, patch) => {
    setSnap((s) => (s ? { ...s, alas: s.alas.map((x) => (x.id === id ? { ...x, ...patch } : x)) } : s))
  }, [])
  const deleteAla = useCallback<StoreValue['deleteAla']>((id) => {
    setSnap((s) => (s ? { ...s, alas: s.alas.filter((x) => x.id !== id) } : s))
  }, [])

  const value = useMemo<StoreValue>(() => {
    const allPets = snap?.pets ?? []
    // Segregação ONG × Recanto: tudo é filtrado pela base ativa (RF06).
    const inBase = new Set(allPets.filter((p) => p.base === base).map((p) => p.id))
    const pets = allPets.filter((p) => inBase.has(p.id))
    const belongs = (petId?: string) => !petId || inBase.has(petId)
    return {
      loading,
      base,
      setBase,
      allPets,
      pets,
      tutors: snap?.tutors ?? [],
      appointments: (snap?.appointments ?? []).filter((a) => belongs(a.petId)),
      tasks: (snap?.tasks ?? []).filter((t) => belongs(t.petId)),
      alerts: (snap?.alerts ?? []).filter((a) => belongs(a.petId)),
      sedes: (snap?.sedes ?? []).filter((x) => x.base === base),
      setores: (snap?.setores ?? []).filter((x) => x.base === base),
      // ocupação derivada automaticamente dos animais alocados em cada ala
      alas: (snap?.alas ?? [])
        .filter((x) => x.base === base)
        .map((a) => ({ ...a, occupied: pets.filter((p) => p.alaId === a.id).length })),
      user: snap?.user ?? { id: '', name: '', role: 'recepcao', email: '' },
      addPet, updatePet, deletePet, movePetStage, updateLocation,
      addWeight, addMedication, toggleMedicationActive, addVaccine, addRecord,
      addDocument, deleteDocument,
      addAppointment, updateAppointment, addTask, setTaskStatus,
      markAlertRead, markAllAlertsRead, addTutor, updateTutor,
      addSede, updateSede, deleteSede, addSetor, updateSetor, deleteSetor,
      addAla, updateAla, deleteAla,
    }
  }, [
    loading, snap, base, addPet, updatePet, deletePet, movePetStage, updateLocation,
    addWeight, addMedication, toggleMedicationActive, addVaccine, addRecord,
    addDocument, deleteDocument, addAppointment, updateAppointment, addTask,
    setTaskStatus, markAlertRead, markAllAlertsRead, addTutor, updateTutor,
    addSede, updateSede, deleteSede, addSetor, updateSetor, deleteSetor,
    addAla, updateAla, deleteAla,
  ])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

// ── Convenience selectors ──────────────────────────────────────────────
export function usePet(id: string | undefined) {
  const { allPets } = useStore()
  return useMemo(() => allPets.find((p) => p.id === id), [allPets, id])
}

export function useTutor(id: string | undefined) {
  const { tutors } = useStore()
  return useMemo(() => tutors.find((t) => t.id === id), [tutors, id])
}
