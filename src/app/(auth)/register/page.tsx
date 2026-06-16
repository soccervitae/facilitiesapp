'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const schema = z.object({
  full_name: z.string().min(2, 'Nome obrigatório'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirm_password: z.string(),
}).refine(data => data.password === data.confirm_password, {
  message: 'Senhas não conferem',
  path: ['confirm_password'],
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const router = useRouter()
  const [authError, setAuthError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setAuthError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { full_name: data.full_name } },
    })
    if (error) {
      setAuthError(error.message)
      return
    }
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
      <div className="w-full max-w-md p-8 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)]">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Criar conta</h1>
          <p className="text-[var(--color-muted)] mt-1">Comece a gerenciar suas surebets</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Nome completo</label>
            <input
              {...register('full_name')}
              className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
              placeholder="João Silva"
            />
            {errors.full_name && <p className="text-[var(--color-red)] text-sm mt-1">{errors.full_name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Email</label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
              placeholder="seu@email.com"
            />
            {errors.email && <p className="text-[var(--color-red)] text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Senha</label>
            <input
              {...register('password')}
              type="password"
              className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-[var(--color-red)] text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Confirmar senha</label>
            <input
              {...register('confirm_password')}
              type="password"
              className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
              placeholder="••••••••"
            />
            {errors.confirm_password && <p className="text-[var(--color-red)] text-sm mt-1">{errors.confirm_password.message}</p>}
          </div>

          {authError && (
            <div className="p-3 rounded-lg bg-[var(--color-red)]/10 border border-[var(--color-red)]/30 text-[var(--color-red)] text-sm">
              {authError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-lg bg-[var(--color-accent)] text-white font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {isSubmitting ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p className="text-center text-[var(--color-muted)] text-sm mt-6">
          Já tem conta?{' '}
          <Link href="/login" className="text-[var(--color-accent)] hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
