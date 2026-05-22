/**
 * =============================================================================
 * PÁGINA DE SETUP - CRIAR PRIMEIRO ADMINISTRADOR
 * =============================================================================
 * 
 * Esta página permite criar o primeiro administrador do sistema.
 * Só funciona se não houver nenhum administrador cadastrado.
 * 
 * ACESSE: /setup
 * 
 * IMPORTANTE: Após criar o primeiro admin, esta página será desativada
 * automaticamente (redirecionará para o login).
 * =============================================================================
 */

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SetupForm } from '@/components/admin/setup-form'

/**
 * Verifica se já existe algum administrador no sistema.
 */
async function hasAnyAdmin(): Promise<boolean> {
  const supabase = await createClient()
  
  const { count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  return (count || 0) > 0
}

export default async function SetupPage() {
  // Se já existe admin, redireciona para login
  const hasAdmin = await hasAnyAdmin()
  
  if (hasAdmin) {
    redirect('/admin/login')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Configuração Inicial</h1>
          <p className="mt-2 text-muted-foreground">
            Crie o primeiro administrador do sistema
          </p>
        </div>

        <SetupForm />
      </div>
    </div>
  )
}
