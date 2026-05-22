/**
 * =============================================================================
 * PÁGINA DE CATÁLOGO - LISTA DE PRODUTOS
 * =============================================================================
 * 
 * Exibe todos os produtos ativos da loja em um grid responsivo.
 * Inclui busca e filtros básicos.
 * =============================================================================
 */

import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/store/header'
import { Footer } from '@/components/store/footer'
import { ProductCard } from '@/components/store/product-card'
import { Package } from 'lucide-react'
import type { Product } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Produtos',
  description: 'Confira todos os iPhones e smartphones disponíveis em nossa loja.',
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
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Cabeçalho da Página */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold md:text-4xl">Nossos Produtos</h1>
            <p className="mt-2 text-muted-foreground">
              {products.length > 0 
                ? `${products.length} produto${products.length > 1 ? 's' : ''} disponível${products.length > 1 ? 'is' : ''}`
                : 'Nenhum produto disponível no momento'
              }
            </p>
          </div>

          {/* Grid de Produtos ou Estado Vazio */}
          {products.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product, index) => (
                <div 
                  key={product.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/60 bg-card/30 py-20">
              <Package className="h-16 w-16 text-muted-foreground/50" />
              <h2 className="mt-6 text-xl font-medium">Nenhum produto disponível</h2>
              <p className="mt-2 text-center text-muted-foreground">
                Em breve teremos novos iPhones para você.<br />
                Volte em breve!
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
