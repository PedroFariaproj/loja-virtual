/**
 * =============================================================================
 * FOOTER - RODAPÉ DA LOJA
 * =============================================================================
 * 
 * Rodapé minimalista estilo Apple.
 * O nome vem do arquivo lib/store-config.ts
 * =============================================================================
 */

import Link from 'next/link'
import { storeConfig } from '@/lib/store-config'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
          {/* Logo/Nome da Loja */}
          <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            {storeConfig.storeName}
          </Link>

          {/* Links de navegação */}
          <nav className="flex items-center gap-6 text-sm text-foreground/60">
            <Link href="/" className="hover:text-foreground transition-colors">
              Início
            </Link>
            <Link href="/produtos" className="hover:text-foreground transition-colors">
              Produtos
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-foreground/40">
            &copy; {currentYear} {storeConfig.storeName}. {storeConfig.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}
