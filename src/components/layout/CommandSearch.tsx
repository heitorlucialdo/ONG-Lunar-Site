import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { Search, CornerDownLeft, PawPrint, User } from 'lucide-react'
import { useStore } from '@/services/store'
import { PetAvatar } from '@/components/pets/PetAvatar'
import { speciesLabel } from '@/lib/format'
import { cn } from '@/lib/cn'

export function CommandSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { pets, tutors } = useStore()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setQ('')
      setActive(0)
      setTimeout(() => inputRef.current?.focus(), 30)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return pets.slice(0, 6).map((p) => ({ pet: p, tutor: tutors.find((t) => t.id === p.tutorId) }))
    return pets
      .map((p) => ({ pet: p, tutor: tutors.find((t) => t.id === p.tutorId) }))
      .filter(({ pet, tutor }) => {
        const hay = [pet.name, pet.id, pet.breed, speciesLabel[pet.species], tutor?.name, tutor?.phone]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        return hay.includes(term)
      })
      .slice(0, 8)
  }, [q, pets, tutors])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
      if (e.key === 'Enter' && results[active]) {
        navigate(`/pets/${results[active].pet.id}`)
        onClose()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, results, active, navigate, onClose])

  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-start justify-center p-4 pt-[12vh]">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl bg-surface shadow-pop animate-scale-in">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search className="h-5 w-5 text-faint" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => { setQ(e.target.value); setActive(0) }}
            placeholder="Buscar pet, código, tutor ou telefone…"
            className="h-14 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-faint"
          />
          <kbd className="hidden rounded-md border border-line bg-surface-2 px-1.5 py-0.5 text-[11px] font-semibold text-faint sm:block">ESC</kbd>
        </div>
        <div className="max-h-[52vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-muted">Nenhum resultado para “{q}”.</div>
          ) : (
            results.map(({ pet, tutor }, i) => (
              <button
                key={pet.id}
                onMouseEnter={() => setActive(i)}
                onClick={() => { navigate(`/pets/${pet.id}`); onClose() }}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
                  i === active ? 'bg-brand-50' : 'hover:bg-surface-2',
                )}
              >
                <PetAvatar pet={pet} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold text-ink">{pet.name}</span>
                    <span className="rounded-md bg-surface-2 px-1.5 py-0.5 text-[11px] font-semibold text-muted">{pet.id}</span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-muted">
                    <span className="inline-flex items-center gap-1"><PawPrint className="h-3 w-3" />{speciesLabel[pet.species]} · {pet.breed}</span>
                    {tutor && <span className="inline-flex items-center gap-1 truncate"><User className="h-3 w-3" />{tutor.name}</span>}
                  </div>
                </div>
                {i === active && <CornerDownLeft className="h-4 w-4 text-brand-500" />}
              </button>
            ))
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
