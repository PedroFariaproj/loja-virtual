/**
 * =============================================================================
 * PÁGINA DE CONFIGURAÇÕES DA LOJA
 * =============================================================================
 * 
 * Permite alterar:
 * - Nome da loja
 * - Número do WhatsApp
 * =============================================================================
 */

import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { SettingsForm } from '@/components/admin/settings-form'
import type { Settings } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Configurações',
}

async function getSettings(): Promise<Settings | null> {
  const supabase = await createClient()
  
  const { data: settings, error } = await supabase
    .from('settings')
    .select('*')
    .single()

  if (error) {
    console.error('Erro ao buscar configurações:', error)
    return null
  }

  return settings
}

export default async function AdminSettingsPage() {
  const settings = await getSettings()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground mt-1">
          Configure as informações da sua loja
        </p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  )
}
