import { AlertTriangle, Calendar, HeartPulse, Pill, Scale, Syringe, type LucideIcon } from 'lucide-react'
import type { AlertType } from '@/data/types'

export const alertIconMeta: Record<AlertType, { icon: LucideIcon; soft: string }> = {
  critico: { icon: HeartPulse, soft: 'bg-danger-soft text-danger' },
  medicamento: { icon: Pill, soft: 'bg-info-soft text-info' },
  vacina: { icon: Syringe, soft: 'bg-warning-soft text-warning' },
  peso: { icon: Scale, soft: 'bg-brand-50 text-brand-600' },
  alta: { icon: AlertTriangle, soft: 'bg-success-soft text-success' },
  consulta: { icon: Calendar, soft: 'bg-info-soft text-info' },
}
