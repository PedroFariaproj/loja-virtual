/**
 * =============================================================================
 * PÁGINA DE GERENCIAMENTO DE PRODUTOS
 * =============================================================================
 * 
 * Lista todos os produtos e permite:
 * - Criar novo produto
 * - Editar produto existente
 * - Ativar/desativar produto
 * - Excluir produto
 * =============================================================================
 */

import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ProductsList } from '@/components/admin/products-list'
import type { Product } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Produtos',
}

async function getProducts(): Promise<Product[]> {
  const supabase = await createClient()
  
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar produtos:', error)
    return []
  }

  return products || []
}

export default async function AdminProductsPage() {
  const products = await getProducts()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Produtos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os produtos da sua loja
          </p>
        </div>
      </div>

      <ProductsList initialProducts={products} />
    </div>
  )
}
