/** Sequential clinic-facing pet code, e.g. LUN-000124. */
export function formatPetCode(seq: number): string {
  return `LUN-${String(seq).padStart(6, '0')}`
}

let counter = 0
/** Opaque unique id for nested records (weights, meds, events…). */
export function uid(prefix = 'id'): string {
  counter += 1
  return `${prefix}_${Date.now().toString(36)}_${counter.toString(36)}`
}
