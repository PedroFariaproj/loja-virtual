/**
 * =============================================================================
 * DASHBOARD - PÁGINA INICIAL DO ADMIN
 * =============================================================================
 * 
 * Exibe estatísticas gerais da loja:
 * - Total de produtos
 * - Produtos ativos/inativos
 * - Quantidade de administradores
 * =============================================================================
 */

import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, PackageCheck, PackageX, Users } from 'lucide-react'

/**
 * Busca estatísticas para o dashboard.
 */
async function getStats() {
  const supabase = await createClient()

  // Se o Supabase não está configurado, retorna valores padrão
  if (!supabase) {
    return {
      totalProducts: 0,
      activeProducts: 0,
      inactiveProducts: 0,
      totalAdmins: 0,
    }
  }

  // Busca contagem de produtos
  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })

  const { count: activeProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('active', true)

  const { count: inactiveProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('active', false)

  // Busca contagem de administradores
  const { count: totalAdmins } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('active', true)

  return {
    totalProducts: totalProducts || 0,
    activeProducts: activeProducts || 0,
    inactiveProducts: inactiveProducts || 0,
    totalAdmins: totalAdmins || 0,
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats()

  const cards = [
    {
      title: 'Total de Produtos',
      value: stats.totalProducts,
      icon: Package,
      description: 'Produtos cadastrados',
    },
    {
      title: 'Produtos Ativos',
      value: stats.activeProducts,
      icon: PackageCheck,
      description: 'Visíveis na loja',
      className: 'text-green-500',
    },
    {
      title: 'Produtos Inativos',
      value: stats.inactiveProducts,
      icon: PackageX,
      description: 'Ocultos da loja',
      className: 'text-yellow-500',
    },
    {
      title: 'Administradores',
      value: stats.totalAdmins,
      icon: Users,
      description: 'Usuários com acesso',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Visão geral da sua loja
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon className={`h-5 w-5 ${card.className || 'text-muted-foreground'}`} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{card.value}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mensagem de boas-vindas */}
      <Card>
        <CardHeader>
          <CardTitle>Bem-vindo ao Painel Administrativo</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>
            Use o menu lateral para navegar entre as seções:
          </p>
          <ul className="mt-4 space-y-2 list-disc list-inside">
            <li><strong>Produtos:</strong> Adicione, edite ou remova produtos da loja</li>
            <li><strong>Administradores:</strong> Gerencie os usuários com acesso ao painel</li>
            <li><strong>Configurações:</strong> Altere o nome da loja e número do WhatsApp</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
