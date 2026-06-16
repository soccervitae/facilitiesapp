'use client'
import { useState, useEffect, use } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { createClient } from '@/lib/supabase/client'
import type { BalanceEntry, Bookmaker, EntryType } from '@/types/surebet'
import { formatCurrency, formatDate } from '@/lib/utils'

const schema = z.object({
  entry_type: z.enum(['deposit','withdrawal','profit','loss','bonus','adjustment']),
  amount: z.number().positive('Valor deve ser positivo'),
  bookmaker_id: z.string().optional(),
  entry_date: z.string().min(1, 'Data obrigatória'),
  description: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const ENTRY_TYPE_LABELS: Record<EntryType, string> = {
  deposit: 'Depósito',
  withdrawal: 'Saque',
  profit: 'Lucro',
  loss: 'Prejuízo',
  bonus: 'Bônus',
  adjustment: 'Ajuste',
}

const ENTRY_TYPE_COLORS: Record<EntryType, string> = {
  deposit: 'var(--color-accent)',
  withdrawal: 'var(--color-yellow)',
  profit: 'var(--color-green)',
  loss: 'var(--color-red)',
  bonus: 'var(--color-green)',
  adjustment: 'var(--color-muted)',
}

export default function BalancePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [entries, setEntries] = useState<BalanceEntry[]>([])
  const [bookmakers, setBookmakers] = useState<Bookmaker[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState<string>('all')
  const [filterBookmaker, setFilterBookmaker] = useState<string>('all')

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { entry_type: 'deposit', entry_date: new Date().toISOString().split('T')[0] },
  })

  const fetchData = async () => {
    const supabase = createClient()
    const { data: e } = await supabase.from('sb_balance_entries').select('*, bookmakers:sb_bookmakers(name)').eq('user_profile_id', id).order('entry_date', { ascending: false })
    const { data: b } = await supabase.from('sb_bookmakers').select('*').eq('user_profile_id', id)
    setEntries((e ?? []) as BalanceEntry[])
    setBookmakers(b ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [id])

  const onSubmit = async (data: FormData) => {
    const supabase = createClient()
    await supabase.from('sb_balance_entries').insert({
      ...data,
      user_profile_id: id,
      bookmaker_id: data.bookmaker_id || null,
    })
    reset({ entry_type: 'deposit', entry_date: new Date().toISOString().split('T')[0] })
    fetchData()
  }

  const calcBalance = (entriesList: BalanceEntry[]) => {
    return entriesList.reduce((sum, e) => {
      if (e.entry_type === 'deposit' || e.entry_type === 'bonus' || e.entry_type === 'profit') return sum + e.amount
      if (e.entry_type === 'withdrawal' || e.entry_type === 'loss') return sum - e.amount
      if (e.entry_type === 'adjustment') return sum + e.amount
      return sum
    }, 0)
  }

  const totalDeposited = entries.filter(e => e.entry_type === 'deposit').reduce((s, e) => s + e.amount, 0)
  const totalWithdrawn = entries.filter(e => e.entry_type === 'withdrawal').reduce((s, e) => s + e.amount, 0)
  const totalProfit = entries.filter(e => e.entry_type === 'profit').reduce((s, e) => s + e.amount, 0)
  const totalLoss = entries.filter(e => e.entry_type === 'loss').reduce((s, e) => s + e.amount, 0)
  const netProfit = totalProfit - totalLoss
  const currentBalance = calcBalance(entries)
  const roi = totalDeposited > 0 ? (netProfit / totalDeposited) * 100 : 0

  const filteredEntries = entries.filter(e => {
    if (filterType !== 'all' && e.entry_type !== filterType) return false
    if (filterBookmaker !== 'all' && e.bookmaker_id !== filterBookmaker) return false
    return true
  })

  // Chart data: running balance over time (sorted ascending)
  const sortedEntries = [...entries].sort((a, b) => new Date(a.entry_date).getTime() - new Date(b.entry_date).getTime())
  let runningBalance = 0
  const chartData = sortedEntries.map(e => {
    if (e.entry_type === 'deposit' || e.entry_type === 'bonus' || e.entry_type === 'profit') runningBalance += e.amount
    else if (e.entry_type === 'withdrawal' || e.entry_type === 'loss') runningBalance -= e.amount
    else if (e.entry_type === 'adjustment') runningBalance += e.amount
    return { date: formatDate(e.entry_date), balance: runningBalance }
  })

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-2">
        <Link href={`/profiles/${id}`} className="text-[var(--color-muted)] text-sm hover:text-[var(--color-text)]">← Perfil</Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text)]">Histórico de Saldo</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
        {[
          { label: 'Saldo Atual', value: formatCurrency(currentBalance), color: currentBalance >= 0 ? 'var(--color-green)' : 'var(--color-red)' },
          { label: 'Total Depositado', value: formatCurrency(totalDeposited), color: 'var(--color-text)' },
          { label: 'Total Sacado', value: formatCurrency(totalWithdrawn), color: 'var(--color-text)' },
          { label: 'Lucro Líquido', value: formatCurrency(netProfit), color: netProfit >= 0 ? 'var(--color-green)' : 'var(--color-red)' },
          { label: 'ROI', value: `${roi.toFixed(2)}%`, color: roi >= 0 ? 'var(--color-green)' : 'var(--color-red)' },
        ].map(card => (
          <div key={card.label} className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
            <p className="text-[var(--color-muted)] text-xs mb-1">{card.label}</p>
            <p className="font-bold font-mono text-sm" style={{ color: card.color }}>{card.value}</p>
          </div>
        ))}
      </div>

      {chartData.length > 1 && (
        <div className="p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] mb-8">
          <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Evolução do Saldo</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" stroke="var(--color-muted)" tick={{ fontSize: 11 }} />
              <YAxis stroke="var(--color-muted)" tick={{ fontSize: 11 }} tickFormatter={v => formatCurrency(v)} />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: '8px' }}
                formatter={(value: number) => [formatCurrency(value), 'Saldo']}
              />
              <Line type="monotone" dataKey="balance" stroke="var(--color-accent)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
          <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Novo Lançamento</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <label className="block text-xs text-[var(--color-muted)] mb-1">Tipo</label>
              <select {...register('entry_type')} className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]">
                {Object.entries(ENTRY_TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-[var(--color-muted)] mb-1">Valor (R$)</label>
              <input
                {...register('amount', { valueAsNumber: true })}
                type="number"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
                placeholder="0,00"
              />
              {errors.amount && <p className="text-[var(--color-red)] text-xs mt-1">{errors.amount.message}</p>}
            </div>

            <div>
              <label className="block text-xs text-[var(--color-muted)] mb-1">Casa (opcional)</label>
              <select {...register('bookmaker_id')} className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]">
                <option value="">Nenhuma</option>
                {bookmakers.map(bm => <option key={bm.id} value={bm.id}>{bm.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs text-[var(--color-muted)] mb-1">Data</label>
              <input
                {...register('entry_date')}
                type="date"
                className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
              />
            </div>

            <div>
              <label className="block text-xs text-[var(--color-muted)] mb-1">Descrição (opcional)</label>
              <input
                {...register('description')}
                className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
                placeholder="Observações..."
              />
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full py-2.5 rounded-lg bg-[var(--color-accent)] text-white font-medium hover:opacity-90 disabled:opacity-50">
              {isSubmitting ? 'Salvando...' : 'Adicionar'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="flex gap-2 mb-4 flex-wrap">
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text)] focus:outline-none"
            >
              <option value="all">Todos os tipos</option>
              {Object.entries(ENTRY_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select
              value={filterBookmaker}
              onChange={e => setFilterBookmaker(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text)] focus:outline-none"
            >
              <option value="all">Todas as casas</option>
              {bookmakers.map(bm => <option key={bm.id} value={bm.id}>{bm.name}</option>)}
            </select>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="text-center py-12 text-[var(--color-muted)]">Carregando...</div>
            ) : filteredEntries.length === 0 ? (
              <div className="text-center py-12 text-[var(--color-muted)]">Nenhum lançamento encontrado</div>
            ) : filteredEntries.map(entry => (
              <div key={entry.id} className="p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: `${ENTRY_TYPE_COLORS[entry.entry_type]}20`, color: ENTRY_TYPE_COLORS[entry.entry_type] }}>
                      {ENTRY_TYPE_LABELS[entry.entry_type]}
                    </span>
                    {entry.bookmakers && <span className="text-xs text-[var(--color-muted)]">{entry.bookmakers.name}</span>}
                  </div>
                  <p className="text-xs text-[var(--color-muted)]">{formatDate(entry.entry_date)}</p>
                  {entry.description && <p className="text-xs text-[var(--color-muted)] mt-0.5">{entry.description}</p>}
                </div>
                <p className={`font-mono font-semibold ${['deposit','profit','bonus'].includes(entry.entry_type) ? 'text-[var(--color-green)]' : entry.entry_type === 'adjustment' ? 'text-[var(--color-text)]' : 'text-[var(--color-red)]'}`}>
                  {['deposit','profit','bonus'].includes(entry.entry_type) ? '+' : entry.entry_type === 'adjustment' ? '' : '-'}{formatCurrency(entry.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
