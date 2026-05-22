/**
 * =============================================================================
 * SETTINGS FORM - FORMULÁRIO DE CONFIGURAÇÕES
 * =============================================================================
 * 
 * Formulário para editar as configurações da loja:
 * - Nome da loja
 * - Número do WhatsApp
 * =============================================================================
 */

'use client'

import { useState } from 'react'
import { Loader2, Save, CheckCircle, Store, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import type { Settings } from '@/lib/types'

interface SettingsFormProps {
  initialSettings: Settings | null
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  
  // Estados do formulário
  const [storeName, setStoreName] = useState(initialSettings?.store_name || '')
  const [whatsappNumber, setWhatsappNumber] = useState(initialSettings?.whatsapp_number || '')

  /**
   * Salva as configurações.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setIsSaved(false)

    const supabase = createClient()

    try {
      if (initialSettings) {
        // Atualiza configurações existentes
        const { error } = await supabase
          .from('settings')
          .update({
            store_name: storeName.trim(),
            whatsapp_number: whatsappNumber.replace(/\D/g, ''),
            updated_at: new Date().toISOString(),
          })
          .eq('id', initialSettings.id)

        if (error) throw error
      } else {
        // Cria novas configurações
        const { error } = await supabase
          .from('settings')
          .insert({
            store_name: storeName.trim(),
            whatsapp_number: whatsappNumber.replace(/\D/g, ''),
          })

        if (error) throw error
      }

      // Feedback de sucesso
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 3000)
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      alert('Erro ao salvar configurações. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Nome da Loja */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            <CardTitle>Nome da Loja</CardTitle>
          </div>
          <CardDescription>
            Este nome aparece no título do site e em outros lugares.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="iPhone Premium Store"
          />
        </CardContent>
      </Card>

      {/* WhatsApp */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            <CardTitle>WhatsApp para Pedidos</CardTitle>
          </div>
          <CardDescription>
            Número que receberá os pedidos dos clientes. 
            Use o formato: 5511999999999 (código do país + DDD + número).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            placeholder="5511999999999"
            type="tel"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Exemplo: 5511999999999 (Brasil, DDD 11, número 999999999)
          </p>
        </CardContent>
      </Card>

      {/* Botão Salvar */}
      <Button type="submit" disabled={isLoading} className="gap-2">
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : isSaved ? (
          <>
            <CheckCircle className="h-4 w-4" />
            Salvo!
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            Salvar Configurações
          </>
        )}
      </Button>
    </form>
  )
}
