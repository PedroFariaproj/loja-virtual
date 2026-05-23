/**
 * =============================================================================
 * THEME TOGGLE - BOTÃO DE ALTERNÂNCIA DE TEMA
 * =============================================================================
 * 
 * Botão que alterna entre tema claro e escuro.
 * Exibe um ícone de sol (tema claro) ou lua (tema escuro).
 * =============================================================================
 */

'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

/**
 * ThemeToggle - Botão para alternar entre tema claro e escuro
 * 
 * Características:
 * - Ícone animado (sol/lua)
 * - Tooltip informativo
 * - Suporte a keyboard (Enter/Space)
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Evita hydration mismatch - só renderiza após montar no cliente
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Enquanto não monta, mostra um placeholder para evitar layout shift
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="text-muted-foreground">
        <Sun className="h-4 w-4" />
        <span className="sr-only">Alternar tema</span>
      </Button>
    )
  }

  const isDark = theme === 'dark'

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {/* Ícone de Sol (tema claro) */}
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            {/* Ícone de Lua (tema escuro) */}
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Alternar tema</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
