import { useId } from 'react'
import { cn } from '@/lib/cn'

/** Lunar crescent glyph — a soft eclipse motif, used as the app symbol. */
export function LunarGlyph({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, '')
  const g = `lg-${uid}`
  const sheen = `ls-${uid}`
  const crescent = `cr-${uid}`
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#5B21B6" />
        </linearGradient>
        <radialGradient id={sheen} cx="0.32" cy="0.28" r="0.75">
          <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={crescent}>
          <rect width="40" height="40" fill="black" />
          <circle cx="19" cy="20" r="10" fill="white" />
          <circle cx="24" cy="17" r="9" fill="black" />
        </mask>
      </defs>
      <rect x="1" y="1" width="38" height="38" rx="11" fill={`url(#${g})`} />
      <rect x="1" y="1" width="38" height="38" rx="11" fill={`url(#${sheen})`} />
      <rect width="40" height="40" fill="#fff" mask={`url(#${crescent})`} opacity="0.95" />
      <circle cx="28.5" cy="12.5" r="1.5" fill="#fff" opacity="0.9" />
      <circle cx="12" cy="28" r="1" fill="#fff" opacity="0.7" />
    </svg>
  )
}

export function LunarWordmark({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <LunarGlyph className="h-9 w-9 shrink-0 drop-shadow-[0_4px_10px_rgba(109,40,217,0.35)]" />
      {!compact && (
        <div className="leading-none">
          <div className="font-display text-[19px] font-extrabold tracking-[0.14em] text-ink">LUNAAR</div>
          <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-faint">Acolhimento animal</div>
        </div>
      )}
    </div>
  )
}
