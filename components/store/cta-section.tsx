/**
 * =============================================================================
 * CTA SECTION - CALL TO ACTION
 * =============================================================================
 * 
 * Seção de destaque para direcionar o cliente para os produtos.
 * Configuração vem do arquivo lib/store-config.ts
 * =============================================================================
 */

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { storeConfig } from '@/lib/store-config'

export function CtaSection() {
  // Não renderiza se a seção estiver desabilitada
  if (!storeConfig.cta.show) return null

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-card/50 to-background">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          {/* Título */}
          <h2 className="text-2xl font-bold md:text-4xl mb-4 text-balance">
            {storeConfig.cta.title}
          </h2>

          {/* Descrição */}
          <p className="text-muted-foreground text-lg mb-8 text-pretty">
            {storeConfig.cta.description}
          </p>

          {/* Botão */}
          <Link href="/produtos">
            <Button size="lg" className="gap-2 text-lg hover-glow">
              {storeConfig.cta.buttonText}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
