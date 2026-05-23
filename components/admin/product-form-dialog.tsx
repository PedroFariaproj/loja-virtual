/**
 * =============================================================================
 * PRODUCT FORM DIALOG - MODAL DE PRODUTO
 * =============================================================================
 * 
 * Modal para criar ou editar produtos.
 * Inclui upload de imagem e validação de campos.
 * =============================================================================
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase/client'
import { optimizeImage } from '@/lib/image-utils'
import type { Product } from '@/lib/types'

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
  onSaved: () => void
}

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  onSaved,
}: ProductFormDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  
  // Estados do formulário
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [active, setActive] = useState(true)

  // Preenche o formulário quando editando
  useEffect(() => {
    if (product) {
      setName(product.name)
      setDescription(product.description || '')
      setPrice((product.price / 100).toFixed(2).replace('.', ','))
      setStock(product.stock.toString())
      setActive(product.active)
      setImagePreview(product.main_image)
    } else {
      resetForm()
    }
  }, [product, open])

  const resetForm = () => {
    setName('')
    setDescription('')
    setPrice('')
    setStock('')
    setActive(true)
    setImagePreview(null)
    setImageFile(null)
  }

  /**
   * Processa a seleção de imagem com otimização automática.
   * Comprime e redimensiona a imagem para um tamanho adequado.
   */
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        // Otimiza a imagem (comprime e redimensiona)
        const optimizedFile = await optimizeImage(file)
        setImageFile(optimizedFile)
        
        // Gera preview
        const reader = new FileReader()
        reader.onload = () => {
          setImagePreview(reader.result as string)
        }
        reader.readAsDataURL(optimizedFile)
      } catch (error) {
        console.error('Erro ao otimizar imagem:', error)
        // Se falhar a otimização, usa a imagem original
        setImageFile(file)
        const reader = new FileReader()
        reader.onload = () => {
          setImagePreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    }
  }

  /**
   * Remove a imagem selecionada.
   */
  const handleRemoveImage = () => {
    setImagePreview(null)
    setImageFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  /**
   * Converte o preço de string (ex: "5.999,00") para centavos (ex: 599900).
   */
  const parsePriceToCents = (priceStr: string): number => {
    // Remove pontos de milhar e substitui vírgula por ponto
    const cleaned = priceStr.replace(/\./g, '').replace(',', '.')
    const value = parseFloat(cleaned)
    return Math.round(value * 100)
  }

  /**
   * Salva o produto (cria ou atualiza).
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      alert('Por favor, informe o nome do produto.')
      return
    }

    setIsLoading(true)
    const supabase = createClient()
    
    // Verifica se o Supabase está configurado
    if (!supabase) {
      alert('Sistema não configurado. Entre em contato com o administrador.')
      setIsLoading(false)
      return
    }
    
    try {
      let imageUrl = product?.main_image || null

      // Upload da imagem se houver uma nova
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

        const { error: uploadError, data } = await supabase.storage
          .from('products')
          .upload(fileName, imageFile)

        if (uploadError) {
          throw new Error('Erro ao fazer upload da imagem.')
        }

        // Obtém a URL pública
        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(fileName)

        imageUrl = publicUrl

        // Remove a imagem antiga se estiver editando
        if (product?.main_image) {
          const oldImagePath = product.main_image.split('/').pop()
          if (oldImagePath) {
            await supabase.storage.from('products').remove([oldImagePath])
          }
        }
      }

      const productData = {
        name: name.trim(),
        description: description.trim() || null,
        price: parsePriceToCents(price),
        stock: parseInt(stock) || 0,
        active,
        main_image: imageUrl,
        updated_at: new Date().toISOString(),
      }

      if (product) {
        // Atualiza produto existente
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id)

        if (error) throw error
      } else {
        // Cria novo produto
        const { error } = await supabase
          .from('products')
          .insert(productData)

        if (error) throw error
      }

      onSaved()
    } catch (error) {
      console.error('Erro ao salvar produto:', error)
      alert('Erro ao salvar produto. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Editar Produto' : 'Novo Produto'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Upload de Imagem */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Imagem Principal</label>
            <div className="relative">
              {imagePreview ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute right-2 top-2 rounded-full bg-background/80 p-1 hover:bg-background"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 hover:bg-muted transition-colors"
                >
                  <ImageIcon className="h-10 w-10 text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Clique ou arraste uma imagem
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Nome */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nome do Produto *
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: iPhone 15 Pro Max 256GB"
              required
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Descrição
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o produto..."
              rows={3}
            />
          </div>

          {/* Preço e Estoque */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium">
                Preço (R$) *
              </label>
              <Input
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="5.999,00"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="stock" className="text-sm font-medium">
                Estoque
              </label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="10"
              />
            </div>
          </div>

          {/* Status Ativo */}
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="font-medium">Produto Ativo</p>
              <p className="text-sm text-muted-foreground">
                Produtos ativos aparecem na loja
              </p>
            </div>
            <Switch
              checked={active}
              onCheckedChange={setActive}
            />
          </div>

          {/* Botões */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
