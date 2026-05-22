/**
 * =============================================================================
 * CART CONTENT - CONTEÚDO DO CARRINHO
 * =============================================================================
 * 
 * Componente client-side que gerencia o carrinho:
 * - Lista de itens com controle de quantidade
 * - Cálculo de totais
 * - Formulário para nome do cliente
 * - Botão para finalizar via WhatsApp
 * =============================================================================
 */

'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Minus, Plus, ShoppingBag, MessageCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { formatPrice, generateWhatsAppMessage, generateWhatsAppUrl } from '@/lib/utils'
import { useCart } from '@/hooks/use-cart'

interface CartContentProps {
  /** Número do WhatsApp configurado na loja */
  whatsappNumber: string
}

export function CartContent({ whatsappNumber }: CartContentProps) {
  // Estado do carrinho
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCart()
  
  // Nome do cliente para o pedido
  const [customerName, setCustomerName] = useState('')
  
  // Estado de carregamento
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Finaliza o pedido abrindo o WhatsApp.
   */
  const handleCheckout = () => {
    if (!customerName.trim()) {
      alert('Por favor, informe seu nome para continuar.')
      return
    }

    if (!whatsappNumber) {
      alert('Número de WhatsApp não configurado. Entre em contato com a loja.')
      return
    }

    setIsLoading(true)

    // Gera a mensagem do pedido
    const message = generateWhatsAppMessage(items, customerName)
    
    // Gera a URL do WhatsApp
    const whatsappUrl = generateWhatsAppUrl(whatsappNumber, message)
    
    // Abre o WhatsApp em nova aba
    window.open(whatsappUrl, '_blank')
    
    // Limpa o carrinho após enviar
    clearCart()
    setCustomerName('')
    setIsLoading(false)
  }

  // Carrinho vazio
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/50" />
        <h2 className="mt-6 text-xl font-medium">Seu carrinho está vazio</h2>
        <p className="mt-2 text-muted-foreground text-center">
          Adicione produtos para continuar comprando.
        </p>
        <Link href="/produtos" className="mt-6">
          <Button className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Continuar Comprando
          </Button>
        </Link>
      </div>
    )
  }

  const total = getTotal()

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Lista de Itens */}
      <div className="lg:col-span-2 space-y-4">
        {items.map((item) => (
          <Card key={item.product.id} className="overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              {/* Imagem do Produto */}
              <div className="relative aspect-square w-full sm:h-32 sm:w-32 flex-shrink-0 bg-muted">
                {item.product.main_image ? (
                  <Image
                    src={item.product.main_image}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="text-3xl text-muted-foreground/50">📱</span>
                  </div>
                )}
              </div>

              {/* Informações do Item */}
              <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                  <Link 
                    href={`/produtos/${item.product.id}`}
                    className="font-semibold hover:text-primary transition-colors"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-primary font-medium mt-1">
                    {formatPrice(item.product.price)}
                  </p>
                </div>

                {/* Controles de Quantidade */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-4">
                    <p className="font-semibold">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(item.product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {/* Link para continuar comprando */}
        <Link href="/produtos" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Continuar comprando
        </Link>
      </div>

      {/* Resumo do Pedido */}
      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>Resumo do Pedido</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Lista resumida */}
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {item.product.name} x{item.quantity}
                </span>
                <span>{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}

            <Separator />

            {/* Total */}
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>

            <Separator />

            {/* Campo Nome do Cliente */}
            <div className="space-y-2">
              <label htmlFor="customerName" className="text-sm font-medium">
                Seu Nome *
              </label>
              <Input
                id="customerName"
                placeholder="Digite seu nome"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            {/* Botão Finalizar no WhatsApp */}
            <Button
              className="w-full gap-2"
              size="lg"
              onClick={handleCheckout}
              disabled={!customerName.trim() || isLoading}
            >
              <MessageCircle className="h-5 w-5" />
              {isLoading ? 'Abrindo WhatsApp...' : 'Finalizar no WhatsApp'}
            </Button>

            {!whatsappNumber && (
              <p className="text-xs text-destructive text-center">
                WhatsApp não configurado. Contate o administrador.
              </p>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
