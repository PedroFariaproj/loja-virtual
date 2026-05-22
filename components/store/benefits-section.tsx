/**
 * =============================================================================
 * BENEFITS SECTION - SEÇÃO DE BENEFÍCIOS
 * =============================================================================
 * 
 * Exibe os 4 principais benefícios da loja em cards.
 * 
 * COMO ALTERAR:
 * - Modifique o array 'benefits' abaixo
 * - Cada benefício tem: icon, title, description
 * =============================================================================
 */

import { Shield, CheckCircle, Truck, Headphones } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

/**
 * Lista de benefícios da loja.
 * ALTERE AQUI para personalizar os benefícios exibidos.
 */
const benefits = [
  {
    icon: Shield,
    title: 'Garantia',
    description: 'Todos os aparelhos possuem garantia contra defeitos.',
  },
  {
    icon: CheckCircle,
    title: 'Aparelhos Revisados',
    description: 'Cada iPhone passa por rigorosa inspeção técnica.',
  },
  {
    icon: Truck,
    title: 'Entrega Rápida',
    description: 'Enviamos para todo o Brasil com agilidade.',
  },
  {
    icon: Headphones,
    title: 'Atendimento Personalizado',
    description: 'Suporte dedicado para tirar todas as suas dúvidas.',
  },
]

export function BenefitsSection() {
  return (
    <section className="border-y border-border/40 bg-card/30 py-16">
      <div className="container mx-auto px-4">
        {/* Título da Seção */}
        <h2 className="mb-12 text-center text-2xl font-bold md:text-3xl">
          Por que escolher nossa loja?
        </h2>

        {/* Grid de Benefícios */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <Card 
              key={benefit.title}
              className="animate-slide-up border-border/50 bg-card/50 transition-colors hover:border-primary/50"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="flex flex-col items-center p-6 text-center">
                {/* Ícone */}
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                
                {/* Título do Benefício */}
                <h3 className="mb-2 font-semibold">{benefit.title}</h3>
                
                {/* Descrição */}
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
