/**
 * =============================================================================
 * ABOUT SECTION - SEÇÃO SOBRE A LOJA
 * =============================================================================
 * 
 * Seção que conta a história/informações sobre a loja.
 * Configuração vem do arquivo lib/store-config.ts
 * =============================================================================
 */

import { storeConfig } from '@/lib/store-config'

export function AboutSection() {
  // Não renderiza se a seção estiver desabilitada
  if (!storeConfig.about.show) return null

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          {/* Título */}
          <h2 className="text-2xl font-bold md:text-3xl mb-8">
            {storeConfig.about.title}
          </h2>

          {/* Parágrafos de descrição */}
          <div className="space-y-4 text-muted-foreground text-lg">
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
