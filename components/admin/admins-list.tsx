/**
 * =============================================================================
 * ADMINS LIST - LISTA DE ADMINISTRADORES
 * =============================================================================
 * 
 * Componente para listar e gerenciar administradores.
 * =============================================================================
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  Trash2, 
  UserCheck, 
  UserX,
  Users,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { createClient } from '@/lib/supabase/client'
import { AdminFormDialog } from './admin-form-dialog'
import type { Profile } from '@/lib/types'

interface AdminsListProps {
  initialAdmins: Profile[]
  currentUserId: string
}

export function AdminsList({ initialAdmins, currentUserId }: AdminsListProps) {
  const router = useRouter()
  const [admins, setAdmins] = useState<Profile[]>(initialAdmins)
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [deleteAdmin, setDeleteAdmin] = useState<Profile | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  /**
   * Alterna o status ativo/inativo do administrador.
   */
  const handleToggleActive = async (admin: Profile) => {
    if (admin.id === currentUserId) {
      alert('Você não pode desativar sua própria conta.')
      return
    }

    setIsLoading(admin.id)
    const supabase = createClient()

    if (!supabase) {
      alert('Sistema não configurado.')
      setIsLoading(null)
      return
    }

    const { error } = await supabase
      .from('profiles')
      .update({ active: !admin.active })
      .eq('id', admin.id)

    if (error) {
      alert('Erro ao atualizar administrador.')
      console.error(error)
    } else {
      setAdmins(admins.map(a => 
        a.id === admin.id ? { ...a, active: !a.active } : a
      ))
    }

    setIsLoading(null)
  }

  /**
   * Exclui um administrador.
   */
  const handleDelete = async () => {
    if (!deleteAdmin) return

    if (deleteAdmin.id === currentUserId) {
      alert('Você não pode excluir sua própria conta.')
      setDeleteAdmin(null)
      return
    }

    setIsLoading(deleteAdmin.id)
    const supabase = createClient()

    if (!supabase) {
      alert('Sistema não configurado.')
      setIsLoading(null)
      setDeleteAdmin(null)
      return
    }

    // Remove o perfil (o usuário auth será mantido mas sem acesso)
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', deleteAdmin.id)

    if (error) {
      alert('Erro ao excluir administrador.')
      console.error(error)
    } else {
      setAdmins(admins.filter(a => a.id !== deleteAdmin.id))
    }

    setDeleteAdmin(null)
    setIsLoading(null)
  }

  /**
   * Callback quando um admin é salvo.
   */
  const handleAdminSaved = () => {
    setIsFormOpen(false)
    router.refresh()
    // Recarrega os admins
    const fetchAdmins = async () => {
      const supabase = createClient()
      if (!supabase) return
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) setAdmins(data)
    }
    fetchAdmins()
  }

  // Formata a data
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR')
  }

  return (
    <div className="space-y-4">
      {/* Botão Novo Admin */}
      <div className="flex justify-end">
        <Button onClick={() => setIsFormOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Administrador
        </Button>
      </div>

      {/* Lista de Admins */}
      {admins.length > 0 ? (
        <div className="grid gap-4">
          {admins.map((admin) => (
            <Card key={admin.id}>
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{admin.name}</h3>
                    {admin.id === currentUserId && (
                      <Badge variant="outline" className="text-xs">Você</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{admin.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Criado em {formatDate(admin.created_at)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={admin.active ? 'default' : 'secondary'}>
                    {admin.active ? 'Ativo' : 'Inativo'}
                  </Badge>

                  {admin.id !== currentUserId && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(admin)}
                        disabled={isLoading === admin.id}
                      >
                        {isLoading === admin.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : admin.active ? (
                          <UserX className="h-4 w-4" />
                        ) : (
                          <UserCheck className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteAdmin(admin)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <Users className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">Nenhum administrador</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Clique em "Novo Administrador" para adicionar.
            </p>
          </div>
        </Card>
      )}

      {/* Modal de Formulário */}
      <AdminFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSaved={handleAdminSaved}
      />

      {/* Modal de Confirmação de Exclusão */}
      <AlertDialog open={!!deleteAdmin} onOpenChange={() => setDeleteAdmin(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Administrador</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir <strong>{deleteAdmin?.name}</strong>?
              Esta pessoa perderá o acesso ao painel administrativo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
