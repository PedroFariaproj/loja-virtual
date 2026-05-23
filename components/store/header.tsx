/**
 * =============================================================================
 * HEADER - CABEÇALHO DA LOJA
 * =============================================================================
 * 
 * Componente de navegação principal da loja pública.
 * O nome da loja vem do arquivo lib/store-config.ts
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
import { storeConfig } from '@/lib/store-config'

/**
 * Links de navegação do header.
 */
const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/produtos', label: 'Produtos' },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { getTotalItems } = useCart()
  const totalItems = getTotalItems()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 lg:px-8">
        {/* Logo - Nome vem do store-config.ts */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-lg font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
            {storeConfig.storeName}
          </span>
        </Link>

        {/* Navegação Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Ações do Header */}
        <div className="flex items-center gap-2">
          {/* Botão Ver Produtos - Destaque */}
          <Link href="/produtos" className="hidden sm:inline-flex">
            <Button size="sm" className="gap-2">
              Ver Produtos
            </Button>
          </Link>

          {/* Botão do Carrinho */}
          <Link href="/carrinho">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
              <span className="sr-only">Carrinho de compras</span>
            </Button>
          </Link>

          {/* Botão Administrador (Desktop) */}
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

                <div className="my-2 border-t border-border" />

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
