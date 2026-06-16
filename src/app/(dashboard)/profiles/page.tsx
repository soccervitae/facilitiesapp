'use client'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { SbUserProfile } from '@/types/surebet'

const COLORS = ['#7c6af7','#22c55e','#ef4444','#eab308','#3b82f6','#ec4899','#f97316','#06b6d4','#8b5cf6','#14b8a6']

const schema = z.object({
  first_name: z.string().min(1, 'Obrigatório'),
  last_name: z.string().min(1, 'Obrigatório'),
  nickname: z.string().min(1, 'Obrigatório'),
  cpf: z.string().min(11, 'CPF inválido').max(14),
  color: z.string(),
  is_active: z.boolean(),
})

type FormData = z.infer<typeof schema>

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<SbUserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProfile, setEditingProfile] = useState<SbUserProfile | null>(null)
  const [selectedColor, setSelectedColor] = useState(COLORS[0])

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { color: COLORS[0], is_active: true },
  })

  const fetchProfiles = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase.from('sb_user_profiles').select('*').eq('user_id', user!.id).order('created_at', { ascending: false })
    setProfiles(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchProfiles() }, [])

  const openCreate = () => {
    setEditingProfile(null)
    setSelectedColor(COLORS[0])
    reset({ first_name: '', last_name: '', nickname: '', cpf: '', color: COLORS[0], is_active: true })
    setShowModal(true)
  }

  const openEdit = (profile: SbUserProfile) => {
    setEditingProfile(profile)
    setSelectedColor(profile.color)
    reset({
      first_name: profile.first_name,
      last_name: profile.last_name,
      nickname: profile.nickname,
      cpf: profile.cpf,
      color: profile.color,
      is_active: profile.is_active,
    })
    setShowModal(true)
  }

  const onSubmit = async (data: FormData) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const payload = { ...data, color: selectedColor, user_id: user!.id }

    if (editingProfile) {
      await supabase.from('sb_user_profiles').update(payload).eq('id', editingProfile.id)
    } else {
      await supabase.from('sb_user_profiles').insert(payload)
    }

    setShowModal(false)
    fetchProfiles()
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text)]">Meus Perfis</h1>
          <p className="text-[var(--color-muted)] mt-1">Gerencie seus perfis operacionais</p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-lg bg-[var(--color-accent)] text-white font-medium hover:opacity-90 transition-opacity"
        >
          + Novo Perfil
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[var(--color-muted)]">Carregando...</div>
      ) : profiles.length === 0 ? (
        <div className="text-center py-16 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]">
          <p className="text-[var(--color-muted)] text-lg mb-4">Nenhum perfil criado ainda</p>
          <button onClick={openCreate} className="px-6 py-3 rounded-lg bg-[var(--color-accent)] text-white font-medium">
            Criar primeiro perfil
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profiles.map(profile => (
            <div key={profile.id} className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: profile.color }}>
                  {profile.nickname.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[var(--color-text)]">{profile.nickname}</p>
                  <p className="text-[var(--color-muted)] text-sm">{profile.first_name} {profile.last_name}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs ${profile.is_active ? 'bg-[var(--color-green)]/20 text-[var(--color-green)]' : 'bg-[var(--color-muted)]/20 text-[var(--color-muted)]'}`}>
                  {profile.is_active ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <p className="text-sm text-[var(--color-muted)] mb-4 font-mono">
                CPF: {profile.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.***.***-$4')}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(profile)}
                  className="flex-1 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] text-sm hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
                >
                  Editar
                </button>
                <Link
                  href={`/profiles/${profile.id}`}
                  className="flex-1 py-2 rounded-lg bg-[var(--color-accent)] text-white text-sm text-center font-medium hover:opacity-90 transition-opacity"
                >
                  Acessar
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
              {editingProfile ? 'Editar Perfil' : 'Novo Perfil'}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Nome</label>
                  <input {...register('first_name')} className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]" />
                  {errors.first_name && <p className="text-[var(--color-red)] text-xs mt-1">{errors.first_name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Sobrenome</label>
                  <input {...register('last_name')} className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]" />
                  {errors.last_name && <p className="text-[var(--color-red)] text-xs mt-1">{errors.last_name.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Apelido</label>
                <input {...register('nickname')} className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]" />
                {errors.nickname && <p className="text-[var(--color-red)] text-xs mt-1">{errors.nickname.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">CPF</label>
                <input {...register('cpf')} placeholder="000.000.000-00" className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]" />
                {errors.cpf && <p className="text-[var(--color-red)] text-xs mt-1">{errors.cpf.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Cor</label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => { setSelectedColor(color); setValue('color', color) }}
                      className="w-8 h-8 rounded-full transition-transform hover:scale-110"
                      style={{
                        backgroundColor: color,
                        outline: selectedColor === color ? `3px solid white` : 'none',
                        outlineOffset: '2px',
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input {...register('is_active')} type="checkbox" id="is_active" className="w-4 h-4 accent-[var(--color-accent)]" />
                <label htmlFor="is_active" className="text-sm text-[var(--color-text)]">Perfil ativo</label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-lg bg-[var(--color-accent)] text-white font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
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
