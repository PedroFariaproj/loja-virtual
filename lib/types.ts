/**
 * =============================================================================
 * TIPOS TYPESCRIPT - DEFINIÇÕES DO BANCO DE DADOS
 * =============================================================================
 * 
 * Este arquivo contém todas as definições de tipos para o sistema.
 * Mantém o código type-safe e facilita o autocomplete.
 * 
 * COMO ATUALIZAR:
 * Quando adicionar novas colunas às tabelas no Supabase,
 * atualize as interfaces correspondentes aqui.
 * =============================================================================
 */

/**
 * Perfil de um administrador do sistema.
 * Vinculado ao auth.users do Supabase.
 */
export interface Profile {
  /** ID único (mesmo ID do auth.users) */
  id: string
  /** Nome completo do administrador */
  name: string
  /** Email do administrador */
  email: string
  /** Se o administrador está ativo no sistema */
  active: boolean
  /** Data de criação do perfil */
  created_at: string
}

/**
 * Produto da loja (iPhone, smartphone, etc.).
 */
export interface Product {
  /** ID único do produto */
  id: string
  /** Nome do produto (ex: "iPhone 15 Pro Max 256GB") */
  name: string
  /** Descrição detalhada do produto */
  description: string | null
  /** Preço em centavos (ex: 599900 = R$ 5.999,00) */
  price: number
  /** Quantidade em estoque */
  stock: number
  /** Se o produto está ativo (visível na loja) */
  active: boolean
  /** URL da imagem principal */
  main_image: string | null
  /** Data de criação */
  created_at: string
  /** Data da última atualização */
  updated_at: string
}

/**
 * Imagem adicional de um produto (galeria).
 */
export interface ProductImage {
  /** ID único da imagem */
  id: string
  /** ID do produto relacionado */
  product_id: string
  /** URL da imagem no Supabase Storage */
  image_url: string
  /** Ordem de exibição na galeria */
  display_order: number
  /** Data de criação */
  created_at: string
}

/**
 * Configurações gerais da loja.
 */
export interface Settings {
  /** ID único das configurações */
  id: string
  /** Nome da loja */
  store_name: string
  /** Número do WhatsApp (formato: 5511999999999) */
  whatsapp_number: string
  /** URL do logo da loja */
  logo_url: string | null
  /** Cor primária em hexadecimal */
  primary_color: string
  /** Data de criação */
  created_at: string
  /** Data da última atualização */
  updated_at: string
}

/**
 * Item do carrinho de compras.
 * Armazenado localmente no navegador.
 */
export interface CartItem {
  /** Produto no carrinho */
  product: Product
  /** Quantidade desejada */
  quantity: number
}

/**
 * Estado do carrinho de compras.
 */
export interface CartState {
  /** Lista de itens no carrinho */
  items: CartItem[]
  /** Adicionar produto ao carrinho */
  addItem: (product: Product) => void
  /** Remover produto do carrinho */
  removeItem: (productId: string) => void
  /** Atualizar quantidade de um item */
  updateQuantity: (productId: string, quantity: number) => void
  /** Limpar o carrinho */
  clearCart: () => void
  /** Calcular total do carrinho */
  getTotal: () => number
  /** Obter quantidade total de itens */
  getTotalItems: () => number
}
