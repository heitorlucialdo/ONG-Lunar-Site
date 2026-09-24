import { cn } from '@/lib/cn'
import { speciesMeta } from '@/lib/petMeta'
import type { Pet } from '@/data/types'

const sizeMap = {
  sm: 'h-9 w-9 rounded-xl',
  md: 'h-11 w-11 rounded-xl',
  lg: 'h-16 w-16 rounded-2xl',
  xl: 'h-24 w-24 rounded-3xl',
}
const iconSize = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-7 w-7', xl: 'h-10 w-10' }

export function PetAvatar({
  pet,
  size = 'md',
  className,
}: {
  pet: Pick<Pet, 'name' | 'species' | 'photoUrl'>
  size?: keyof typeof sizeMap
  className?: string
}) {
  const meta = speciesMeta[pet.species]
  const Icon = meta.icon
  if (pet.photoUrl) {
    return <img src={pet.photoUrl} alt={pet.name} className={cn('object-cover ring-2 ring-white', sizeMap[size], className)} />
  }
  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center bg-gradient-to-br text-white shadow-[0_4px_12px_-4px_rgba(59,24,115,0.4)] ring-2 ring-white',
        meta.gradient,
        sizeMap[size],
        className,
      )}
    >
      <Icon className={cn(iconSize[size], 'opacity-95')} strokeWidth={1.9} />
      <span className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-t from-black/10 to-white/10" />
    </div>
  )
}
