/**
 * =============================================================================
 * BENEFITS SECTION - SEÇÃO DE BENEFÍCIOS
 * =============================================================================
 * 
 * Exibe os benefícios da loja em cards.
 * Configuração vem do arquivo lib/store-config.ts
 * =============================================================================
 */

import { Shield, CheckCircle, Truck, Headphones, Star, Heart, Clock, Award } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
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
    <section className="border-y border-border/40 bg-card/30 py-16">
      <div className="container mx-auto px-4">
        {/* Título da Seção - do store-config.ts */}
        <h2 className="mb-12 text-center text-2xl font-bold md:text-3xl">
          {storeConfig.benefitsTitle}
        </h2>

        {/* Grid de Benefícios */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {storeConfig.benefits.map((benefit, index) => {
            // Busca o ícone correto do mapeamento
            const IconComponent = iconMap[benefit.icon as keyof typeof iconMap] || Shield
            
            return (
              <Card 
                key={benefit.title}
                className="animate-slide-up border-border/50 bg-card/50 transition-colors hover:border-primary/50"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="flex flex-col items-center p-6 text-center">
                  {/* Ícone */}
                  <div className="mb-4 rounded-full bg-primary/10 p-3">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  
                  {/* Título do Benefício */}
                  <h3 className="mb-2 font-semibold">{benefit.title}</h3>
                  
                  {/* Descrição */}
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
