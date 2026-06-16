'use client'
import { useState, useEffect, use } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Bookmaker } from '@/types/surebet'

const BOOKMAKER_SUGGESTIONS = ['Bet365','Betano','KTO','Sportingbet','Superbet','Vai de Bet','Estrela Bet','Novibet','Betnacional','Pixbet','Blaze','Betfire']

const schema = z.object({
  name: z.string().min(1, 'Obrigatório'),
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Obrigatório'),
  is_active: z.boolean(),
})

type FormData = z.infer<typeof schema>

export default function BookmakersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [bookmakers, setBookmakers] = useState<Bookmaker[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBookmaker, setEditingBookmaker] = useState<Bookmaker | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { is_active: true },
  })

  const fetchBookmakers = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('sb_bookmakers').select('*').eq('user_profile_id', id).order('created_at', { ascending: false })
    setBookmakers(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchBookmakers() }, [id])

  const openCreate = () => {
    setEditingBookmaker(null)
    reset({ name: '', email: '', password: '', is_active: true })
    setShowPassword(false)
    setShowModal(true)
  }

  const openEdit = (bm: Bookmaker) => {
    setEditingBookmaker(bm)
    reset({ name: bm.name, email: bm.email, password: bm.password, is_active: bm.is_active })
    setShowPassword(false)
    setShowModal(true)
  }

  const onSubmit = async (data: FormData) => {
    const supabase = createClient()
    if (editingBookmaker) {
      await supabase.from('sb_bookmakers').update({ ...data, user_profile_id: id }).eq('id', editingBookmaker.id)
    } else {
      await supabase.from('sb_bookmakers').insert({ ...data, user_profile_id: id })
    }
    setShowModal(false)
    fetchBookmakers()
  }

  const toggleActive = async (bm: Bookmaker) => {
    const supabase = createClient()
    await supabase.from('sb_bookmakers').update({ is_active: !bm.is_active }).eq('id', bm.id)
    fetchBookmakers()
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-2">
        <Link href={`/profiles/${id}`} className="text-[var(--color-muted)] text-sm hover:text-[var(--color-text)]">← Perfil</Link>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text)]">Casas de Aposta</h1>
          <p className="text-[var(--color-muted)] mt-1">Gerencie suas credenciais</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 rounded-lg bg-[var(--color-accent)] text-white font-medium hover:opacity-90">
          + Nova Casa
        </button>
      </div>

      <div className="mb-6 p-4 rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 text-sm text-[var(--color-muted)]">
        🔒 Suas credenciais são armazenadas de forma privada e protegidas por RLS no Supabase.
      </div>

      {loading ? (
        <div className="text-center py-12 text-[var(--color-muted)]">Carregando...</div>
      ) : bookmakers.length === 0 ? (
        <div className="text-center py-16 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]">
          <p className="text-[var(--color-muted)] text-lg mb-4">Nenhuma casa de aposta cadastrada</p>
          <button onClick={openCreate} className="px-6 py-3 rounded-lg bg-[var(--color-accent)] text-white font-medium">
            Adicionar primeira casa
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookmakers.map(bm => (
            <div key={bm.id} className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-semibold text-[var(--color-text)]">{bm.name}</p>
                  <p className="text-[var(--color-muted)] text-sm">{bm.email}</p>
                </div>
                <button
                  onClick={() => toggleActive(bm)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${bm.is_active ? 'bg-[var(--color-green)]/20 text-[var(--color-green)]' : 'bg-[var(--color-muted)]/20 text-[var(--color-muted)]'}`}
                >
                  {bm.is_active ? 'Ativa' : 'Inativa'}
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(bm)}
                  className="flex-1 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] text-sm hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
                >
                  Editar
                </button>
                <Link
                  href={`/profiles/${id}/bookmakers/${bm.id}`}
                  className="flex-1 py-2 rounded-lg bg-[var(--color-accent)] text-white text-sm text-center font-medium hover:opacity-90"
                >
                  Detalhes
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6">
            <h2 className="text-xl font-bold text-[var(--color-text)] mb-6">
              {editingBookmaker ? 'Editar Casa' : 'Nova Casa de Aposta'}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Casa de Aposta</label>
                <input
                  {...register('name')}
                  list="bookmaker-list"
                  className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
                  placeholder="Ex: Bet365"
                />
                <datalist id="bookmaker-list">
                  {BOOKMAKER_SUGGESTIONS.map(s => <option key={s} value={s} />)}
                </datalist>
                {errors.name && <p className="text-[var(--color-red)] text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Email</label>
                <input {...register('email')} type="email" className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]" />
                {errors.email && <p className="text-[var(--color-red)] text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Senha</label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full px-3 py-2 pr-10 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-text)]"
                  >
                    {showPassword ? '🙈' : '👁'}
                  </button>
                </div>
                {errors.password && <p className="text-[var(--color-red)] text-xs mt-1">{errors.password.message}</p>}
              </div>

              <div className="flex items-center gap-2">
                <input {...register('is_active')} type="checkbox" id="bm_active" className="w-4 h-4 accent-[var(--color-accent)]" />
                <label htmlFor="bm_active" className="text-sm text-[var(--color-text)]">Casa ativa</label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 rounded-lg bg-[var(--color-accent)] text-white font-medium hover:opacity-90 disabled:opacity-50">
                  {isSubmitting ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
