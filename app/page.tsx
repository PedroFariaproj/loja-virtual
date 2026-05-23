/**
 * =============================================================================
 * PÁGINA INICIAL - HOME DA LOJA
 * =============================================================================
 * 
 * Página principal focada em apresentar a loja.
 * Os produtos estão na página /produtos
 * 
 * SEÇÕES:
 * 1. Hero Banner - Mensagem principal e CTAs
 * 2. Benefícios - Cards com vantagens da loja
 * 3. Sobre - Informações sobre a loja
 * 4. CTA - Chamada para ver produtos
 * 
 * COMO PERSONALIZAR:
 * Edite o arquivo lib/store-config.ts para alterar textos e configurações.
 * =============================================================================
 */

import { Header } from '@/components/store/header'
import { Footer } from '@/components/store/footer'
import { HeroSection } from '@/components/store/hero-section'
import { BenefitsSection } from '@/components/store/benefits-section'
import { AboutSection } from '@/components/store/about-section'
import { CtaSection } from '@/components/store/cta-section'

/**
 * Página inicial da loja.
 * Apresenta a loja e direciona para os produtos.
 */
export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Cabeçalho com navegação */}
      <Header />

      {/* Conteúdo principal */}
      <main className="flex-1">
        {/* Seção Hero - Banner principal com CTAs */}
        <HeroSection />

        {/* Seção de Benefícios */}
        <BenefitsSection />

        {/* Seção Sobre a Loja */}
        <AboutSection />

        {/* Seção CTA - Chamada para produtos */}
        <CtaSection />
      </main>

      {/* Rodapé */}
      <Footer />
    </div>
  )
}
