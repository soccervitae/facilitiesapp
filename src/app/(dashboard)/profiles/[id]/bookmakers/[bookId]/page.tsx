'use client'
import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Bookmaker, BankAccount } from '@/types/surebet'

export default function BookmakerDetailPage({ params }: { params: Promise<{ id: string; bookId: string }> }) {
  const { id, bookId } = use(params)
  const [bookmaker, setBookmaker] = useState<Bookmaker | null>(null)
  const [depositAccount, setDepositAccount] = useState<BankAccount | null>(null)
  const [withdrawalAccount, setWithdrawalAccount] = useState<BankAccount | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [sameAccount, setSameAccount] = useState(false)
  const [depositBank, setDepositBank] = useState('')
  const [withdrawalBank, setWithdrawalBank] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: bm } = await supabase.from('sb_bookmakers').select('*').eq('id', bookId).single()
      setBookmaker(bm)
      const { data: accounts } = await supabase.from('sb_bank_accounts').select('*').eq('bookmaker_id', bookId)
      const dep = (accounts ?? []).find(a => a.account_type === 'deposit')
      const wit = (accounts ?? []).find(a => a.account_type === 'withdrawal')
      setDepositAccount(dep ?? null)
      setWithdrawalAccount(wit ?? null)
      setDepositBank(dep?.bank_name ?? '')
      setWithdrawalBank(wit?.bank_name ?? '')
    }
    fetchData()
  }, [bookId])

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const saveAccount = async (type: 'deposit' | 'withdrawal', bankName: string) => {
    const supabase = createClient()
    const existing = type === 'deposit' ? depositAccount : withdrawalAccount
    if (existing) {
      await supabase.from('sb_bank_accounts').update({ bank_name: bankName }).eq('id', existing.id)
    } else {
      const { data } = await supabase.from('sb_bank_accounts').insert({ bookmaker_id: bookId, account_type: type, bank_name: bankName }).select().single()
      if (type === 'deposit') setDepositAccount(data)
      else setWithdrawalAccount(data)
    }
  }

  if (!bookmaker) return <div className="text-center py-12 text-[var(--color-muted)]">Carregando...</div>

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-2">
        <Link href={`/profiles/${id}/bookmakers`} className="text-[var(--color-muted)] text-sm hover:text-[var(--color-text)]">← Casas de Aposta</Link>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text)]">{bookmaker.name}</h1>
          <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${bookmaker.is_active ? 'bg-[var(--color-green)]/20 text-[var(--color-green)]' : 'bg-[var(--color-muted)]/20 text-[var(--color-muted)]'}`}>
            {bookmaker.is_active ? 'Ativa' : 'Inativa'}
          </span>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] mb-6">
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Credenciais de Acesso</h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-surface-2)]">
            <div>
              <p className="text-xs text-[var(--color-muted)]">Email</p>
              <p className="font-mono text-[var(--color-text)]">{bookmaker.email}</p>
            </div>
            <button
              onClick={() => copy(bookmaker.email, 'email')}
              className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              {copied === 'email' ? '✓ Copiado' : 'Copiar'}
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-surface-2)]">
            <div>
              <p className="text-xs text-[var(--color-muted)]">Senha</p>
              <p className="font-mono text-[var(--color-text)]">
                {showPassword ? bookmaker.password : '••••••••'}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
              <button
                onClick={() => copy(bookmaker.password, 'pass')}
                className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
              >
                {copied === 'pass' ? '✓ Copiado' : 'Copiar'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
          <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Conta Depósito</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-[var(--color-muted)] mb-1">Banco</label>
              <input
                value={depositBank}
                onChange={e => setDepositBank(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
                placeholder="Nome do banco"
              />
            </div>
            <button
              onClick={() => saveAccount('deposit', depositBank)}
              className="w-full py-2 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium hover:opacity-90"
            >
              Salvar
            </button>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
          <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Conta Saque</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                id="same_account"
                checked={sameAccount}
                onChange={e => {
                  setSameAccount(e.target.checked)
                  if (e.target.checked) setWithdrawalBank(depositBank)
                }}
                className="w-4 h-4 accent-[var(--color-accent)]"
              />
              <label htmlFor="same_account" className="text-sm text-[var(--color-text)]">Usar mesma conta do depósito</label>
            </div>
            <div>
              <label className="block text-sm text-[var(--color-muted)] mb-1">Banco</label>
              <input
                value={sameAccount ? depositBank : withdrawalBank}
                onChange={e => !sameAccount && setWithdrawalBank(e.target.value)}
                disabled={sameAccount}
                className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)] disabled:opacity-50"
                placeholder="Nome do banco"
              />
            </div>
            <button
              onClick={() => saveAccount('withdrawal', sameAccount ? depositBank : withdrawalBank)}
              className="w-full py-2 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium hover:opacity-90"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
