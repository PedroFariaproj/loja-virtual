/**
 * =============================================================================
 * PRODUCT CARD - CARD DE PRODUTO
 * =============================================================================
 * 
 * Componente que exibe um produto em formato de card.
 * Usado na listagem de produtos e na página inicial.
 * 
 * CARACTERÍSTICAS:
 * - Imagem do produto com fallback
 * - Nome e preço formatado
 * - Botões de ação (ver detalhes, adicionar ao carrinho)
 * - Animações suaves em hover
 * =============================================================================
 */

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/hooks/use-cart'
import type { Product } from '@/lib/types'

interface ProductCardProps {
  /** Dados do produto a ser exibido */
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  // Hook do carrinho para adicionar produtos
  const { addItem } = useCart()

  /**
   * Adiciona o produto ao carrinho.
   * Exibe feedback visual (o badge do header atualiza automaticamente).
   */
  const handleAddToCart = () => {
    addItem(product)
  }

  return (
    <Card className="group overflow-hidden border-border/50 bg-card/50 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
      {/* Imagem do Produto */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.main_image ? (
          <Image
            src={product.main_image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          // Fallback quando não há imagem
          <div className="flex h-full items-center justify-center">
            <span className="text-4xl text-muted-foreground/50">📱</span>
          </div>
        )}
        
        {/* Badge de estoque baixo */}
        {product.stock > 0 && product.stock <= 3 && (
          <span className="absolute top-2 right-2 rounded-full bg-destructive/90 px-2 py-1 text-xs font-medium text-destructive-foreground">
            Últimas unidades
          </span>
        )}
        
        {/* Badge de esgotado */}
        {product.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <span className="rounded-full bg-muted px-4 py-2 text-sm font-medium">
              Esgotado
            </span>
          </div>
        )}
      </div>

      {/* Informações do Produto */}
      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground line-clamp-2 min-h-[3rem]">
          {product.name}
        </h3>
        <p className="mt-2 text-xl font-bold text-primary">
          {formatPrice(product.price)}
        </p>
      </CardContent>

      {/* Botões de Ação */}
      <CardFooter className="flex gap-2 p-4 pt-0">
        {/* Botão Ver Detalhes */}
        <Link href={`/produtos/${product.id}`} className="flex-1">
          <Button variant="outline" className="w-full gap-2">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Ver Detalhes</span>
            <span className="sm:hidden">Ver</span>
          </Button>
        </Link>
        
        {/* Botão Adicionar ao Carrinho */}
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="flex-1 gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          <span className="hidden sm:inline">Adicionar</span>
          <span className="sm:hidden">+</span>
        </Button>
      </CardFooter>
    </Card>
  )
}
