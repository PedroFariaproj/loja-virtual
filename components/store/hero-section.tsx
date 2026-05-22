/**
 * =============================================================================
 * HERO SECTION - BANNER PRINCIPAL
 * =============================================================================
 * 
 * Seção de destaque no topo da página inicial.
 * Contém a mensagem principal da loja e o botão de CTA.
 * 
 * COMO ALTERAR:
 * - Título: Modifique o texto dentro do <h1>
 * - Subtítulo: Modifique o texto dentro do <p>
 * - Botão: Altere o texto e/ou o link do botão
 * =============================================================================
 */

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-card/50 py-20 md:py-32">
      {/* Efeito de gradiente decorativo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          {/* Título Principal */}
          <h1 className="animate-fade-in text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            {/* ALTERE AQUI: Título principal do banner */}
            Os melhores iPhones com{' '}
            <span className="text-primary">qualidade garantida</span>
          </h1>

          {/* Subtítulo */}
          <p className="animate-fade-in mt-6 text-lg text-muted-foreground md:text-xl [animation-delay:200ms]">
            {/* ALTERE AQUI: Subtítulo/descrição do banner */}
            Aparelhos premium revisados por especialistas. 
            Garantia, qualidade e o melhor atendimento você encontra aqui.
          </p>

          {/* Botão de Ação */}
          <div className="animate-fade-in mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center [animation-delay:400ms]">
            <Link href="/produtos">
              <Button size="lg" className="gap-2 text-lg hover-glow">
                {/* ALTERE AQUI: Texto do botão */}
                Ver Produtos
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Decoração de fundo - círculos sutis */}
      <div className="absolute -bottom-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
    </section>
  )
}
