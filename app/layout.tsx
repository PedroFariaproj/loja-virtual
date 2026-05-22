/**
 * =============================================================================
 * LAYOUT PRINCIPAL - ROOT LAYOUT
 * =============================================================================
 * 
 * Este é o layout raiz da aplicação. Todas as páginas herdam deste layout.
 * Configura fontes, metadados SEO e estrutura básica do HTML.
 * 
 * COMO ALTERAR:
 * - Título/Descrição: Edite o objeto 'metadata'
 * - Fontes: Altere as importações de 'next/font/google'
 * - Analytics: O Vercel Analytics está habilitado em produção
 * =============================================================================
 */

import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

// Configuração da fonte principal (Geist - moderna e limpa)
const geist = Geist({ 
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

// Configuração da fonte mono (para código)
const geistMono = Geist_Mono({ 
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

/**
 * METADADOS SEO
 * 
 * Estes metadados são importantes para SEO e compartilhamento em redes sociais.
 * Altere conforme necessário para sua loja.
 */
export const metadata: Metadata = {
  // Título que aparece na aba do navegador
  title: {
    default: 'iPhone Premium Store | Os Melhores iPhones com Garantia',
    template: '%s | iPhone Premium Store',
  },
  // Descrição para mecanismos de busca
  description: 'Loja especializada em iPhones e smartphones premium. Aparelhos revisados com garantia, entrega rápida e atendimento personalizado.',
  // Palavras-chave para SEO
  keywords: ['iphone', 'smartphone', 'apple', 'celular', 'loja', 'premium', 'garantia'],
  // Autor
  authors: [{ name: 'iPhone Premium Store' }],
  // Gerador
  generator: 'Next.js',
  // Ícones
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
  // Open Graph para compartilhamento
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'iPhone Premium Store',
    title: 'iPhone Premium Store | Os Melhores iPhones com Garantia',
    description: 'Loja especializada em iPhones e smartphones premium.',
  },
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'iPhone Premium Store',
    description: 'Os melhores iPhones com garantia e qualidade.',
  },
}

/**
 * CONFIGURAÇÃO DE VIEWPORT
 * 
 * Importante para responsividade e experiência mobile.
 * maximumScale: 1 previne zoom automático em inputs no iOS.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
}

/**
 * Componente de Layout Raiz
 * 
 * @param children - Conteúdo das páginas filhas
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${geist.variable} ${geistMono.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen">
        {/* Conteúdo principal das páginas */}
        {children}
        
        {/* Analytics do Vercel (apenas em produção) */}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
