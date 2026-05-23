/**
 * =============================================================================
 * FOOTER - RODAPÉ DA LOJA
 * =============================================================================
 * 
 * Rodapé minimalista estilo Apple.
 * 
 * O NOME DA LOJA é buscado do banco de dados (Supabase).
 * Para alterar: vá em Admin > Configurações > Nome da Loja
 * =============================================================================
 */

'use client'

import Link from 'next/link'
import { useStoreSettings } from '@/hooks/use-store-settings'
import { storeConfig } from '@/lib/store-config'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const { storeName } = useStoreSettings() // Nome dinâmico do banco de dados

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
          {/* Logo/Nome da Loja - Vem do BANCO DE DADOS */}
          <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            {storeName}
          </Link>

          {/* Links de navegação */}
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Início
            </Link>
            <Link href="/produtos" className="hover:text-foreground transition-colors">
              Produtos
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} {storeName}. {storeConfig.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}
