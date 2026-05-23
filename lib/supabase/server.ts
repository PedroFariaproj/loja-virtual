/**
 * =============================================================================
 * SUPABASE CLIENT - LADO DO SERVIDOR (Server Components, API Routes, Actions)
 * =============================================================================
 * 
 * Este arquivo cria o client do Supabase para uso no servidor.
 * Utiliza cookies para gerenciar a sessão do usuário de forma segura.
 * 
 * QUANDO USAR:
 * - Em Server Components (componentes sem "use client")
 * - Em Server Actions (funções com "use server")
 * - Em API Routes (route handlers)
 * 
 * COMO IMPORTAR:
 * import { createClient } from "@/lib/supabase/server"
 * 
 * EXEMPLO DE USO:
 * const supabase = await createClient()
 * const { data } = await supabase.from('products').select('*')
 * =============================================================================
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Cria uma instância do Supabase client para uso no servidor.
 * Esta função é assíncrona pois precisa acessar os cookies.
 * 
 * @returns Promise com a instância do Supabase client configurada
 */
export async function createClient() {
  // Obtém o store de cookies (assíncrono no Next.js 15)
  const cookieStore = await cookies()

  return createServerClient(
    // URL do projeto Supabase
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // Chave anônima do Supabase
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        /**
         * Obtém todos os cookies da requisição
         */
        getAll() {
          return cookieStore.getAll()
        },
        /**
         * Define cookies na resposta
         * Usado para atualizar tokens de sessão
         */
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // O método `setAll` foi chamado de um Server Component.
            // Isso pode ser ignorado se você tiver middleware que atualiza
            // as sessões do usuário.
          }
        },
      },
    }
  )
}
