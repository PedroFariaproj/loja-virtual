/**
 * =============================================================================
 * PRODUCTS GRID - GRID DE PRODUTOS COM BUSCA E FILTROS
 * =============================================================================
 * 
 * Componente que exibe os produtos com:
 * - Barra de busca por nome (busca em tempo real)
 * - Filtro por faixa de preço
 * - Ordenação (mais recentes, menor preço, maior preço)
 * - Estado vazio quando não há resultados
 * =============================================================================
 */

'use client'

import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, Package, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ProductCard } from './product-card'
import { storeConfig } from '@/lib/store-config'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/lib/types'

interface ProductsGridProps {
  products: Product[]
}

// Opções de ordenação
const sortOptions = [
  { value: 'recent', label: 'Mais Recentes' },
  { value: 'price-asc', label: 'Menor Preço' },
  { value: 'price-desc', label: 'Maior Preço' },
  { value: 'name', label: 'Nome A-Z' },
]

// Faixas de preço predefinidas (em centavos)
const priceRanges = [
  { value: 'all', label: 'Todos os preços' },
  { value: '0-100000', label: 'Até R$ 1.000' },
  { value: '100000-200000', label: 'R$ 1.000 - R$ 2.000' },
  { value: '200000-300000', label: 'R$ 2.000 - R$ 3.000' },
  { value: '300000-500000', label: 'R$ 3.000 - R$ 5.000' },
  { value: '500000-999999999', label: 'Acima de R$ 5.000' },
]

export function ProductsGrid({ products }: ProductsGridProps) {
  // Estados dos filtros
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('recent')
  const [priceRange, setPriceRange] = useState('all')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Filtra e ordena os produtos
  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Filtro por busca (nome ou descrição)
    if (search.trim()) {
      const searchLower = search.toLowerCase().trim()
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          (product.description?.toLowerCase().includes(searchLower) ?? false)
      )
    }

    // Filtro por faixa de preço
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number)
      result = result.filter(
        (product) => product.price >= min && product.price <= max
      )
    }

    // Ordenação
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'recent':
      default:
        // Já está ordenado por data de criação
        break
    }

    return result
  }, [products, search, sortBy, priceRange])

  // Verifica se há filtros ativos
  const hasActiveFilters = search.trim() || priceRange !== 'all'

  // Limpa todos os filtros
  const clearFilters = () => {
    setSearch('')
    setPriceRange('all')
    setSortBy('recent')
  }

  return (
    <div className="space-y-6">
      {/* Barra de Busca e Filtros */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Barra de Busca */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
          <Input
            type="text"
            placeholder={storeConfig.products.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 pr-10 h-11 rounded-full border-foreground/10 bg-secondary/50 placeholder:text-foreground/40 focus-visible:ring-primary"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Ordenação e Filtros */}
        <div className="flex items-center gap-2">
          {/* Select de Ordenação (Desktop) */}
          <div className="hidden sm:flex items-center gap-2">
            <Label htmlFor="sort" className="text-sm text-muted-foreground whitespace-nowrap">
              Ordenar:
            </Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger id="sort" className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Select de Preço (Desktop) */}
          <div className="hidden md:flex items-center gap-2">
            <Label htmlFor="price" className="text-sm text-muted-foreground whitespace-nowrap">
              Preço:
            </Label>
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger id="price" className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Botão de Filtros (Mobile) */}
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="sr-only">Filtros</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto">
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
              </SheetHeader>
              <div className="space-y-6 py-4">
                {/* Ordenação */}
                <div className="space-y-2">
                  <Label>Ordenar por</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Faixa de Preço */}
                <div className="space-y-2">
                  <Label>Faixa de Preço</Label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priceRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Botão Aplicar */}
                <Button 
                  className="w-full" 
                  onClick={() => setIsFilterOpen(false)}
                >
                  Aplicar Filtros
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Botão Limpar Filtros */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Limpar
            </Button>
          )}
        </div>
      </div>

      {/* Contador de Resultados */}
      <div className="text-sm text-foreground/50">
        {filteredProducts.length === 0 ? (
          'Nenhum produto encontrado'
        ) : filteredProducts.length === 1 ? (
          '1 produto encontrado'
        ) : (
          `${filteredProducts.length} produtos encontrados`
        )}
        {hasActiveFilters && ` (de ${products.length} total)`}
      </div>

      {/* Grid de Produtos ou Estado Vazio */}
      {filteredProducts.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-secondary/30 py-24">
          <Package className="h-12 w-12 text-foreground/20" strokeWidth={1.5} />
          <h2 className="mt-6 text-lg font-medium text-foreground">
            {storeConfig.products.noResultsText}
          </h2>
          <p className="mt-2 text-center text-foreground/50">
            {hasActiveFilters ? (
              <>
                Tente ajustar os filtros ou{' '}
                <button
                  onClick={clearFilters}
                  className="text-primary hover:underline"
                >
                  limpar busca
                </button>
              </>
            ) : (
              storeConfig.products.emptyText
            )}
          </p>
        </div>
      )}
    </div>
  )
}
