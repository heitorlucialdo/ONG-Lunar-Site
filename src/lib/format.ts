import type {
  Base,
  ClinicalStatus,
  Porte,
  Priority,
  Species,
  Stage,
  Temperamento,
  TaskStatus,
  VaccineStatus,
  MedicationStatus,
  AppointmentType,
} from '@/data/types'

const dateFmt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
const dateShortFmt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' })
const timeFmt = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' })
const monthFmt = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' })
const weekdayFmt = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' })

export const formatDate = (iso?: string) => (iso ? dateFmt.format(new Date(iso)) : '—')
export const formatDateShort = (iso?: string) => (iso ? dateShortFmt.format(new Date(iso)) : '—')
export const formatTime = (iso?: string) => (iso ? timeFmt.format(new Date(iso)) : '—')
export const formatMonth = (iso?: string) => (iso ? monthFmt.format(new Date(iso)) : '—')
export const formatWeekday = (iso?: string) => (iso ? weekdayFmt.format(new Date(iso)) : '—')

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export const sexToLabel = (sex: 'macho' | 'femea') => (sex === 'macho' ? 'Macho' : 'Fêmea')

export function relativeFromNow(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now()
  const abs = Math.abs(diff)
  const min = Math.round(abs / 60000)
  const hrs = Math.round(abs / 3600000)
  const days = Math.round(abs / 86400000)
  const suffix = diff >= 0 ? 'em' : 'há'
  const tail = diff >= 0 ? '' : ''
  const label =
    min < 60 ? `${min} min` : hrs < 24 ? `${hrs} h` : `${days} ${days === 1 ? 'dia' : 'dias'}`
  return diff >= 0 ? `${suffix} ${label}` : `${suffix} ${label}${tail}`
}

export const weight = (kg: number) =>
  `${kg.toLocaleString('pt-BR', { minimumFractionDigits: kg % 1 === 0 ? 0 : 1, maximumFractionDigits: 1 })} kg`

// ── Human-readable labels ──────────────────────────────────────────────
export const speciesLabel: Record<Species, string> = {
  cachorro: 'Cão',
  gato: 'Gato',
  coelho: 'Coelho',
  ave: 'Ave',
  roedor: 'Roedor',
  outro: 'Outro',
}

export const clinicalStatusLabel: Record<ClinicalStatus, string> = {
  saudavel: 'Saudável',
  observacao: 'Em observação',
  internado: 'Em tratamento',
  critico: 'Crítico',
  alta: 'Apto p/ adoção',
}

// Etapas do ciclo de acolhimento (Kanban de logística do abrigo)
export const stageLabel: Record<Stage, string> = {
  triagem: 'Triagem',
  consultorio: 'Avaliação',
  internacao: 'Tratamento',
  canil: 'Alojamento',
  isolamento: 'Isolamento',
  observacao: 'Observação',
  alta: 'Apto p/ adoção',
}

export const baseLabel: Record<Base, string> = {
  ong: 'ONG Lunaar',
  recanto: 'Recanto',
}

export const porteLabel: Record<Porte, string> = {
  P: 'Pequeno',
  M: 'Médio',
  G: 'Grande',
}

export const temperamentoLabel: Record<Temperamento, string> = {
  docil: 'Dócil',
  ativo: 'Ativo',
}

export const priorityLabel: Record<Priority, string> = {
  baixa: 'Baixa',
  normal: 'Normal',
  alta: 'Alta',
  critica: 'Crítica',
}

export const taskStatusLabel: Record<TaskStatus, string> = {
  pendente: 'Pendente',
  'em-andamento': 'Em andamento',
  concluida: 'Concluída',
}

export const vaccineStatusLabel: Record<VaccineStatus, string> = {
  'em-dia': 'Em dia',
  proxima: 'Próxima',
  atrasada: 'Atrasada',
}

export const medStatusLabel: Record<MedicationStatus, string> = {
  administrado: 'Administrado',
  pendente: 'Pendente',
  atrasado: 'Atrasado',
}

export const appointmentTypeLabel: Record<AppointmentType, string> = {
  consulta: 'Consulta',
  retorno: 'Retorno',
  exame: 'Exame',
  procedimento: 'Procedimento',
  internacao: 'Internação',
  alta: 'Alta',
  vacina: 'Vacina',
}
