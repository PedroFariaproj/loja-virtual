/**
 * =============================================================================
 * ADMIN HEADER - CABEÇALHO MOBILE DO ADMIN
 * =============================================================================
 * 
 * Header responsivo para dispositivos móveis.
 * Inclui menu hamburguer com navegação.
 * =============================================================================
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  Menu, 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings, 
  LogOut,
  Store,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/produtos', label: 'Produtos', icon: Package },
  { href: '/admin/administradores', label: 'Administradores', icon: Users },
  { href: '/admin/configuracoes', label: 'Configurações', icon: Settings },
]

interface AdminHeaderProps {
  userName: string
}

export function AdminHeader({ userName }: AdminHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border/40 bg-background/95 px-4 backdrop-blur lg:hidden">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Store className="h-6 w-6 text-primary" />
        <span className="font-bold">Admin</span>
      </div>

      {/* Ações */}
      <div className="flex items-center gap-2">
        {/* Botão de Tema Claro/Escuro */}
        <ThemeToggle />

        {/* Menu Mobile */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>

        <SheetContent side="right" className="w-[280px] p-0">
          <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
          
          {/* Header do Sheet */}
          <div className="flex h-16 items-center justify-between border-b border-border/40 px-4">
            <span className="font-bold">Menu</span>
          </div>

          {/* Navegação */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <Separator />

          {/* Área do Usuário */}
          <div className="p-4">
            <div className="mb-4 rounded-lg bg-muted/50 p-3">
              <p className="font-medium">{userName}</p>
            </div>

            <Link href="/" target="_blank" onClick={() => setIsOpen(false)}>
              <Button variant="outline" className="w-full mb-2 gap-2">
                <Store className="h-4 w-4" />
                Ver Loja
              </Button>
            </Link>

            <Button 
              variant="ghost" 
              className="w-full gap-2 text-muted-foreground hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      </div>
    </header>
  )
}
