import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { cn } from '@/lib/cn'

export function QrBadge({ value, size = 128, className }: { value: string; size?: number; className?: string }) {
  const [url, setUrl] = useState<string>('')
  useEffect(() => {
    QRCode.toDataURL(value, {
      width: size * 2,
      margin: 1,
      color: { dark: '#14121C', light: '#FFFFFF' },
      errorCorrectionLevel: 'M',
    })
      .then(setUrl)
      .catch(() => setUrl(''))
  }, [value, size])

  return (
    <div className={cn('inline-flex items-center justify-center rounded-2xl border border-line bg-surface p-2', className)}>
      {url ? (
        <img src={url} width={size} height={size} alt={`QR Code ${value}`} className="rounded-lg" />
      ) : (
        <div className="skeleton rounded-lg" style={{ width: size, height: size }} />
      )}
    </div>
  )
}
