import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { WeightEntry } from '@/data/types'
import { formatDateShort } from '@/lib/format'

export function WeightChart({ weights, height = 220 }: { weights: WeightEntry[]; height?: number }) {
  const data = [...weights]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((w) => ({ label: formatDateShort(w.date), kg: w.kg }))

  if (data.length === 0) {
    return <div className="flex h-40 items-center justify-center text-sm text-muted">Sem registros de peso.</div>
  }

  const values = data.map((d) => d.kg)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const pad = Math.max((max - min) * 0.25, 0.2)

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 10, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.32} />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#EEECF5" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: '#9AA0AE', fontSize: 12 }} dy={6} />
        <YAxis domain={[min - pad, max + pad]} tickLine={false} axisLine={false} tick={{ fill: '#9AA0AE', fontSize: 12 }} width={44} tickFormatter={(v) => `${v}kg`} />
        <Tooltip
          cursor={{ stroke: '#C2A6F6', strokeWidth: 1.5, strokeDasharray: '4 4' }}
          contentStyle={{ borderRadius: 12, border: '1px solid #EAEAF0', boxShadow: '0 12px 34px -8px rgba(56,32,120,0.22)', fontSize: 13 }}
          labelStyle={{ color: '#6B7280', fontWeight: 600 }}
          formatter={(v: number) => [`${v.toLocaleString('pt-BR')} kg`, 'Peso']}
        />
        <Area type="monotone" dataKey="kg" stroke="#6D28D9" strokeWidth={2.5} fill="url(#wg)" dot={{ r: 3.5, fill: '#6D28D9', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 5 }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function MiniBars({ data, color = '#6D28D9' }: { data: { label: string; value: number }[]; color?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="flex items-end gap-1.5" style={{ height: 48 }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 rounded-t-sm transition-all" style={{ height: `${(d.value / max) * 100}%`, minHeight: 3, background: color, opacity: 0.35 + (d.value / max) * 0.65 }} title={`${d.label}: ${d.value}`} />
      ))}
    </div>
  )
}
