/**
 * =============================================================================
 * MIDDLEWARE PRINCIPAL - NEXT.JS
 * =============================================================================
 * 
 * Este arquivo é o ponto de entrada do middleware do Next.js.
 * Ele é executado em TODA requisição antes de chegar às páginas.
 * 
 * RESPONSABILIDADES:
 * - Atualizar sessão do Supabase
 * - Proteger rotas administrativas
 * - Redirecionar usuários não autenticados
 * =============================================================================
 */

import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

/**
 * Função principal do middleware.
 * Processa cada requisição antes de chegar à página.
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

/**
 * Configuração das rotas onde o middleware será executado.
 * 
 * MATCHER EXPLICADO:
 * - /((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)
 * - Exclui: arquivos estáticos, imagens do Next.js, favicon e imagens
 * - Inclui: todas as outras rotas (páginas, API routes, etc.)
 */
export const config = {
  matcher: [
    /*
     * Executa em todas as rotas exceto:
     * - _next/static (arquivos estáticos)
     * - _next/image (otimização de imagens)
     * - favicon.ico (ícone do site)
     * - Arquivos de imagem (svg, png, jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
