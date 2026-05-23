/**
 * =============================================================================
 * HERO SECTION - BANNER PRINCIPAL
 * =============================================================================
 * 
 * Seção de destaque no topo da página inicial.
 * Visual clean inspirado na Apple - muito espaço em branco
 * Textos vêm do arquivo lib/store-config.ts
 * =============================================================================
 */

import Link from 'next/link'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { storeConfig } from '@/lib/store-config'

export function HeroSection() {
  // Monta o link do WhatsApp se configurado
  const whatsappLink = storeConfig.whatsappNumber 
    ? `https://wa.me/${storeConfig.whatsappNumber}?text=Olá! Gostaria de saber mais sobre os produtos.`
    : null

  return (
    <section className="relative py-24 md:py-40 lg:py-48">
      <div className="container relative mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Título Principal - textos do store-config.ts */}
          <h1 className="animate-fade-in text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl text-balance leading-[1.1]">
            {storeConfig.hero.titleStart}{' '}
            <span className="text-primary">{storeConfig.hero.titleHighlight}</span>
          </h1>

          {/* Subtítulo */}
          <p className="animate-fade-in mt-6 text-lg text-foreground/60 md:text-xl lg:text-2xl [animation-delay:200ms] text-pretty max-w-2xl mx-auto leading-relaxed">
            {storeConfig.hero.subtitle}
          </p>

          {/* Botões de Ação */}
          <div className="animate-fade-in mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center [animation-delay:400ms]">
            {/* Botão Principal - Ver Produtos */}
            <Button asChild size="lg" className="gap-2 text-base font-medium h-12 px-8 rounded-full hover-glow">
              <Link href="/produtos">
                {storeConfig.hero.buttonText}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            
            {/* Botão Secundário - WhatsApp (se configurado) */}
            {whatsappLink && (
              <Button asChild size="lg" variant="outline" className="gap-2 text-base font-medium h-12 px-8 rounded-full border-foreground/20 hover:bg-foreground/5">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  {storeConfig.hero.secondaryButtonText}
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
