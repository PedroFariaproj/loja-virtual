/**
 * =============================================================================
 * CTA SECTION - CALL TO ACTION
 * =============================================================================
 * 
 * Seção de destaque para direcionar o cliente para os produtos.
 * Visual clean estilo Apple - fundo sutil, tipografia elegante
 * Configuração vem do arquivo lib/store-config.ts
 * =============================================================================
 */

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { storeConfig } from '@/lib/store-config'

export function CtaSection() {
  if (!storeConfig.cta.show) return null

  return (
    <section className="py-20 md:py-32 bg-card/50 border-y border-border/40">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {/* Título */}
          <h2 className="text-2xl font-semibold md:text-3xl lg:text-4xl mb-5 text-foreground text-balance">
            {storeConfig.cta.title}
          </h2>

          {/* Descrição */}
          <p className="text-muted-foreground text-lg md:text-xl mb-10 text-pretty leading-relaxed">
            {storeConfig.cta.description}
          </p>

          {/* Botão */}
          <Button asChild size="lg" className="gap-2 text-base font-medium h-12 px-8 rounded-full hover-glow">
            <Link href="/produtos">
              {storeConfig.cta.buttonText}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
