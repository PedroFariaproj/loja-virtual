/**
 * =============================================================================
 * BENEFITS SECTION - SEÇÃO DE BENEFÍCIOS
 * =============================================================================
 * 
 * Exibe os benefícios da loja em cards minimalistas.
 * Visual clean inspirado na Apple
 * Configuração vem do arquivo lib/store-config.ts
 * =============================================================================
 */

import { Shield, CheckCircle, Truck, Headphones, Star, Heart, Clock, Award } from 'lucide-react'
import { storeConfig } from '@/lib/store-config'

// Mapeamento de ícones disponíveis
const iconMap = {
  shield: Shield,
  check: CheckCircle,
  truck: Truck,
  headphones: Headphones,
  star: Star,
  heart: Heart,
  clock: Clock,
  award: Award,
}

export function BenefitsSection() {
  return (
    <section className="py-20 md:py-28 border-y border-border/50 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Título da Seção */}
        <h2 className="mb-16 text-center text-2xl font-semibold md:text-3xl lg:text-4xl text-foreground">
          {storeConfig.benefitsTitle}
        </h2>

        {/* Grid de Benefícios - Layout clean */}
        <div className="grid gap-12 md:gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {storeConfig.benefits.map((benefit, index) => {
            const IconComponent = iconMap[benefit.icon as keyof typeof iconMap] || Shield
            
            return (
              <div 
                key={benefit.title}
                className="animate-fade-in flex flex-col items-center text-center"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Ícone minimalista */}
                <div className="mb-5">
                  <IconComponent className="h-8 w-8 text-primary" strokeWidth={1.5} />
                </div>
                
                {/* Título do Benefício */}
                <h3 className="mb-2 text-base font-semibold text-foreground">
                  {benefit.title}
                </h3>
                
                {/* Descrição */}
                <p className="text-sm text-foreground/60 leading-relaxed max-w-[200px]">
                  {benefit.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
