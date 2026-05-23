/**
 * =============================================================================
 * PÁGINA DE GERENCIAMENTO DE ADMINISTRADORES
 * =============================================================================
 * 
 * Lista todos os administradores e permite:
 * - Criar novo administrador
 * - Ativar/desativar administrador
 * - Excluir administrador
 * =============================================================================
 */

import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { AdminsList } from '@/components/admin/admins-list'
import type { Profile } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Administradores',
}

async function getAdmins(): Promise<Profile[]> {
  const supabase = await createClient()
  
  // Se o Supabase não está configurado, retorna array vazio
  if (!supabase) {
    return []
  }
  
  const { data: admins, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar administradores:', error)
    return []
  }

  return admins || []
}

async function getCurrentUserId(): Promise<string | null> {
  const supabase = await createClient()
  
  // Se o Supabase não está configurado, retorna null
  if (!supabase) {
    return null
  }
  
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id || null
}

export default async function AdminAdminsPage() {
  const admins = await getAdmins()
  const currentUserId = await getCurrentUserId()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Administradores</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie os usuários com acesso ao painel
        </p>
      </div>

      <AdminsList 
        initialAdmins={admins} 
        currentUserId={currentUserId || ''} 
      />
    </div>
  )
}
