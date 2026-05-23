/**
 * =============================================================================
 * CONFIGURAÇÃO DA LOJA - ARQUIVO CENTRAL DE PERSONALIZAÇÃO
 * =============================================================================
 * 
 * Este é o arquivo PRINCIPAL para personalizar sua loja.
 * Altere as informações abaixo para adaptar a loja ao seu nicho.
 * 
 * IMPORTANTE: Após alterar, salve o arquivo e a loja será atualizada.
 * =============================================================================
 */

export const storeConfig = {
  // =========================================================================
  // INFORMAÇÕES BÁSICAS DA LOJA
  // =========================================================================
  
  /** Nome da loja - aparece no header, footer e título das páginas */
  storeName: 'iPhone Premium',
  
  /** Slogan/tagline da loja */
  tagline: 'Os melhores iPhones com qualidade garantida',
  
  /** Descrição curta para SEO e subtítulos */
  description: 'Aparelhos premium revisados por especialistas. Garantia, qualidade e o melhor atendimento você encontra aqui.',
  
  /** Número do WhatsApp para pedidos (formato: 5511999999999) */
  whatsappNumber: '',
  
  // =========================================================================
  // TEXTOS DA PÁGINA INICIAL (HERO)
  // =========================================================================
  
  hero: {
    /** Título principal do banner (parte normal) */
    titleStart: 'Os melhores iPhones com',
    /** Título principal do banner (parte destacada em azul) */
    titleHighlight: 'qualidade garantida',
    /** Subtítulo/descrição abaixo do título */
    subtitle: 'Aparelhos premium revisados por especialistas. Garantia, qualidade e o melhor atendimento você encontra aqui.',
    /** Texto do botão principal */
    buttonText: 'Ver Produtos',
    /** Texto do botão secundário (opcional) */
    secondaryButtonText: 'Fale Conosco',
  },
  
  // =========================================================================
  // BENEFÍCIOS DA LOJA
  // =========================================================================
  
  /** Título da seção de benefícios */
  benefitsTitle: 'Por que escolher nossa loja?',
  
  /** Lista de benefícios - máximo 4 recomendado */
  benefits: [
    {
      icon: 'shield',        // Opções: shield, check, truck, headphones, star, heart, clock, award
      title: 'Garantia',
      description: 'Todos os aparelhos possuem garantia contra defeitos.',
    },
    {
      icon: 'check',
      title: 'Aparelhos Revisados',
      description: 'Cada iPhone passa por rigorosa inspeção técnica.',
    },
    {
      icon: 'truck',
      title: 'Entrega Rápida',
      description: 'Enviamos para todo o Brasil com agilidade.',
    },
    {
      icon: 'headphones',
      title: 'Atendimento Personalizado',
      description: 'Suporte dedicado para tirar todas as suas dúvidas.',
    },
  ],
  
  // =========================================================================
  // SEÇÃO "SOBRE A LOJA" (PÁGINA INICIAL)
  // =========================================================================
  
  about: {
    /** Mostrar seção sobre? */
    show: true,
    /** Título da seção */
    title: 'Sobre Nossa Loja',
    /** Parágrafos de descrição (cada item é um parágrafo) */
    paragraphs: [
      'Somos especialistas em iPhones e smartphones premium há mais de 5 anos no mercado.',
      'Nossa missão é oferecer aparelhos de qualidade com preços justos e atendimento excepcional.',
      'Todos os nossos produtos passam por rigorosa inspeção técnica antes de chegar até você.',
    ],
  },
  
  // =========================================================================
  // CALL TO ACTION (CTA) - SEÇÃO DE DESTAQUE
  // =========================================================================
  
  cta: {
    /** Mostrar seção CTA? */
    show: true,
    /** Título do CTA */
    title: 'Encontre o iPhone perfeito para você',
    /** Descrição do CTA */
    description: 'Navegue pelo nosso catálogo completo e encontre as melhores ofertas em iPhones e smartphones premium.',
    /** Texto do botão */
    buttonText: 'Explorar Produtos',
  },
  
  // =========================================================================
  // RODAPÉ
  // =========================================================================
  
  footer: {
    /** Texto de copyright (o ano é adicionado automaticamente) */
    copyright: 'Todos os direitos reservados.',
  },
  
  // =========================================================================
  // PÁGINA DE PRODUTOS
  // =========================================================================
  
  products: {
    /** Título da página */
    title: 'Nossos Produtos',
    /** Subtítulo/descrição */
    subtitle: 'Encontre o smartphone perfeito para você',
    /** Placeholder da barra de busca */
    searchPlaceholder: 'Buscar produtos...',
    /** Texto quando não há resultados */
    noResultsText: 'Nenhum produto encontrado',
    /** Texto quando não há produtos */
    emptyText: 'Em breve teremos novos produtos. Volte em breve!',
  },
}

// Tipo exportado para uso em componentes
export type StoreConfig = typeof storeConfig
