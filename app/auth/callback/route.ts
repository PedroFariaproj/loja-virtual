/**
 * =============================================================================
 * AUTH CALLBACK ROUTE - TROCA DE CÓDIGO POR SESSÃO
 * =============================================================================
 * 
 * Esta rota é chamada após o usuário confirmar seu email ou fazer login OAuth.
 * Ela troca o código de autenticação por uma sessão válida.
 * 
 * FLUXO:
 * 1. Usuário clica no link de confirmação de email
 * 2. Supabase redireciona para esta rota com ?code=xxx
 * 3. Esta rota troca o código por uma sessão
 * 4. Usuário é redirecionado para a página de destino
 * =============================================================================
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Handler GET para processar o callback de autenticação.
 * 
 * @param request - Requisição com o código de autenticação
 * @returns Redirecionamento para a página de destino ou erro
 */
export async function GET(request: Request) {
  // Extrai parâmetros da URL
  const { searchParams, origin } = new URL(request.url)
  
  // Código de autenticação enviado pelo Supabase
  const code = searchParams.get('code')
  
  // URL de redirecionamento após autenticação (padrão: /admin)
  const next = searchParams.get('next') ?? '/admin'

  // Se temos um código, trocamos por uma sessão
  if (code) {
    const supabase = await createClient()
    
    // Troca o código por uma sessão válida
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Sucesso! Redireciona para a página de destino
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        // Em desenvolvimento, usa o origin normal
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        // Em produção com proxy, usa o host encaminhado
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        // Fallback para o origin
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // Se algo deu errado, redireciona para página de erro
  return NextResponse.redirect(`${origin}/auth/error`)
}
