/**
 * =============================================================================
 * PÁGINA DE LOGIN DO ADMINISTRADOR
 * =============================================================================
 * 
 * Página de autenticação para acesso ao painel administrativo.
 * Utiliza Supabase Auth para gerenciar a autenticação.
 * 
 * FUNCIONALIDADES:
 * - Login com email e senha
 * - Validação de campos
 * - Mensagens de erro amigáveis
 * =============================================================================
 */

import type { Metadata } from 'next'
import { LoginForm } from '@/components/admin/login-form'

export const metadata: Metadata = {
  title: 'Login Administrativo',
  description: 'Acesse o painel administrativo da loja.',
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Título */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Painel Admin</h1>
          <p className="mt-2 text-muted-foreground">
            Faça login para acessar o painel administrativo
          </p>
        </div>

        {/* Formulário de Login */}
        <LoginForm />
      </div>
    </div>
  )
}
