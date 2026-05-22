/**
 * =============================================================================
 * HEADER - CABEÇALHO DA LOJA
 * =============================================================================
 * 
 * Componente de navegação principal da loja pública.
 * Exibe o logo, menu de navegação e botão do carrinho.
 * 
 * COMO ALTERAR O LOGO:
 * 1. Substitua o texto "iPhone Premium" pelo nome da sua loja
 * 2. Ou adicione uma imagem/SVG no lugar do texto
 * =============================================================================
 */

'use client'

import Link from 'next/link'
import { ShoppingCart, Menu, Lock } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useCart } from '@/hooks/use-cart'

/**
 * Links de navegação do header.
 * Adicione ou remova itens conforme necessário.
 */
const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/produtos', label: 'Produtos' },
]

export function Header() {
  // Estado para controlar o menu mobile
  const [isOpen, setIsOpen] = useState(false)
  
  // Hook do carrinho para mostrar quantidade de itens
  const { getTotalItems } = useCart()
  const totalItems = getTotalItems()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo - Clique para voltar à home */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">
            {/* ALTERE AQUI: Nome da sua loja */}
            iPhone Premium
          </span>
        </Link>

        {/* Navegação Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Ações do Header */}
        <div className="flex items-center gap-2">
          {/* Botão do Carrinho */}
          <Link href="/carrinho">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {/* Badge com quantidade de itens */}
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
              <span className="sr-only">Carrinho de compras</span>
            </Button>
          </Link>

          {/* Botão Administrador (Desktop) - Visível somente em telas md+ */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/admin/login" className="hidden md:inline-flex">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Lock className="h-4 w-4" />
                    <span className="sr-only">Área do Administrador</span>
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Área do Administrador</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Menu Mobile */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/carrinho"
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium transition-colors hover:text-primary flex items-center gap-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Carrinho {totalItems > 0 && `(${totalItems})`}
                </Link>

                {/* Separador visual */}
                <div className="my-2 border-t border-border" />

                {/* Link Administrador no menu mobile */}
                <Link
                  href="/admin/login"
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground flex items-center gap-2"
                >
                  <Lock className="h-4 w-4" />
                  Área do Administrador
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
