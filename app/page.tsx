/**
 * =============================================================================
 * PÁGINA INICIAL - HOME DA LOJA
 * =============================================================================
 * 
 * Página principal da loja virtual.
 * Exibe o banner hero, seção de benefícios e produtos em destaque.
 * 
 * SEÇÕES:
 * 1. Hero Banner - Mensagem principal e CTA
 * 2. Benefícios - 4 cards com vantagens da loja
 * 3. Produtos em Destaque - Grid de produtos ativos
 * =============================================================================
 */

import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/store/header'
import { Footer } from '@/components/store/footer'
import { HeroSection } from '@/components/store/hero-section'
import { BenefitsSection } from '@/components/store/benefits-section'
import { ProductsSection } from '@/components/store/products-section'

/**
 * Busca os produtos ativos do banco de dados.
 * Ordena por data de criação (mais recentes primeiro).
 */
async function getProducts() {
  const supabase = await createClient()
  
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(8) // Limita a 8 produtos na home

  if (error) {
    console.error('Erro ao buscar produtos:', error)
    return []
  }

  return products || []
}

/**
 * Página inicial da loja.
 * Server Component que busca os dados do banco.
 */
export default async function HomePage() {
  // Busca produtos do banco de dados
  const products = await getProducts()

  return (
    <div className="flex min-h-screen flex-col">
      {/* Cabeçalho com navegação */}
      <Header />

      {/* Conteúdo principal */}
      <main className="flex-1">
        {/* Seção Hero - Banner principal */}
        <HeroSection />

        {/* Seção de Benefícios */}
        <BenefitsSection />

        {/* Seção de Produtos em Destaque */}
        <ProductsSection products={products} />
      </main>

      {/* Rodapé */}
      <Footer />
    </div>
  )
}
