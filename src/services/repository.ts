// ── Data access seam ─────────────────────────────────────────────────────
// Today this returns in-memory seed data. To move to Supabase / a REST API
// later, reimplement these methods (e.g. `supabase.from('pets').select()`)
// WITHOUT touching any component — the store and UI only talk to this file.

import { alerts, appointments, currentUser, kennels, pets, tasks, tutors } from '@/data/seed'
import type { Alert, Appointment, AppUser, Kennel, Pet, Task, Tutor } from '@/data/types'

export interface Snapshot {
  pets: Pet[]
  tutors: Tutor[]
  appointments: Appointment[]
  tasks: Task[]
  alerts: Alert[]
  kennels: Kennel[]
  user: AppUser
}

// Simulated network latency so loading states are real and testable.
const latency = (ms = 480) => new Promise((r) => setTimeout(r, ms))

// deep clone keeps the seed immutable across hot reloads / re-mounts
const clone = <T,>(v: T): T =>
  typeof structuredClone === 'function' ? structuredClone(v) : JSON.parse(JSON.stringify(v))

export const repository = {
  async loadAll(): Promise<Snapshot> {
    await latency()
    return clone({
      pets,
      tutors,
      appointments,
      tasks,
      alerts,
      kennels,
      user: currentUser,
    })
  },

  // Placeholders for a future backend — the store already funnels writes here.
  async persistPet(pet: Pet): Promise<Pet> {
    await latency(120)
    return pet
  },
  async removePet(id: string): Promise<void> {
    await latency(120)
    void id
  },
}
