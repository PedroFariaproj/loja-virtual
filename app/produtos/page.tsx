/**
 * =============================================================================
 * PÁGINA DE CATÁLOGO - LISTA DE PRODUTOS
 * =============================================================================
 * 
 * Exibe todos os produtos com:
 * - Barra de busca por nome
 * - Filtro por faixa de preço
 * - Ordenação
 * 
 * Configurações vêm do arquivo lib/store-config.ts
 * =============================================================================
 */

import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/store/header'
import { Footer } from '@/components/store/footer'
import { ProductsGrid } from '@/components/store/products-grid'
import { storeConfig } from '@/lib/store-config'
import type { Product } from '@/lib/types'

export const metadata: Metadata = {
  title: `Produtos | ${storeConfig.storeName}`,
  description: storeConfig.products.subtitle,
}

/**
 * Busca todos os produtos ativos do banco de dados.
 */
async function getProducts(): Promise<Product[]> {
  const supabase = await createClient()
  
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar produtos:', error)
    return []
  }

  return products || []
}

/**
 * Página de catálogo de produtos.
 */
export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 lg:px-8 py-12 md:py-16">
          {/* Cabeçalho da Página */}
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-semibold md:text-4xl lg:text-5xl text-foreground">
              {storeConfig.products.title}
            </h1>
            <p className="mt-4 text-lg text-foreground/60 max-w-xl mx-auto">
              {storeConfig.products.subtitle}
            </p>
          </div>

          {/* Grid de Produtos com Busca e Filtros */}
          <ProductsGrid products={products} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
