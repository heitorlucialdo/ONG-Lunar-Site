import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  DndContext, DragOverlay, PointerSensor, TouchSensor, useSensor, useSensors,
  useDraggable, useDroppable, pointerWithin,
  type DragStartEvent, type DragEndEvent,
} from '@dnd-kit/core'
import { KanbanCard } from './KanbanCard'
import { useStore } from '@/services/store'
import { useToast } from '@/components/ui/Toast'
import { stageAccent } from '@/lib/petMeta'
import { stageLabel } from '@/lib/format'
import type { Pet, Stage, Tutor } from '@/data/types'
import { cn } from '@/lib/cn'

const COLUMNS: Stage[] = ['triagem', 'consultorio', 'internacao', 'canil', 'isolamento', 'observacao', 'alta']

function DraggableCard({ pet, tutor, onOpen }: { pet: Pet; tutor?: Tutor; onOpen: () => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: pet.id })
  return (
    <div
      ref={setNodeRef}
      className={cn('cursor-grab touch-none transition-opacity active:cursor-grabbing', isDragging && 'opacity-40')}
      onClick={onOpen}
      onKeyDown={(e) => e.key === 'Enter' && onOpen()}
      {...attributes}
      {...listeners}
    >
      <KanbanCard pet={pet} tutor={tutor} />
    </div>
  )
}

function Column({ stage, pets, tutors, onOpen }: { stage: Stage; pets: Pet[]; tutors: Tutor[]; onOpen: (id: string) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage })
  return (
    <div className="flex w-[290px] shrink-0 flex-col">
      <div className="mb-3 flex items-center gap-2 px-1">
        <span className={cn('h-2.5 w-2.5 rounded-full', stageAccent[stage])} />
        <h3 className="text-sm font-bold text-ink">{stageLabel[stage]}</h3>
        <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs font-bold text-muted">{pets.length}</span>
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          'flex min-h-[140px] flex-1 flex-col gap-3 rounded-2xl border border-dashed p-2.5 transition-colors',
          isOver ? 'border-brand-400 bg-brand-50/60' : 'border-line bg-surface-2/30',
        )}
      >
        {pets.map((p) => <DraggableCard key={p.id} pet={p} tutor={tutors.find((t) => t.id === p.tutorId)} onOpen={() => onOpen(p.id)} />)}
        {pets.length === 0 && <p className="py-6 text-center text-xs text-faint">Nenhum pet</p>}
      </div>
    </div>
  )
}

export function KanbanBoard() {
  const { pets, tutors, movePetStage } = useStore()
  const toast = useToast()
  const navigate = useNavigate()
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 6 } }),
  )

  const byStage = useMemo(() => {
    const map = Object.fromEntries(COLUMNS.map((c) => [c, [] as Pet[]])) as Record<Stage, Pet[]>
    pets.forEach((p) => map[p.stage]?.push(p))
    return map
  }, [pets])

  const activePet = pets.find((p) => p.id === activeId)

  const onDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id))
  const onDragEnd = (e: DragEndEvent) => {
    setActiveId(null)
    const petId = String(e.active.id)
    const target = e.over?.id as Stage | undefined
    if (!target) return
    const pet = pets.find((p) => p.id === petId)
    if (!pet || pet.stage === target) return
    movePetStage(petId, target)
    toast({ kind: 'success', title: 'Pet movido', message: `${pet.name}: ${stageLabel[pet.stage]} → ${stageLabel[target]}` })
  }

  return (
    <DndContext sensors={sensors} collisionDetection={pointerWithin} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragCancel={() => setActiveId(null)}>
      <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
        {COLUMNS.map((stage) => (
          <Column key={stage} stage={stage} pets={byStage[stage]} tutors={tutors} onOpen={(id) => navigate(`/pets/${id}`)} />
        ))}
      </div>
      <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.16,1,0.3,1)' }}>
        {activePet ? <div className="w-[270px]"><KanbanCard pet={activePet} tutor={tutors.find((t) => t.id === activePet.tutorId)} dragging /></div> : null}
      </DragOverlay>
    </DndContext>
  )
}
