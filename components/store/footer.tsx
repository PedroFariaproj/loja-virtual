/**
 * =============================================================================
 * FOOTER - RODAPÉ DA LOJA
 * =============================================================================
 * 
 * Rodapé com nome da loja e copyright.
 * O nome vem do arquivo lib/store-config.ts
 * =============================================================================
 */

import Link from 'next/link'
import { storeConfig } from '@/lib/store-config'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/40 bg-card/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
          {/* Logo/Nome da Loja - vem do store-config.ts */}
          <Link href="/" className="text-lg font-semibold">
            {storeConfig.storeName}
          </Link>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground text-center">
            &copy; {currentYear} {storeConfig.storeName}. {storeConfig.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}
