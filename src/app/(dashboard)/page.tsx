import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profiles } = await supabase
    .from('sb_user_profiles')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  const profileIds = (profiles ?? []).map(p => p.id)

  const { data: entries } = profileIds.length > 0
    ? await supabase.from('sb_balance_entries').select('*').in('user_profile_id', profileIds)
    : { data: [] }

  const { data: bookmakers } = profileIds.length > 0
    ? await supabase.from('sb_bookmakers').select('*').in('user_profile_id', profileIds)
    : { data: [] }

  const calcBalance = (profileId: string) => {
    const profileEntries = (entries ?? []).filter(e => e.user_profile_id === profileId)
    return profileEntries.reduce((sum, e) => {
      if (e.entry_type === 'deposit' || e.entry_type === 'bonus') return sum + e.amount
      if (e.entry_type === 'withdrawal') return sum - e.amount
      if (e.entry_type === 'profit') return sum + e.amount
      if (e.entry_type === 'loss') return sum - e.amount
      if (e.entry_type === 'adjustment') return sum + e.amount
      return sum
    }, 0)
  }

  const totalDeposited = (entries ?? []).filter(e => e.entry_type === 'deposit').reduce((s, e) => s + e.amount, 0)
  const totalWithdrawn = (entries ?? []).filter(e => e.entry_type === 'withdrawal').reduce((s, e) => s + e.amount, 0)
  const totalProfit = (entries ?? []).filter(e => e.entry_type === 'profit').reduce((s, e) => s + e.amount, 0)
  const totalLoss = (entries ?? []).filter(e => e.entry_type === 'loss').reduce((s, e) => s + e.amount, 0)
  const netProfit = totalProfit - totalLoss
  const roi = totalDeposited > 0 ? (netProfit / totalDeposited) * 100 : 0
  const totalBalance = (profiles ?? []).reduce((s, p) => s + calcBalance(p.id), 0)

  const summaryCards = [
    { label: 'Total Investido', value: formatCurrency(totalDeposited), color: 'var(--color-accent)' },
    { label: 'Saldo Total', value: formatCurrency(totalBalance), color: 'var(--color-green)' },
    { label: 'Lucro Total', value: formatCurrency(netProfit), color: netProfit >= 0 ? 'var(--color-green)' : 'var(--color-red)' },
    { label: 'ROI', value: `${roi.toFixed(2)}%`, color: roi >= 0 ? 'var(--color-green)' : 'var(--color-red)' },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text)]">Dashboard</h1>
        <p className="text-[var(--color-muted)] mt-1">Visão geral das suas surebets</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryCards.map(card => (
          <div key={card.label} className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
            <p className="text-[var(--color-muted)] text-sm mb-2">{card.label}</p>
            <p className="text-2xl font-bold font-mono" style={{ color: card.color }}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-[var(--color-text)]">Perfis Operacionais</h2>
        <Link
          href="/profiles"
          className="px-4 py-2 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          + Novo Perfil
        </Link>
      </div>

      {(!profiles || profiles.length === 0) ? (
        <div className="text-center py-16 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]">
          <p className="text-[var(--color-muted)] text-lg mb-4">Nenhum perfil criado ainda</p>
          <Link
            href="/profiles"
            className="px-6 py-3 rounded-lg bg-[var(--color-accent)] text-white font-medium hover:opacity-90 transition-opacity"
          >
            Criar primeiro perfil
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map(profile => {
            const balance = calcBalance(profile.id)
            const bookmakersCount = (bookmakers ?? []).filter(b => b.user_profile_id === profile.id).length
            const lastEntry = (entries ?? []).filter(e => e.user_profile_id === profile.id).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]

            return (
              <div key={profile.id} className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: profile.color }}>
                    {profile.nickname.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-text)]">{profile.nickname}</p>
                    <p className="text-[var(--color-muted)] text-sm">{profile.first_name} {profile.last_name}</p>
                  </div>
                  <div className={`ml-auto px-2 py-0.5 rounded-full text-xs ${profile.is_active ? 'bg-[var(--color-green)]/20 text-[var(--color-green)]' : 'bg-[var(--color-muted)]/20 text-[var(--color-muted)]'}`}>
                    {profile.is_active ? 'Ativo' : 'Inativo'}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-muted)]">CPF</span>
                    <span className="font-mono text-[var(--color-text)]">{profile.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.***.***-$4')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-muted)]">Saldo</span>
                    <span className={`font-mono font-semibold ${balance >= 0 ? 'text-[var(--color-green)]' : 'text-[var(--color-red)]'}`}>{formatCurrency(balance)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-muted)]">Casas</span>
                    <span className="text-[var(--color-text)]">{bookmakersCount}</span>
                  </div>
                  {lastEntry && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--color-muted)]">Última atividade</span>
                      <span className="text-[var(--color-text)]">{new Date(lastEntry.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  )}
                </div>

                <Link
                  href={`/profiles/${profile.id}`}
                  className="block w-full text-center py-2 rounded-lg border border-[var(--color-accent)] text-[var(--color-accent)] text-sm font-medium hover:bg-[var(--color-accent)] hover:text-white transition-colors"
                >
                  Acessar Perfil
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
