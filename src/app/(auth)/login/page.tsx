'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const [authError, setAuthError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setAuthError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (error) {
      setAuthError('Email ou senha incorretos')
      return
    }
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
      <div className="w-full max-w-md p-8 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)]">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-accent)] mb-4">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">SureBet Manager</h1>
          <p className="text-[var(--color-muted)] mt-1">Entre na sua conta</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-[var(--color-muted)] text-sm mt-6">
          Não tem conta?{' '}
          <Link href="/register" className="text-[var(--color-accent)] hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  )
}
