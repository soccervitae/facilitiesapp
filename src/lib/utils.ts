export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date + 'T00:00:00'))
}

export function maskCpf(cpf: string): string {
  const digits = cpf.replace(/\D/g, '')
  if (digits.length !== 11) return cpf
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function computeBalance(entries: Array<{ entry_type: string; amount: number }>) {
  let balance = 0, deposited = 0, withdrawn = 0, profit = 0
  for (const e of entries) {
    if (e.entry_type === 'deposit') { balance += e.amount; deposited += e.amount }
    else if (e.entry_type === 'withdrawal') { balance -= e.amount; withdrawn += e.amount }
    else if (e.entry_type === 'profit' || e.entry_type === 'bonus') { balance += e.amount; profit += e.amount }
    else if (e.entry_type === 'loss') { balance -= e.amount; profit -= e.amount }
    else if (e.entry_type === 'adjustment') { balance += e.amount }
  }
  const roi = deposited > 0 ? (profit / deposited) * 100 : 0
  return { balance, deposited, withdrawn, profit, roi }
}
