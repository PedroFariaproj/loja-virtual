/**
 * =============================================================================
 * ADMIN FORM DIALOG - MODAL PARA CRIAR ADMINISTRADOR
 * =============================================================================
 * 
 * Modal para criar novo administrador.
 * Cria usuário no Supabase Auth e perfil na tabela profiles.
 * =============================================================================
 */

'use client'

import { useState } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase/client'

interface AdminFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

export function AdminFormDialog({
  open,
  onOpenChange,
  onSaved,
}: AdminFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Estados do formulário
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const resetForm = () => {
    setName('')
    setEmail('')
    setPassword('')
    setError(null)
  }

  /**
   * Cria o novo administrador.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim() || !email.trim() || !password) {
      setError('Preencha todos os campos.')
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.')
      return
    }

    setIsLoading(true)
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
        if (authError.message.includes('already registered')) {
          setError('Este email já está cadastrado.')
        } else {
          setError(authError.message)
        }
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
        // Mesmo com erro no perfil, o usuário foi criado
        // O perfil pode ser criado manualmente depois
      }

      // Sucesso!
      resetForm()
      onSaved()
    } catch (err) {
      console.error('Erro ao criar administrador:', err)
      setError('Erro ao criar administrador. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(value) => {
      onOpenChange(value)
      if (!value) resetForm()
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Administrador</DialogTitle>
          <DialogDescription>
            Crie uma nova conta de administrador. O usuário receberá um email de confirmação.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mensagem de erro */}
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Nome */}
          <div className="space-y-2">
            <label htmlFor="admin-name" className="text-sm font-medium">
              Nome Completo *
            </label>
            <Input
              id="admin-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do administrador"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="admin-email" className="text-sm font-medium">
              Email *
            </label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
              required
            />
          </div>

          {/* Senha */}
          <div className="space-y-2">
            <label htmlFor="admin-password" className="text-sm font-medium">
              Senha *
            </label>
            <div className="relative">
              <Input
                id="admin-password"
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
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                'Criar Administrador'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
