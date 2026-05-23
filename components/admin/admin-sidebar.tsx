/**
 * =============================================================================
 * ADMIN SIDEBAR - MENU LATERAL ADMINISTRATIVO
 * =============================================================================
 * 
 * Menu de navegação lateral do painel administrativo.
 * Mostra os links de navegação e informações do usuário.
 * =============================================================================
 */

'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings, 
  LogOut,
  Store
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

/**
 * Links de navegação do admin.
 * ALTERE AQUI para adicionar ou remover páginas.
 */
const navItems = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/produtos',
    label: 'Produtos',
    icon: Package,
  },
  {
    href: '/admin/administradores',
    label: 'Administradores',
    icon: Users,
  },
  {
    href: '/admin/configuracoes',
    label: 'Configurações',
    icon: Settings,
  },
]

interface AdminSidebarProps {
  userName: string
  userEmail: string
}

export function AdminSidebar({ userName, userEmail }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  /**
   * Faz logout do usuário.
   */
  const handleLogout = async () => {
    const supabase = createClient()
    if (supabase) {
      await supabase.auth.signOut()
    }
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-border/40 bg-card/50 lg:flex">
      {/* Logo/Título */}
      <div className="flex h-16 items-center justify-between border-b border-border/40 px-6">
        <div className="flex items-center gap-2">
          <Store className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">Admin</span>
        </div>
        {/* Botão de Tema Claro/Escuro */}
        <ThemeToggle />
      </div>

      {/* Navegação */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
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
        {/* Informações do Usuário */}
        <div className="mb-4 rounded-lg bg-muted/50 p-3">
          <p className="font-medium truncate">{userName}</p>
          <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
        </div>

        {/* Link para a Loja */}
        <Link href="/" target="_blank">
          <Button variant="outline" className="w-full mb-2 gap-2">
            <Store className="h-4 w-4" />
            Ver Loja
          </Button>
        </Link>

        {/* Botão de Logout */}
        <Button 
          variant="ghost" 
          className="w-full gap-2 text-muted-foreground hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </aside>
  )
}
