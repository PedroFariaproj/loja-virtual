/**
 * =============================================================================
 * PRODUCT CARD - CARD DE PRODUTO
 * =============================================================================
 * 
 * Componente que exibe um produto em formato de card.
 * Visual clean inspirado na Apple - minimalista e elegante
 * =============================================================================
 */

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/hooks/use-cart'
import type { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem(product)
  }

  return (
    <div className="group">
      {/* Imagem do Produto - Link para página de detalhes */}
      <Link href={`/produtos/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary/50 mb-4">
          {product.main_image ? (
            <Image
              src={product.main_image}
              alt={product.name}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-5xl opacity-30">📱</span>
            </div>
          )}
          
          {/* Badge de estoque baixo */}
          {product.stock > 0 && product.stock <= 3 && (
            <span className="absolute top-3 left-3 rounded-full bg-foreground text-background px-3 py-1 text-xs font-medium">
              Últimas unidades
            </span>
          )}
          
          {/* Badge de esgotado */}
          {product.stock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
              <span className="rounded-full bg-foreground/10 px-4 py-2 text-sm font-medium text-foreground">
                Esgotado
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Informações do Produto */}
      <div className="space-y-2">
        <Link href={`/produtos/${product.id}`} className="block">
          <h3 className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-lg font-semibold text-foreground">
          {formatPrice(product.price)}
        </p>
        
        {/* Botão Adicionar ao Carrinho */}
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          variant="secondary"
          size="sm"
          className="w-full gap-2 mt-3 rounded-full font-medium"
        >
          <ShoppingCart className="h-4 w-4" />
          Adicionar ao Carrinho
        </Button>
      </div>
    </div>
  )
}
