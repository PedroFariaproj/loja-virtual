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
import { ThemeProvider } from '@/components/theme-provider'
import { storeConfig } from '@/lib/store-config'
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
  // Título que aparece na aba do navegador - usa o nome do store-config.ts
  title: {
    default: `${storeConfig.storeName} | ${storeConfig.tagline}`,
    template: `%s | ${storeConfig.storeName}`,
  },
  // Descrição para mecanismos de busca
  description: storeConfig.description,
  // Palavras-chave para SEO
  keywords: ['iphone', 'smartphone', 'apple', 'celular', 'loja', 'premium', 'garantia'],
  // Autor
  authors: [{ name: storeConfig.storeName }],
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
    siteName: storeConfig.storeName,
    title: `${storeConfig.storeName} | ${storeConfig.tagline}`,
    description: storeConfig.description,
  },
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: storeConfig.storeName,
    description: storeConfig.tagline,
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
    <html lang="pt-BR" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Conteúdo principal das páginas */}
          {children}
        </ThemeProvider>
        
        {/* Analytics do Vercel (apenas em produção) */}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
