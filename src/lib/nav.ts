import {
  BarChart3,
  Bell,
  Building2,
  Calendar,
  ClipboardList,
  Home,
  KanbanSquare,
  ListChecks,
  PawPrint,
  Pill,
  Settings,
  Syringe,
  Users,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

export const primaryNav: NavItem[] = [
  { to: '/', label: 'Início', icon: Home, end: true },
  { to: '/pets', label: 'Pets', icon: PawPrint },
  { to: '/prontuarios', label: 'Prontuários', icon: ClipboardList },
  { to: '/logistica', label: 'Logística', icon: KanbanSquare },
  { to: '/locais', label: 'Locais', icon: Building2 },
  { to: '/agenda', label: 'Agenda', icon: Calendar },
  { to: '/medicamentos', label: 'Medicamentos', icon: Pill },
  { to: '/vacinas', label: 'Vacinas', icon: Syringe },
  { to: '/tarefas', label: 'Tarefas', icon: ListChecks },
  { to: '/tutores', label: 'Tutores', icon: Users },
  { to: '/relatorios', label: 'Relatórios', icon: BarChart3 },
]

export const secondaryNav: NavItem[] = [
  { to: '/alertas', label: 'Alertas', icon: Bell },
  { to: '/configuracoes', label: 'Configurações', icon: Settings },
]

export const mobileNav: NavItem[] = [
  { to: '/', label: 'Início', icon: Home, end: true },
  { to: '/pets', label: 'Pets', icon: PawPrint },
  { to: '/logistica', label: 'Logística', icon: KanbanSquare },
  { to: '/agenda', label: 'Agenda', icon: Calendar },
]
