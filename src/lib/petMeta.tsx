import { Bird, Cat, Dog, PawPrint, Rabbit, Rat, type LucideIcon } from 'lucide-react'
import type { ClinicalStatus, Priority, Species, Stage, VaccineStatus, MedicationStatus, TaskStatus } from '@/data/types'

interface SpeciesMeta {
  icon: LucideIcon
  gradient: string // tailwind gradient for avatar
  soft: string // soft chip bg + text
  ring: string
}

export const speciesMeta: Record<Species, SpeciesMeta> = {
  cachorro: { icon: Dog, gradient: 'from-brand-500 to-brand-700', soft: 'bg-brand-50 text-brand-700', ring: 'ring-brand-200' },
  gato: { icon: Cat, gradient: 'from-indigo-400 to-indigo-600', soft: 'bg-indigo-50 text-indigo-700', ring: 'ring-indigo-200' },
  coelho: { icon: Rabbit, gradient: 'from-rose-300 to-rose-500', soft: 'bg-rose-50 text-rose-700', ring: 'ring-rose-200' },
  ave: { icon: Bird, gradient: 'from-teal-400 to-emerald-600', soft: 'bg-teal-50 text-teal-700', ring: 'ring-teal-200' },
  roedor: { icon: Rat, gradient: 'from-amber-300 to-orange-500', soft: 'bg-amber-50 text-amber-700', ring: 'ring-amber-200' },
  outro: { icon: PawPrint, gradient: 'from-slate-400 to-slate-600', soft: 'bg-slate-100 text-slate-700', ring: 'ring-slate-200' },
}

export const statusMeta: Record<ClinicalStatus, { chip: string; dot: string }> = {
  saudavel: { chip: 'bg-success-soft text-success-ink', dot: 'bg-success' },
  observacao: { chip: 'bg-info-soft text-info-ink', dot: 'bg-info' },
  internado: { chip: 'bg-warning-soft text-warning-ink', dot: 'bg-warning' },
  critico: { chip: 'bg-danger-soft text-danger-ink', dot: 'bg-danger' },
  alta: { chip: 'bg-brand-50 text-brand-700', dot: 'bg-brand-500' },
}

export const priorityMeta: Record<Priority, { chip: string; dot: string; bar: string }> = {
  baixa: { chip: 'bg-surface-2 text-muted', dot: 'bg-faint', bar: 'bg-line-strong' },
  normal: { chip: 'bg-info-soft text-info-ink', dot: 'bg-info', bar: 'bg-info' },
  alta: { chip: 'bg-warning-soft text-warning-ink', dot: 'bg-warning', bar: 'bg-warning' },
  critica: { chip: 'bg-danger-soft text-danger-ink', dot: 'bg-danger', bar: 'bg-danger' },
}

export const stageAccent: Record<Stage, string> = {
  triagem: 'bg-info',
  consultorio: 'bg-brand-500',
  internacao: 'bg-warning',
  canil: 'bg-teal-500',
  isolamento: 'bg-danger',
  observacao: 'bg-indigo-500',
  alta: 'bg-success',
}

export const vaccineMeta: Record<VaccineStatus, { chip: string; dot: string }> = {
  'em-dia': { chip: 'bg-success-soft text-success-ink', dot: 'bg-success' },
  proxima: { chip: 'bg-warning-soft text-warning-ink', dot: 'bg-warning' },
  atrasada: { chip: 'bg-danger-soft text-danger-ink', dot: 'bg-danger' },
}

export const medMeta: Record<MedicationStatus, { chip: string }> = {
  administrado: { chip: 'bg-success-soft text-success-ink' },
  pendente: { chip: 'bg-info-soft text-info-ink' },
  atrasado: { chip: 'bg-danger-soft text-danger-ink' },
}

export const taskMeta: Record<TaskStatus, { chip: string; dot: string }> = {
  pendente: { chip: 'bg-surface-2 text-ink-2', dot: 'bg-faint' },
  'em-andamento': { chip: 'bg-info-soft text-info-ink', dot: 'bg-info' },
  concluida: { chip: 'bg-success-soft text-success-ink', dot: 'bg-success' },
}
