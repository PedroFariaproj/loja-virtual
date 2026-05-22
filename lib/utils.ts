/**
 * =============================================================================
 * FUNÇÕES UTILITÁRIAS - HELPERS DO SISTEMA
 * =============================================================================
 * 
 * Este arquivo contém funções auxiliares usadas em todo o sistema.
 * Inclui formatação de moeda, geração de mensagens, etc.
 * =============================================================================
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { CartItem } from './types'

/**
 * Combina classes CSS de forma inteligente.
 * Evita conflitos entre classes do Tailwind.
 * 
 * @param inputs - Classes CSS para combinar
 * @returns String com as classes combinadas
 * 
 * @example
 * cn("px-4 py-2", "px-6") // retorna "py-2 px-6"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formata um valor em centavos para moeda brasileira (BRL).
 * 
 * @param cents - Valor em centavos (ex: 599900)
 * @returns String formatada (ex: "R$ 5.999,00")
 * 
 * @example
 * formatPrice(599900) // "R$ 5.999,00"
 * formatPrice(9990) // "R$ 99,90"
 */
export function formatPrice(cents: number): string {
  const value = cents / 100
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Gera a mensagem do pedido para enviar via WhatsApp.
 * 
 * @param items - Itens do carrinho
 * @param customerName - Nome do cliente
 * @returns Mensagem formatada para WhatsApp
 */
export function generateWhatsAppMessage(
  items: CartItem[],
  customerName: string
): string {
  // Cabeçalho da mensagem
  let message = `Olá!\n\nGostaria de realizar o seguinte pedido:\n\n`

  // Lista cada produto
  items.forEach((item) => {
    const subtotal = item.product.price * item.quantity
    message += `*Produto:* ${item.product.name}\n`
    message += `*Quantidade:* ${item.quantity}\n`
    message += `*Valor:* ${formatPrice(subtotal)}\n\n`
  })

  // Calcula e adiciona o total
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )
  message += `*Total do Pedido:* ${formatPrice(total)}\n\n`

  // Adiciona nome do cliente
  message += `*Meu nome é:* ${customerName}\n\n`
  message += `Obrigado!`

  return message
}

/**
 * Gera a URL do WhatsApp com a mensagem pré-preenchida.
 * 
 * @param phoneNumber - Número do WhatsApp (formato: 5511999999999)
 * @param message - Mensagem a ser enviada
 * @returns URL do wa.me pronta para abrir
 * 
 * @example
 * generateWhatsAppUrl("5511999999999", "Olá!") 
 * // "https://wa.me/5511999999999?text=Ol%C3%A1!"
 */
export function generateWhatsAppUrl(
  phoneNumber: string,
  message: string
): string {
  // Remove caracteres não numéricos do telefone
  const cleanPhone = phoneNumber.replace(/\D/g, '')
  // Codifica a mensagem para URL
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
}

/**
 * Valida se uma string é um email válido.
 * 
 * @param email - Email a ser validado
 * @returns true se for um email válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valida se uma string é um número de telefone brasileiro válido.
 * 
 * @param phone - Telefone a ser validado
 * @returns true se for um telefone válido
 */
export function isValidPhone(phone: string): boolean {
  const cleanPhone = phone.replace(/\D/g, '')
  // Telefone brasileiro: 10 ou 11 dígitos (com DDD)
  return cleanPhone.length >= 10 && cleanPhone.length <= 13
}

/**
 * Trunca um texto mantendo palavras completas.
 * 
 * @param text - Texto a ser truncado
 * @param maxLength - Tamanho máximo
 * @returns Texto truncado com "..." se necessário
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}
