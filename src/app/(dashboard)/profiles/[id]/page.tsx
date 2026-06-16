import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ProfileDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: profile } = await supabase.from('sb_user_profiles').select('*').eq('id', id).single()

  if (!profile) notFound()

  const { data: bookmakers } = await supabase.from('sb_bookmakers').select('*').eq('user_profile_id', id)
  const { data: entries } = await supabase.from('sb_balance_entries').select('*').eq('user_profile_id', id)

  const balance = (entries ?? []).reduce((sum, e) => {
    if (e.entry_type === 'deposit' || e.entry_type === 'bonus' || e.entry_type === 'profit') return sum + e.amount
    if (e.entry_type === 'withdrawal' || e.entry_type === 'loss') return sum - e.amount
    if (e.entry_type === 'adjustment') return sum + e.amount
    return sum
  }, 0)

  const tabs = [
    { href: `/profiles/${id}/bookmakers`, label: 'Casas de Aposta' },
    { href: `/profiles/${id}/balance`, label: 'Histórico de Saldo' },
  ]

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-2">
        <Link href="/profiles" className="text-[var(--color-muted)] text-sm hover:text-[var(--color-text)]">← Meus Perfis</Link>
      </div>

      <div className="p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: profile.color }}>
            {profile.nickname.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text)]">{profile.nickname}</h1>
            <p className="text-[var(--color-muted)]">{profile.first_name} {profile.last_name}</p>
            <p className="font-mono text-sm text-[var(--color-muted)]">CPF: {profile.cpf}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-[var(--color-muted)] text-sm">Saldo atual</p>
            <p className={`text-2xl font-bold font-mono ${balance >= 0 ? 'text-[var(--color-green)]' : 'text-[var(--color-red)]'}`}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance)}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[var(--color-border)] grid grid-cols-2 gap-4">
          <div>
            <p className="text-[var(--color-muted)] text-sm">Casas de aposta</p>
            <p className="text-xl font-semibold text-[var(--color-text)]">{(bookmakers ?? []).length}</p>
          </div>
          <div>
            <p className="text-[var(--color-muted)] text-sm">Lançamentos</p>
            <p className="text-xl font-semibold text-[var(--color-text)]">{(entries ?? []).length}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {tabs.map(tab => (
          <Link
            key={tab.href}
            href={tab.href}
            className="px-5 py-2.5 rounded-lg border border-[var(--color-border)] text-sm font-medium text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
