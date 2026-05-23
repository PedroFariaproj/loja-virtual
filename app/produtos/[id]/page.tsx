/**
 * =============================================================================
 * PÁGINA DE DETALHES DO PRODUTO
 * =============================================================================
 * 
 * Exibe todas as informações de um produto específico:
 * - Galeria de imagens
 * - Nome, descrição, preço
 * - Seletor de quantidade
 * - Botão adicionar ao carrinho
 * =============================================================================
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/store/header'
import { Footer } from '@/components/store/footer'
import { ProductDetail } from '@/components/store/product-detail'
import type { Product, ProductImage } from '@/lib/types'

interface ProductPageProps {
  params: Promise<{ id: string }>
}

/**
 * Busca um produto específico pelo ID.
 */
async function getProduct(id: string): Promise<Product | null> {
  const supabase = await createClient()
  
  // Se o Supabase não está configurado, retorna null
  if (!supabase) {
    console.warn('[Produto] Supabase não configurado')
    return null
  }
  
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('active', true)
    .single()

  if (error) {
    console.error('Erro ao buscar produto:', error)
    return null
  }

  return product
}

/**
 * Busca as imagens adicionais do produto.
 */
async function getProductImages(productId: string): Promise<ProductImage[]> {
  const supabase = await createClient()
  
  // Se o Supabase não está configurado, retorna array vazio
  if (!supabase) {
    return []
  }
  
  const { data: images, error } = await supabase
    .from('product_images')
    .select('*')
    .eq('product_id', productId)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Erro ao buscar imagens:', error)
    return []
  }

  return images || []
}

/**
 * Gera os metadados dinâmicos para SEO.
 */
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    return {
      title: 'Produto não encontrado',
    }
  }

  return {
    title: product.name,
    description: product.description || `${product.name} - Compre agora com garantia e qualidade.`,
    openGraph: {
      title: product.name,
      description: product.description || undefined,
      images: product.main_image ? [product.main_image] : undefined,
    },
  }
}

/**
 * Página de detalhes do produto.
 */
export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = await getProduct(id)

  // Se o produto não existe ou está inativo, retorna 404
  if (!product) {
    notFound()
  }

  // Busca as imagens adicionais
  const images = await getProductImages(id)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <ProductDetail product={product} images={images} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
