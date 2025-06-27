'use client'

import { Button } from './ui/button'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from './ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ProductState } from './product-state'
import { useRouter } from 'next/navigation'
import { ClipboardPlus, Eye, Trash, Pencil } from 'lucide-react'
import { useEffect, useState } from 'react'
import AddProductModal from './add-product-modal'
import { useProducts } from '@/hooks/use-product'
import { useProviders } from '@/hooks/use-providers'
import toast from 'react-hot-toast'
import { Product } from '@/types/product.types'

export function ProductTable() {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL')
  const [filterApplied, setFilterApplied] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const {
    products,
    filteredProducts,
    fetchProducts,
    addProduct,
    deleteProductById,
    fetchProductsByProvider,
    fetchProductsBelowReorderPoint,
    fetchProductsBelowSecurityStock,
    updateProduct,
  } = useProducts()

  const { activeProviders, fetchActiveProviders } = useProviders()

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  useEffect(() => {
    fetchProducts()
    fetchActiveProviders()
  }, [fetchProducts, fetchActiveProviders])

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de dar de baja este producto?')) return
    try {
      const res = await deleteProductById(id)
      if (res.success) {
        toast.success('Producto dado de baja correctamente')
      } else {
        toast.error(res.error || 'No se pudo dar de baja el producto')
      }
    } catch (error) {
      console.error(error)
      toast.error('Error al procesar la solicitud')
    }
  }

  const handleFilterChange = async (value: string) => {
    setSelectedFilter(value)

    if (value === 'ALL') {
      setFilterApplied(false)
      await fetchProducts()
    } else {
      setFilterApplied(true)
      if (value === 'BELOW_STOCK') {
        await fetchProductsBelowSecurityStock()
      } else if (value === 'BELOW_REORDER') {
        await fetchProductsBelowReorderPoint()
      } else if (value.startsWith('PROVIDER_')) {
        const id = parseInt(value.replace('PROVIDER_', ''))
        await fetchProductsByProvider(id)
      }
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    openModal()
  }

  const productsToRender = Array.isArray(
    filterApplied ? filteredProducts : products
  )
    ? filterApplied
      ? filteredProducts
      : products
    : []

  return (
    <main>
      <div className="flex flex-col sm:flex-row justify-between items-center mx-4 my-4 gap-4">
        <div className="flex flex-row gap-2 items-center">
          <Select value={selectedFilter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Filtrar productos..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              <SelectItem value="BELOW_STOCK">Productos faltantes</SelectItem>
              <SelectItem value="BELOW_REORDER">Productos a reponer</SelectItem>
              {activeProviders.map((provider) => (
                <SelectItem key={provider.id} value={`PROVIDER_${provider.id}`}>
                  Proveedor {provider.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={openModal}>
          <ClipboardPlus className="h-4 w-4 text-white" />
        </Button>
      </div>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onCreate={(product) => {
          addProduct(product)
          fetchProducts()
        }}
        onUpdate={(id, product) => {
          updateProduct(id, product)
          fetchProducts()
        }}
        product={editingProduct}
      />

      <div className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Codigo</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Demanda anual</TableHead>
              <TableHead>Costo almacenamiento</TableHead>
              <TableHead>Costo total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Pol. de inventario</TableHead>
              <TableHead>Punto de reorden</TableHead>
              <TableHead>Stock de seguridad</TableHead>
              <TableHead>Proveedores</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productsToRender.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.code}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.currentStock}</TableCell>
                <TableCell>{product.annualDemand}</TableCell>
                <TableCell>$ {product.storageCost}</TableCell>
                <TableCell>
                  ${' '}
                  {typeof product.totalCost === 'number'
                    ? product.totalCost.toFixed(2)
                    : '0.00'}
                </TableCell>
                <TableCell>
                  <ProductState state={product.productState} />
                </TableCell>
                <TableCell>
                  {product.inventoryPolicy === 'LOTE_FIJO'
                    ? 'Lote Fijo'
                    : 'Inventario Fijo'}
                </TableCell>
                <TableCell>
                  {product.fixedLotPolicy?.reorderPoint ?? '-'}
                </TableCell>
                <TableCell>
                  {product.inventoryPolicy === 'LOTE_FIJO'
                    ? product.fixedLotPolicy?.safetyStock ?? '-'
                    : product.fixedIntervalPolicy?.safetyStock ?? '-'}
                </TableCell>
                <TableCell>
                  {product.providers[0]?.providerName ?? '-'}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 justify-end">
                    <Button onClick={() => handleDelete(product.id)}>
                      <Trash className="h-3 w-3 text-white" />
                    </Button>
                    <Button
                      onClick={() =>
                        router.push(`/dashboard/products/${product.id}`)
                      }
                    >
                      <Eye className="h-3 w-3 text-white" />
                    </Button>
                    <Button onClick={() => handleEdit(product)}>
                      <Pencil className="h-3 w-3 text-white" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  )
}
