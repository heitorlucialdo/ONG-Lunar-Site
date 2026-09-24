import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { cn } from '@/lib/cn'
import type { LucideIcon } from 'lucide-react'

type Variant = 'primary' | 'soft' | 'ghost' | 'outline' | 'danger'
type Size = 'sm' | 'md' | 'lg' | 'icon'

const variants: Record<Variant, string> = {
  primary: 'btn-primary',
  soft: 'btn-soft',
  ghost: 'btn-ghost',
  outline: 'btn-outline',
  danger: 'btn-danger',
}
const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-[13px]',
  md: 'h-10 px-4',
  lg: 'h-11 px-5 text-[15px]',
  icon: 'h-10 w-10',
}

interface CommonProps {
  variant?: Variant
  size?: Size
  icon?: LucideIcon
  iconRight?: LucideIcon
  className?: string
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, CommonProps {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', icon: Icon, iconRight: IconRight, className, children, ...rest },
  ref,
) {
  return (
    <button ref={ref} className={cn(variants[variant], sizes[size], className)} {...rest}>
      {Icon && <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2.2} />}
      {children}
      {IconRight && <IconRight className="h-[18px] w-[18px] shrink-0" strokeWidth={2.2} />}
    </button>
  )
})

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  className,
  children,
  ...rest
}: CommonProps & LinkProps) {
  return (
    <Link className={cn(variants[variant], sizes[size], className)} {...rest}>
      {Icon && <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2.2} />}
      {children}
      {IconRight && <IconRight className="h-[18px] w-[18px] shrink-0" strokeWidth={2.2} />}
    </Link>
  )
}
