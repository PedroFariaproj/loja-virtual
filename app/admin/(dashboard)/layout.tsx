/**
 * =============================================================================
 * LAYOUT DO PAINEL ADMINISTRATIVO
 * =============================================================================
 * 
 * Layout compartilhado por todas as páginas do admin.
 * Inclui sidebar de navegação e estrutura básica.
 * 
 * NOTA: Este layout é protegido pelo middleware.
 * Apenas usuários autenticados podem acessar.
 * =============================================================================
 */

import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminHeader } from '@/components/admin/admin-header'

export const metadata: Metadata = {
  title: {
    default: 'Painel Admin',
    template: '%s | Admin',
  },
  description: 'Painel administrativo da loja.',
}

interface AdminLayoutProps {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // Verifica se o usuário está autenticado
  const supabase = await createClient()
  
  // Se o Supabase não está configurado, redireciona para login
  if (!supabase) {
    redirect('/admin/login')
  }
  
  const { data: { user } } = await supabase.auth.getUser()

  // Se não está logado, redireciona para login
  if (!user) {
    redirect('/admin/login')
  }

  // Busca o perfil do usuário
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Se o perfil não existe ou está inativo, faz logout
  if (!profile || !profile.active) {
    await supabase.auth.signOut()
    redirect('/admin/login')
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar de Navegação */}
      <AdminSidebar userName={profile.name} userEmail={profile.email} />

      {/* Conteúdo Principal */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Header Mobile */}
        <AdminHeader userName={profile.name} />

        {/* Área de Conteúdo */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
