/**
 * =============================================================================
 * PRODUCT DETAIL - COMPONENTE DE DETALHES DO PRODUTO
 * =============================================================================
 * 
 * Exibe os detalhes completos de um produto:
 * - Galeria de imagens com navegação
 * - Informações do produto (nome, descrição, preço)
 * - Seletor de quantidade
 * - Botão para adicionar ao carrinho
 * =============================================================================
 */

'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Minus, Plus, ShoppingCart, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/hooks/use-cart'
import type { Product, ProductImage } from '@/lib/types'

interface ProductDetailProps {
  product: Product
  images: ProductImage[]
}

export function ProductDetail({ product, images }: ProductDetailProps) {
  // Estado para quantidade selecionada
  const [quantity, setQuantity] = useState(1)
  // Estado para imagem ativa na galeria
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  // Estado para feedback de adição ao carrinho
  const [isAdded, setIsAdded] = useState(false)
  
  // Hook do carrinho
  const { addItem } = useCart()

  // Hidratação do carrinho
  useEffect(() => {
    useCart.persist.rehydrate()
  }, [])

  // Monta array de todas as imagens (principal + galeria)
  const allImages = [
    ...(product.main_image ? [product.main_image] : []),
    ...images.map(img => img.image_url)
  ]

  /**
   * Incrementa a quantidade (respeitando o estoque).
   */
  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1)
    }
  }

  /**
   * Decrementa a quantidade (mínimo 1).
   */
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  /**
   * Adiciona o produto ao carrinho.
   */
  const handleAddToCart = () => {
    // Adiciona a quantidade selecionada
    for (let i = 0; i < quantity; i++) {
      addItem(product)
    }
    
    // Feedback visual
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <div className="animate-fade-in">
      {/* Botão Voltar */}
      <Link href="/produtos" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Voltar para produtos
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Coluna da Galeria de Imagens */}
        <div className="space-y-4">
          {/* Imagem Principal */}
          <Card className="aspect-square overflow-hidden bg-muted">
            {allImages.length > 0 ? (
              <div className="relative h-full w-full">
                <Image
                  src={allImages[activeImageIndex]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-6xl text-muted-foreground/50">📱</span>
              </div>
            )}
          </Card>

          {/* Miniaturas da Galeria */}
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {allImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                    index === activeImageIndex 
                      ? 'border-primary' 
                      : 'border-transparent hover:border-border'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - Imagem ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Coluna de Informações */}
        <div className="space-y-6">
          {/* Nome do Produto */}
          <h1 className="text-3xl font-bold md:text-4xl">{product.name}</h1>

          {/* Preço */}
          <p className="text-3xl font-bold text-primary">
            {formatPrice(product.price)}
          </p>

          {/* Descrição */}
          {product.description && (
            <div className="prose prose-invert max-w-none">
              <p className="text-muted-foreground whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
          )}

          {/* Estoque */}
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-muted-foreground">
              {product.stock > 0 
                ? `${product.stock} unidade${product.stock > 1 ? 's' : ''} em estoque`
                : 'Produto esgotado'
              }
            </span>
          </div>

          {/* Seletor de Quantidade */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Quantidade:</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Subtotal */}
          {product.stock > 0 && quantity > 1 && (
            <p className="text-sm text-muted-foreground">
              Subtotal: <span className="font-medium text-foreground">{formatPrice(product.price * quantity)}</span>
            </p>
          )}

          {/* Botão Adicionar ao Carrinho */}
          <Button
            size="lg"
            className="w-full gap-2 text-lg"
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAdded}
          >
            {isAdded ? (
              <>
                <Check className="h-5 w-5" />
                Adicionado!
              </>
            ) : (
              <>
                <ShoppingCart className="h-5 w-5" />
                Adicionar ao Carrinho
              </>
            )}
          </Button>

          {/* Aviso de estoque baixo */}
          {product.stock > 0 && product.stock <= 3 && (
            <p className="text-sm text-destructive text-center">
              Corra! Restam apenas {product.stock} unidade{product.stock > 1 ? 's' : ''}!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
