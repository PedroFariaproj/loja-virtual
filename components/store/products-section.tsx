/**
 * =============================================================================
 * PRODUCTS SECTION - SEÇÃO DE PRODUTOS EM DESTAQUE
 * =============================================================================
 * 
 * Exibe os produtos em destaque em um grid responsivo.
 * Mostra uma mensagem quando não há produtos cadastrados.
 * =============================================================================
 */

import Link from 'next/link'
import { ArrowRight, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from './product-card'
import type { Product } from '@/lib/types'

interface ProductsSectionProps {
  /** Lista de produtos a serem exibidos */
  products: Product[]
}

export function ProductsSection({ products }: ProductsSectionProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Cabeçalho da Seção */}
        <div className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">
              Produtos em Destaque
            </h2>
            <p className="mt-2 text-muted-foreground">
              Confira os iPhones disponíveis em nossa loja
            </p>
          </div>
          
          {/* Link para ver todos */}
          {products.length > 0 && (
            <Link href="/produtos">
              <Button variant="outline" className="gap-2">
                Ver Todos
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>

        {/* Grid de Produtos ou Estado Vazio */}
        {products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, index) => (
              <div 
                key={product.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          // Estado Vazio - Nenhum produto cadastrado
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/60 bg-card/30 py-16">
            <Package className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">
              Nenhum produto disponível
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Em breve teremos novidades. Aguarde!
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
