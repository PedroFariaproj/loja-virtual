/**
 * =============================================================================
 * SUPABASE MIDDLEWARE - GERENCIAMENTO DE SESSÃO
 * =============================================================================
 * 
 * Este arquivo contém a lógica para atualizar a sessão do usuário
 * em cada requisição. É essencial para manter o usuário logado.
 * 
 * IMPORTANTE:
 * - O middleware roda em TODA requisição
 * - Atualiza automaticamente os tokens expirados
 * - Protege rotas que requerem autenticação
 * =============================================================================
 */

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Atualiza a sessão do usuário e protege rotas administrativas.
 * 
 * @param request - Requisição do Next.js
 * @returns Resposta com cookies atualizados ou redirecionamento
 */
export async function updateSession(request: NextRequest) {
  // Cria uma resposta inicial que pode ser modificada
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Cria o client do Supabase com acesso aos cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Atualiza os cookies na requisição
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          // Cria nova resposta com os cookies atualizados
          supabaseResponse = NextResponse.next({
            request,
          })
          // Define os cookies na resposta
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANTE: Não executar código entre createServerClient e supabase.auth.getUser()
  // Um simples erro pode fazer com que o usuário seja deslogado aleatoriamente.

  // Obtém o usuário autenticado (isso também atualiza a sessão se necessário)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Verifica se a rota é protegida (área administrativa)
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginRoute = request.nextUrl.pathname === '/admin/login'

  // Se for rota admin e usuário não está logado, redireciona para login
  if (isAdminRoute && !isLoginRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  // Se usuário está logado e tenta acessar login, redireciona para dashboard
  if (isLoginRoute && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
