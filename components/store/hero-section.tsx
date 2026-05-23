/**
 * =============================================================================
 * HERO SECTION - BANNER PRINCIPAL
 * =============================================================================
 * 
 * Seção de destaque no topo da página inicial.
 * Visual escuro premium inspirado na Apple.
 * 
 * TEXTOS: Vêm do arquivo lib/store-config.ts (fácil de editar)
 * WHATSAPP: Vem do banco de dados (Admin > Configurações)
 * =============================================================================
 */

'use client'

import Link from 'next/link'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { storeConfig } from '@/lib/store-config'
import { useStoreSettings } from '@/hooks/use-store-settings'

export function HeroSection() {
  const { whatsappNumber } = useStoreSettings()
  
  // Monta o link do WhatsApp se configurado (do banco de dados)
  const whatsappLink = whatsappNumber 
    ? `https://wa.me/${whatsappNumber}?text=Olá! Gostaria de saber mais sobre os produtos.`
    : null

  return (
    <section className="relative py-24 md:py-32 lg:py-40">
      <div className="container relative mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Título Principal - textos do store-config.ts */}
          <h1 className="animate-fade-in text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl text-balance leading-[1.1]">
            {storeConfig.hero.titleStart}{' '}
            <span className="text-primary">{storeConfig.hero.titleHighlight}</span>
          </h1>

          {/* Subtítulo */}
          <p className="animate-fade-in mt-6 text-lg text-muted-foreground md:text-xl [animation-delay:200ms] text-pretty max-w-2xl mx-auto leading-relaxed">
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
            
            {/* Botão Secundário - WhatsApp (se configurado no banco) */}
            {whatsappLink && (
              <Button asChild size="lg" variant="outline" className="gap-2 text-base font-medium h-12 px-8 rounded-full border-border hover:bg-secondary">
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
