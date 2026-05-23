/**
 * =============================================================================
 * MIDDLEWARE PRINCIPAL - NEXT.JS (EDGE RUNTIME)
 * =============================================================================
 * 
 * Este arquivo é o ponto de entrada do middleware do Next.js.
 * Ele é executado em TODA requisição antes de chegar às páginas.
 * 
 * IMPORTANTE: Este código roda no Edge Runtime, então não pode usar
 * APIs do Node.js como 'fs', 'path', etc.
 * 
 * RESPONSABILIDADES:
 * - Atualizar sessão do Supabase
 * - Proteger rotas administrativas
 * - Redirecionar usuários não autenticados
 * =============================================================================
 */

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Função principal do middleware.
 * Processa cada requisição antes de chegar à página.
 */
export async function middleware(request: NextRequest) {
  // Verifica se as variáveis de ambiente estão configuradas
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Se as variáveis não estiverem configuradas, apenas continua
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[Middleware] Supabase env vars not configured')
    return NextResponse.next()
  }

  // Cria uma resposta inicial que pode ser modificada
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  try {
    // Cria o client do Supabase com acesso aos cookies
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            // Atualiza os cookies na resposta
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    // Obtém o usuário autenticado (isso também atualiza a sessão se necessário)
    const { data: { user } } = await supabase.auth.getUser()

    // Verifica se a rota é protegida (área administrativa)
    const pathname = request.nextUrl.pathname
    const isAdminRoute = pathname.startsWith('/admin')
    const isLoginRoute = pathname === '/admin/login'
    const isSetupRoute = pathname === '/setup'

    // Se for rota admin (exceto login e setup) e usuário não está logado, redireciona para login
    if (isAdminRoute && !isLoginRoute && !user) {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    // Se usuário está logado e tenta acessar login, redireciona para dashboard
    if (isLoginRoute && user) {
      const dashboardUrl = new URL('/admin', request.url)
      return NextResponse.redirect(dashboardUrl)
    }

    return response
  } catch (error) {
    // Em caso de erro, permite a requisição continuar
    // para não bloquear o acesso ao site
    console.error('[Middleware] Error:', error)
    return NextResponse.next()
  }
}

/**
 * Configuração das rotas onde o middleware será executado.
 * 
 * Exclui:
 * - _next/static (arquivos estáticos do Next.js)
 * - _next/image (otimização de imagens do Next.js)
 * - favicon.ico (ícone do site)
 * - Arquivos de imagem e assets estáticos
 * - Arquivos públicos (robots.txt, sitemap.xml, etc.)
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * - other static files - .css, .js, .json, .xml, .txt, .ico, .woff, .woff2
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|json|xml|txt|ico|woff|woff2)$).*)',
  ],
}
