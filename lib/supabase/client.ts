/**
 * =============================================================================
 * SUPABASE CLIENT - LADO DO CLIENTE (Browser)
 * =============================================================================
 * 
 * Este arquivo cria o client do Supabase para uso no navegador (client-side).
 * Utiliza o padrão singleton para evitar múltiplas instâncias.
 * 
 * QUANDO USAR:
 * - Em componentes com "use client"
 * - Para operações que precisam de interatividade do usuário
 * - Para autenticação (login, logout, signup)
 * 
 * COMO IMPORTAR:
 * import { createClient } from "@/lib/supabase/client"
 * 
 * EXEMPLO DE USO:
 * const supabase = createClient()
 * if (supabase) {
 *   const { data } = await supabase.from('products').select('*')
 * }
 * =============================================================================
 */

import { createBrowserClient } from '@supabase/ssr'

/**
 * Verifica se as variáveis de ambiente do Supabase estão configuradas
 */
export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

/**
 * Cria uma instância do Supabase client para uso no browser.
 * Esta função é usada em componentes client-side ("use client").
 * 
 * @returns Instância do Supabase client configurada ou null se não configurado
 */
export function createClient() {
  // Verifica se as variáveis de ambiente estão configuradas
  if (!isSupabaseConfigured()) {
    console.warn('[Supabase] Variáveis de ambiente não configuradas. Algumas funcionalidades podem não funcionar.')
    return null
  }

  return createBrowserClient(
    // URL do projeto Supabase (variável de ambiente pública)
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // Chave anônima do Supabase (variável de ambiente pública)
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
