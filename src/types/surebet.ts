export type EntryType = 'deposit' | 'withdrawal' | 'profit' | 'loss' | 'bonus' | 'adjustment'
export type BankAccountType = 'deposit' | 'withdrawal'

export interface SbUserProfile {
  id: string
  user_id: string
  first_name: string
  last_name: string
  nickname: string
  cpf: string
  color: string
  is_active: boolean
  created_at: string
}

export interface Bookmaker {
  id: string
  user_profile_id: string
  name: string
  email: string
  password: string
  is_active: boolean
  created_at: string
}

export interface BankAccount {
  id: string
  bookmaker_id: string
  account_type: BankAccountType
  bank_name: string
  created_at: string
}

export interface BalanceEntry {
  id: string
  user_profile_id: string
  bookmaker_id: string | null
  entry_type: EntryType
  amount: number
  description: string | null
  entry_date: string
  created_at: string
  bookmakers?: { name: string } | null
}
