/**
 * =============================================================================
 * HOOK USE-CART - GERENCIAMENTO DO CARRINHO DE COMPRAS
 * =============================================================================
 * 
 * Hook personalizado para gerenciar o estado do carrinho de compras.
 * Utiliza localStorage para persistir os dados entre sessões.
 * 
 * FUNCIONALIDADES:
 * - Adicionar/remover produtos
 * - Atualizar quantidades
 * - Calcular totais
 * - Persistência no localStorage
 * 
 * COMO USAR:
 * const { items, addItem, removeItem, updateQuantity, clearCart, getTotal } = useCart()
 * =============================================================================
 */

'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product, CartItem } from '@/lib/types'

/**
 * Interface do estado do carrinho.
 */
interface CartState {
  /** Lista de itens no carrinho */
  items: CartItem[]
  /** Adiciona um produto ao carrinho */
  addItem: (product: Product) => void
  /** Remove um produto do carrinho */
  removeItem: (productId: string) => void
  /** Atualiza a quantidade de um item */
  updateQuantity: (productId: string, quantity: number) => void
  /** Limpa todo o carrinho */
  clearCart: () => void
  /** Calcula o total do carrinho em centavos */
  getTotal: () => number
  /** Obtém a quantidade total de itens */
  getTotalItems: () => number
}

/**
 * Store do carrinho usando Zustand.
 * Os dados são persistidos no localStorage automaticamente.
 * 
 * IMPORTANTE: skipHydration evita erros de hidratação SSR/Client
 */
export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      // Estado inicial: carrinho vazio
      items: [],

      /**
       * Adiciona um produto ao carrinho.
       * Se o produto já existir, incrementa a quantidade.
       * 
       * @param product - Produto a ser adicionado
       */
      addItem: (product: Product) => {
        const items = get().items
        const existingItem = items.find((item) => item.product.id === product.id)

        if (existingItem) {
          // Produto já existe: incrementa quantidade
          set({
            items: items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          })
        } else {
          // Produto novo: adiciona ao carrinho
          set({ items: [...items, { product, quantity: 1 }] })
        }
      },

      /**
       * Remove um produto do carrinho.
       * 
       * @param productId - ID do produto a ser removido
       */
      removeItem: (productId: string) => {
        set({
          items: get().items.filter((item) => item.product.id !== productId),
        })
      },

      /**
       * Atualiza a quantidade de um item.
       * Se a quantidade for 0 ou menor, remove o item.
       * 
       * @param productId - ID do produto
       * @param quantity - Nova quantidade
       */
      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          // Quantidade zero: remove o item
          get().removeItem(productId)
        } else {
          // Atualiza a quantidade
          set({
            items: get().items.map((item) =>
              item.product.id === productId ? { ...item, quantity } : item
            ),
          })
        }
      },

      /**
       * Limpa todos os itens do carrinho.
       */
      clearCart: () => {
        set({ items: [] })
      },

      /**
       * Calcula o valor total do carrinho em centavos.
       * 
       * @returns Total em centavos
       */
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        )
      },

      /**
       * Obtém a quantidade total de itens no carrinho.
       * Soma as quantidades de todos os produtos.
       * 
       * @returns Número total de itens
       */
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
    }),
    {
      // Nome da chave no localStorage
      name: 'cart-storage',
      // Evita hidratação automática para prevenir mismatch SSR/Client
      skipHydration: true,
    }
  )
)
