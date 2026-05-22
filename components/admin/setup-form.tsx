/**
 * =============================================================================
 * SETUP FORM - FORMULÁRIO DE CONFIGURAÇÃO INICIAL
 * =============================================================================
 * 
 * Formulário para criar o primeiro administrador do sistema.
 * Usa signUp do Supabase para criar usuário e perfil.
 * =============================================================================
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

export function SetupForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  // Estados do formulário
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    if (!name.trim() || !email.trim() || !password) {
      setError('Preencha todos os campos.')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.')
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    try {
      // 1. Cria o usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name.trim(),
          },
        },
      })

      if (authError) {
        setError(authError.message)
        return
      }

      if (!authData.user) {
        setError('Erro ao criar usuário.')
        return
      }

      // 2. Cria o perfil na tabela profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name: name.trim(),
          email: email.trim(),
          active: true,
        })

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError)
      }

      // Sucesso!
      setSuccess(true)
      
      // Faz login automático
      await supabase.auth.signInWithPassword({ email, password })
      
      // Redireciona para o admin
      setTimeout(() => {
        router.push('/admin')
        router.refresh()
      }, 1000)
    } catch (err) {
      console.error('Erro no setup:', err)
      setError('Erro ao criar administrador. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="border-primary/50">
        <CardContent className="pt-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold">Administrador Criado!</h3>
          <p className="mt-2 text-muted-foreground">
            Redirecionando para o painel...
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Criar Administrador</CardTitle>
          <CardDescription>
            Este será o primeiro usuário com acesso ao painel administrativo.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Nome */}
          <div className="space-y-2">
            <label htmlFor="setup-name" className="text-sm font-medium">
              Nome Completo
            </label>
            <Input
              id="setup-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="setup-email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="setup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          {/* Senha */}
          <div className="space-y-2">
            <label htmlFor="setup-password" className="text-sm font-medium">
              Senha
            </label>
            <div className="relative">
              <Input
                id="setup-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando...
              </>
            ) : (
              'Criar Administrador'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
