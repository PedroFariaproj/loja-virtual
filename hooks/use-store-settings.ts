/**
 * =============================================================================
 * USE STORE SETTINGS - HOOK PARA CONFIGURAÇÕES DA LOJA
 * =============================================================================
 * 
 * Este hook busca as configurações da loja do banco de dados (Supabase).
 * Quando você altera o nome da loja nas configurações do admin,
 * ele atualiza automaticamente em todo o site.
 * 
 * COMO USAR:
 * const { settings, storeName, whatsappNumber, isLoading } = useStoreSettings()
 * =============================================================================
 */

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Settings } from '@/lib/types'
import { storeConfig } from '@/lib/store-config'

interface UseStoreSettingsReturn {
  /** Configurações completas do banco */
  settings: Settings | null
  /** Nome da loja (do banco ou fallback do config) */
  storeName: string
  /** Número do WhatsApp */
  whatsappNumber: string
  /** Se está carregando */
  isLoading: boolean
  /** Função para recarregar as configurações */
  refetch: () => Promise<void>
}

/**
 * Hook para buscar configurações da loja do Supabase.
 * Retorna nome da loja e WhatsApp, com fallback para store-config.ts
 */
export function useStoreSettings(): UseStoreSettingsReturn {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  /**
   * Busca as configurações do banco de dados
   */
  const fetchSettings = async () => {
    try {
      const supabase = createClient()
      
      // Se o Supabase não está configurado, usa apenas o fallback
      if (!supabase) {
        console.warn('[useStoreSettings] Supabase não configurado, usando valores padrão')
        setSettings(null)
        setIsLoading(false)
        return
      }
      
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .limit(1)
        .single()

      if (error) {
        console.warn('Configurações não encontradas, usando fallback:', error.message)
        setSettings(null)
      } else {
        setSettings(data)
      }
    } catch (err) {
      console.error('Erro ao buscar configurações:', err)
      setSettings(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Busca configurações ao montar o componente
  useEffect(() => {
    fetchSettings()
  }, [])

  // Nome da loja: usa do banco se existir, senão usa do store-config.ts
  const storeName = settings?.store_name || storeConfig.storeName

  // WhatsApp: usa do banco se existir, senão usa do store-config.ts
  const whatsappNumber = settings?.whatsapp_number || storeConfig.whatsappNumber

  return {
    settings,
    storeName,
    whatsappNumber,
    isLoading,
    refetch: fetchSettings,
  }
}
