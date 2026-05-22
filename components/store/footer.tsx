/**
 * =============================================================================
 * FOOTER - RODAPÉ DA LOJA
 * =============================================================================
 * 
 * Rodapé simples e elegante com direitos reservados.
 * 
 * COMO ALTERAR:
 * - Modifique o texto de copyright abaixo
 * - Adicione links para redes sociais se desejar
 * =============================================================================
 */

import Link from 'next/link'

export function Footer() {
  // Ano atual para copyright
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/40 bg-card/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
          {/* Logo/Nome da Loja */}
          <Link href="/" className="text-lg font-semibold">
            {/* ALTERE AQUI: Nome da sua loja */}
            iPhone Premium
          </Link>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground text-center">
            {/* ALTERE AQUI: Texto de direitos reservados */}
            &copy; {currentYear} iPhone Premium Store. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
