import { AlertTriangle } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from './Button'

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmar',
  danger,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  danger?: boolean
}) {
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center">
        <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${danger ? 'bg-danger-soft text-danger' : 'bg-brand-50 text-brand-600'}`}>
          <AlertTriangle className="h-7 w-7" strokeWidth={1.9} />
        </div>
        <h2 className="text-lg font-bold text-ink">{title}</h2>
        <p className="mt-1.5 max-w-xs text-sm text-muted">{message}</p>
        <div className="mt-6 flex w-full gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} className="flex-1" onClick={() => { onConfirm(); onClose() }}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
