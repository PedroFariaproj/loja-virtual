/**
 * =============================================================================
 * ABOUT SECTION - SEÇÃO SOBRE A LOJA
 * =============================================================================
 * 
 * Seção que conta a história/informações sobre a loja.
 * Visual clean estilo Apple
 * Configuração vem do arquivo lib/store-config.ts
 * =============================================================================
 */

import { storeConfig } from '@/lib/store-config'

export function AboutSection() {
  if (!storeConfig.about.show) return null

  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Título */}
          <h2 className="text-2xl font-semibold md:text-3xl lg:text-4xl mb-10 text-foreground">
            {storeConfig.about.title}
          </h2>

          {/* Parágrafos de descrição */}
          <div className="space-y-6 text-muted-foreground text-lg md:text-xl leading-relaxed">
            {storeConfig.about.paragraphs.map((paragraph, index) => (
              <p 
                key={index}
                className="animate-fade-in text-pretty"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
