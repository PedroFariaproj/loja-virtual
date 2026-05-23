/**
 * =============================================================================
 * PRODUCTS LIST - LISTA DE PRODUTOS DO ADMIN
 * =============================================================================
 * 
 * Componente que gerencia a listagem e CRUD de produtos.
 * Inclui modal para criar/editar produtos com upload de imagens.
 * =============================================================================
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Eye, 
  EyeOff,
  Package,
  Loader2,
  Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { formatPrice } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { ProductFormDialog } from './product-form-dialog'
import type { Product } from '@/lib/types'

interface ProductsListProps {
  initialProducts: Product[]
}

export function ProductsList({ initialProducts }: ProductsListProps) {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  // Filtra produtos pela busca
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  /**
   * Alterna o status ativo/inativo do produto.
   */
  const handleToggleActive = async (product: Product) => {
    setIsLoading(product.id)
    const supabase = createClient()

    const { error } = await supabase
      .from('products')
      .update({ active: !product.active })
      .eq('id', product.id)

    if (error) {
      alert('Erro ao atualizar produto.')
      console.error(error)
    } else {
      setProducts(products.map(p => 
        p.id === product.id ? { ...p, active: !p.active } : p
      ))
    }

    setIsLoading(null)
  }

  /**
   * Exclui um produto.
   */
  const handleDelete = async () => {
    if (!deleteProduct) return

    setIsLoading(deleteProduct.id)
    const supabase = createClient()

    // Primeiro exclui as imagens do Storage
    if (deleteProduct.main_image) {
      const imagePath = deleteProduct.main_image.split('/').pop()
      if (imagePath) {
        await supabase.storage.from('products').remove([imagePath])
      }
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', deleteProduct.id)

    if (error) {
      alert('Erro ao excluir produto.')
      console.error(error)
    } else {
      setProducts(products.filter(p => p.id !== deleteProduct.id))
    }

    setDeleteProduct(null)
    setIsLoading(null)
  }

  /**
   * Callback quando um produto é salvo (criado ou editado).
   */
  const handleProductSaved = () => {
    setIsFormOpen(false)
    setEditProduct(null)
    router.refresh()
    // Recarrega os produtos
    const fetchProducts = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) setProducts(data)
    }
    fetchProducts()
  }

  return (
    <div className="space-y-4">
      {/* Barra de ações */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Busca */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar produto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Botão Novo Produto */}
        <Button onClick={() => setIsFormOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      {/* Lista de Produtos */}
      {filteredProducts.length > 0 ? (
        <div className="grid gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  {/* Imagem */}
                  <div className="relative aspect-square h-32 w-full sm:w-32 flex-shrink-0 bg-muted">
                    {product.main_image ? (
                      <Image
                        src={product.main_image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Package className="h-8 w-8 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>

                  {/* Informações */}
                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-primary font-medium">
                          {formatPrice(product.price)}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Estoque: {product.stock} unidades
                        </p>
                      </div>
                      <Badge variant={product.active ? 'default' : 'secondary'}>
                        {product.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>

                    {/* Ações */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => {
                          setEditProduct(product)
                          setIsFormOpen(true)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleToggleActive(product)}
                        disabled={isLoading === product.id}
                      >
                        {isLoading === product.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : product.active ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        {product.active ? 'Desativar' : 'Ativar'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 text-destructive hover:text-destructive"
                        onClick={() => setDeleteProduct(product)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <Package className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">Nenhum produto encontrado</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchQuery 
                ? 'Tente uma busca diferente.' 
                : 'Clique em "Novo Produto" para começar.'
              }
            </p>
          </div>
        </Card>
      )}

      {/* Modal de Formulário */}
      <ProductFormDialog
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open)
          if (!open) setEditProduct(null)
        }}
        product={editProduct}
        onSaved={handleProductSaved}
      />

      {/* Modal de Confirmação de Exclusão */}
      <AlertDialog open={!!deleteProduct} onOpenChange={() => setDeleteProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Produto</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir <strong>{deleteProduct?.name}</strong>?
              Esta ação não pode ser desfeita.
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
