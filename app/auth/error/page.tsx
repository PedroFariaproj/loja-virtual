/**
 * =============================================================================
 * PÁGINA DE ERRO DE AUTENTICAÇÃO
 * =============================================================================
 * 
 * Exibida quando há erro no fluxo de autenticação.
 * =============================================================================
 */

import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle>Erro de Autenticação</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Ocorreu um erro durante o processo de autenticação.
            Por favor, tente novamente.
          </p>
        </CardContent>
        <CardFooter className="justify-center">
          <Link href="/admin/login">
            <Button>Voltar para o Login</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
