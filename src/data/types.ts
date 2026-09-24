// ── Domain model for LUNAR ───────────────────────────────────────────────
// Kept framework-agnostic so it can back either the mock store or a real API.

export type Species = 'cachorro' | 'gato' | 'coelho' | 'ave' | 'roedor' | 'outro'
export type Sex = 'macho' | 'femea'

/** Base de dados segregada da instituição (Projeto Lunaar). */
export type Base = 'ong' | 'recanto'

/** Porte físico padronizado do animal. */
export type Porte = 'P' | 'M' | 'G'

/** Perfil comportamental. */
export type Temperamento = 'docil' | 'ativo'

/** Clinical condition of the animal. */
export type ClinicalStatus = 'saudavel' | 'observacao' | 'internado' | 'critico' | 'alta'

/** Operational stage on the logistics Kanban / where the pet physically is. */
export type Stage =
  | 'triagem'
  | 'consultorio'
  | 'internacao'
  | 'canil'
  | 'isolamento'
  | 'observacao'
  | 'alta'

export type Priority = 'baixa' | 'normal' | 'alta' | 'critica'

export interface PetLocation {
  setor: string
  canil?: string
  box?: string
  sala?: string
}

export interface WeightEntry {
  id: string
  kg: number
  date: string // ISO date
  time: string // HH:mm
  note?: string
  author: string
}

export type MedicationStatus = 'administrado' | 'pendente' | 'atrasado'

export interface Medication {
  id: string
  name: string
  dose: string
  frequency: string
  times: string[] // ["08:00","20:00"]
  startDate: string
  endDate?: string
  responsible: string
  notes?: string
  active: boolean
}

export type VaccineStatus = 'em-dia' | 'proxima' | 'atrasada'

export interface Vaccine {
  id: string
  name: string
  date: string
  nextDate?: string
  status: VaccineStatus
  responsible: string
  notes?: string
}

export interface MedicalRecord {
  id: string
  date: string
  vet: string
  complaint: string
  symptoms?: string
  diagnosis?: string
  temperature?: number // °C
  heartRate?: number // bpm
  respRate?: number // rpm
  weight?: number // kg
  procedures?: string[]
  exams?: string[]
  recommendations?: string
  notes?: string
}

export type TimelineType =
  | 'consulta'
  | 'medicamento'
  | 'transferencia'
  | 'peso'
  | 'vacina'
  | 'exame'
  | 'internacao'
  | 'alta'
  | 'cadastro'

export interface TimelineEvent {
  id: string
  date: string
  time: string
  type: TimelineType
  title: string
  description?: string
}

export type DocumentKind = 'exame' | 'receituario' | 'laudo' | 'foto' | 'documento'

export interface PetDocument {
  id: string
  name: string
  kind: DocumentKind
  sizeKb: number
  uploadedAt: string
  by: string
}

export interface Pet {
  id: string // LUN-000124
  name: string
  species: Species
  breed: string
  sex: Sex
  base: Base
  porte: Porte
  castrado: boolean
  temperamento: Temperamento
  intakeDate: string // data de acolhimento/resgate
  relatoDores?: string
  birthDate?: string
  ageLabel: string
  weightKg: number
  photoUrl?: string
  description?: string
  tutorId: string
  allergies: string[]
  notes?: string
  status: ClinicalStatus
  stage: Stage
  location: PetLocation
  priority: Priority
  createdAt: string
  lastVisit?: string
  nextVisit?: string
  weights: WeightEntry[]
  medications: Medication[]
  vaccines: Vaccine[]
  records: MedicalRecord[]
  timeline: TimelineEvent[]
  documents: PetDocument[]
}

export interface Tutor {
  id: string
  name: string
  phone: string
  email: string
  cpf?: string
  address?: string
  notes?: string
}

export type AppointmentType = 'consulta' | 'retorno' | 'exame' | 'procedimento' | 'internacao' | 'alta' | 'vacina'
export type AppointmentStatus = 'agendado' | 'confirmado' | 'em-andamento' | 'concluido' | 'cancelado'

export interface Appointment {
  id: string
  petId: string
  tutorId: string
  vet: string
  datetime: string // ISO
  durationMin: number
  type: AppointmentType
  status: AppointmentStatus
  notes?: string
}

export type TaskStatus = 'pendente' | 'em-andamento' | 'concluida'

export interface Task {
  id: string
  title: string
  petId?: string
  assignee: string
  priority: Priority
  dueDate: string // ISO
  status: TaskStatus
  category: 'medicacao' | 'exame' | 'higiene' | 'alta' | 'monitoramento' | 'geral'
}

export type AlertType = 'vacina' | 'medicamento' | 'peso' | 'alta' | 'consulta' | 'critico'

export interface Alert {
  id: string
  type: AlertType
  priority: Priority
  date: string
  petId?: string
  message: string
  action?: string
  read: boolean
}

export interface Kennel {
  id: string
  name: string
  sector: string
  base: Base
  capacity: number
  occupied: number
}

export type UserRole = 'admin' | 'usuario' | 'veterinario' | 'recepcao' | 'enfermagem'

export interface AppUser {
  id: string
  name: string
  role: UserRole
  email: string
}
