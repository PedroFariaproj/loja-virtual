/**
 * =============================================================================
 * PÁGINA DO CARRINHO DE COMPRAS
 * =============================================================================
 * 
 * Exibe os itens adicionados ao carrinho e permite:
 * - Visualizar produtos adicionados
 * - Alterar quantidades
 * - Remover itens
 * - Finalizar pedido via WhatsApp
 * =============================================================================
 */

import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/store/header'
import { Footer } from '@/components/store/footer'
import { CartContent } from '@/components/store/cart-content'
import type { Settings } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Carrinho de Compras',
  description: 'Revise seus itens e finalize seu pedido.',
}

/**
 * Busca as configurações da loja (número do WhatsApp).
 */
async function getSettings(): Promise<Settings | null> {
  const supabase = await createClient()
  
  // Se o Supabase não está configurado, retorna null
  if (!supabase) {
    console.warn('[Carrinho] Supabase não configurado')
    return null
  }
  
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

/**
 * Página do carrinho de compras.
 */
export default async function CartPage() {
  const settings = await getSettings()
  const whatsappNumber = settings?.whatsapp_number || ''

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <h1 className="mb-8 text-3xl font-bold md:text-4xl">Carrinho de Compras</h1>
          <CartContent whatsappNumber={whatsappNumber} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
