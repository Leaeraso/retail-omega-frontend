'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, ClipboardPlus, Pencil } from 'lucide-react'

import { ProductProviderModal } from '@/components/product-provider-modal'
import { SetDefaultProviderModal } from '@/components/set-default-provider-modal'
import { ProductState } from '@/components/product-state'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { useProductProviderStore } from '@/stores/product-provider.store'
import { useProductStore } from '@/stores/product.store'
import { ProductProvider } from '@/types/product-provider.types'
import { Product } from '@/types/product.types'
import { getProductById } from '@/services/product.service'
import { setDefaultProductProvider } from '@/services/product-provider.service'

export default function ProductDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = Number(params.id)

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDefaultModalOpen, setIsDefaultModalOpen] = useState(false)
  const [editingProvider, setEditingProvider] = useState<ProductProvider | null>(
    null
  )

  const addProductProvider = useProductProviderStore(
    (state) => state.addProductProvider
  )
  const updateProductStore = useProductStore((state) => state.updateProduct)

  const loadProduct = async () => {
    setLoading(true)
    try {
      const fetchedProduct = await getProductById(id)
      if (fetchedProduct) {
        setProduct(fetchedProduct)
        updateProductStore(id, fetchedProduct) // opcional: actualizar store
      }
    } catch (err) {
      console.error('Error cargando producto:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProduct()
  }, [id])

  const handleCreateProvider = (newProvider: ProductProvider) => {
    if (!product) return
    addProductProvider(newProvider)
    setProduct({
      ...product,
      providers: [...product.providers, newProvider],
    })
  }

  const handleSetDefaultProvider = async (providerId: number) => {
    const updated = await setDefaultProductProvider(providerId)
    if (updated) {
      await loadProduct()
    }
  }

  // Nuevo: abrir modal para editar proveedor
  const handleEdit = (provider: ProductProvider) => {
    setEditingProvider(provider)
    setIsModalOpen(true)
  }

  // Nuevo: actualizar provider en estado local después de editar
  const handleUpdateProvider = (updatedProvider: ProductProvider) => {
    if (!product) return
    const updatedProviders = product.providers.map((p) =>
      p.id === updatedProvider.id ? updatedProvider : p
    )
    setProduct({
      ...product,
      providers: updatedProviders,
    })
  }

  if (loading) return <div className="p-4">Cargando producto...</div>
  if (!product) return <div className="p-4">Producto no encontrado</div>

  const isLoteFijo = product.inventoryPolicy === 'LOTE_FIJO'

  return (
    <div className="w-full h-auto overflow-hidden">
      <div className="flex flex-row items-center">
        <div className="flex flex-row justify-end items-center gap-x-2 mx-2 my-4">
          <Button onClick={() => router.push('/dashboard/products')}>
            <ArrowLeft className="h-4 w-4 text-white" />
          </Button>
        </div>
        <h1 className="text-3xl font-bold w-full flex justify-center items-center mt-7">
          Producto: {product.description}
        </h1>
      </div>

      <ProductProviderModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingProvider(null)
        }}
        onCreate={handleCreateProvider}
        onUpdate={handleUpdateProvider}
        productId={product.id}
        editingProvider={editingProvider}
      />

      <SetDefaultProviderModal
        isOpen={isDefaultModalOpen}
        onClose={() => setIsDefaultModalOpen(false)}
        providers={product.providers}
        currentDefaultId={product.providers.find((p) => p.isDefault)?.id}
        onSelect={handleSetDefaultProvider}
      />

      <div className="grid grid-cols-4 grid-rows-5 gap-4 w-full h-auto p-4">
        <div className="col-span-4 w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Stock Actual</TableHead>
                <TableHead>Demanda anual</TableHead>
                <TableHead>Costo almacenamiento</TableHead>
                <TableHead>Costo total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Pol. Inventario</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.code}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.currentStock}</TableCell>
                <TableCell>{product.annualDemand}</TableCell>
                <TableCell>{product.storageCost}</TableCell>
                <TableCell>{product.totalCost}</TableCell>
                <TableCell>
                  <ProductState state={product.productState} />
                </TableCell>
                <TableCell>{isLoteFijo ? 'Lote fijo' : 'Inventario fijo'}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Política de lote */}
        <div className="col-span-1 row-span-2 row-start-2 border border-gray-500/30 rounded-2xl p-4">
          <h3 className="text-2xl font-bold mb-2">Política de lote</h3>
          <div className="flex justify-between border-b my-2 p-2">
            <p>Tamaño de lote óptimo</p>
            <span>{isLoteFijo ? product.fixedLotPolicy.optimalLotSize : '-'}</span>
          </div>
          <div className="flex justify-between border-b my-2 p-2">
            <p>Punto de reorden</p>
            <span>{isLoteFijo ? product.fixedLotPolicy.reorderPoint : '-'}</span>
          </div>
          <div className="flex justify-between my-2 p-2">
            <p>Stock de seguridad</p>
            <span>
              {isLoteFijo ? product.fixedLotPolicy?.safetyStock ?? '-' : '-'}
            </span>
          </div>
        </div>

        {/* Política de intervalo */}
        <div className="col-span-1 row-span-2 row-start-4 border border-gray-500/30 rounded-2xl p-4">
          <h3 className="text-2xl font-bold mb-2">Política de intervalo</h3>
          <div className="flex justify-between border-b my-2 p-2">
            <p>Stock de seguridad</p>
            <span>
              {!isLoteFijo ? product.fixedIntervalPolicy?.safetyStock ?? '-' : '-'}
            </span>
          </div>
          <div className="flex justify-between border-b my-2 p-2">
            <p>Intervalo de revisión</p>
            <span>
              {!isLoteFijo && product.fixedIntervalPolicy?.reviewIntervalDays
                ? `${product.fixedIntervalPolicy.reviewIntervalDays} días`
                : '-'}
            </span>
          </div>
          <div className="flex justify-between border-b my-2 p-2">
            <p>Nivel máximo de inventario</p>
            <span>
              {!isLoteFijo ? product.fixedIntervalPolicy?.maxInventoryLevel ?? '-' : '-'}
            </span>
          </div>
          <div className="flex justify-between my-2 p-2">
            <p>Última revisión</p>
            <span>
              {!isLoteFijo && product.fixedIntervalPolicy?.lastReviewDate
                ? product.fixedIntervalPolicy.lastReviewDate.replaceAll('-', '/')
                : '-'}
            </span>
          </div>
        </div>

        {/* Proveedores */}
        <div className="col-span-3 row-span-4 col-start-2 row-start-2 border border-gray-500/30 rounded-2xl p-4">
          <h3 className="text-2xl font-bold mb-2">Proveedores</h3>
          {product.productState === 'ALTA' && (
            <div className="w-full flex justify-end gap-x-2 py-2">
              <Button
                onClick={() => {
                  setEditingProvider(null)
                  setIsModalOpen(true)
                }}
              >
                <ClipboardPlus className="h-4 w-4 text-white" />
              </Button>
              <Button onClick={() => setIsDefaultModalOpen(true)}>
                Modificar proveedor predeterminado
              </Button>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[160px]">Proveedor</TableHead>
                <TableHead>Costo unitario</TableHead>
                <TableHead>Tiempo de entrega</TableHead>
                <TableHead>Costo de envío</TableHead>
                <TableHead>Predeterminado</TableHead>
                <TableHead>Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {product.providers.map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell className="min-w-[160px]">{provider.providerName}</TableCell>
                  <TableCell>{provider.unitCost}</TableCell>
                  <TableCell>{provider.leadTime}</TableCell>
                  <TableCell>{provider.shippingCost}</TableCell>
                  <TableCell>{provider.isDefault ? 'Sí' : 'No'}</TableCell>
                  <TableCell>
                    {product.productState === 'ALTA' && (
                      <Button onClick={() => handleEdit(provider)}>
                        <Pencil className="h-3 w-3 text-white" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
