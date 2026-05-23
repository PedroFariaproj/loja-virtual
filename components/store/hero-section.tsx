/**
 * =============================================================================
 * HERO SECTION - BANNER PRINCIPAL
 * =============================================================================
 * 
 * Seção de destaque no topo da página inicial.
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
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-card/50 py-20 md:py-32">
      {/* Efeito de gradiente decorativo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          {/* Título Principal - textos do store-config.ts */}
          <h1 className="animate-fade-in text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl text-balance">
            {storeConfig.hero.titleStart}{' '}
            <span className="text-primary">{storeConfig.hero.titleHighlight}</span>
          </h1>

          {/* Subtítulo */}
          <p className="animate-fade-in mt-6 text-lg text-muted-foreground md:text-xl [animation-delay:200ms] text-pretty">
            {storeConfig.hero.subtitle}
          </p>

          {/* Botões de Ação */}
          <div className="animate-fade-in mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center [animation-delay:400ms]">
            {/* Botão Principal - Ver Produtos */}
            <Link href="/produtos">
              <Button size="lg" className="gap-2 text-lg hover-glow w-full sm:w-auto">
                {storeConfig.hero.buttonText}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            
            {/* Botão Secundário - WhatsApp (se configurado) */}
            {whatsappLink && (
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="gap-2 text-lg w-full sm:w-auto">
                  <MessageCircle className="h-5 w-5" />
                  {storeConfig.hero.secondaryButtonText}
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Decoração de fundo */}
      <div className="absolute -bottom-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
    </section>
  )
}
