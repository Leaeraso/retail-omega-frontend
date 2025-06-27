'use client'

import { ProductProviderModal } from '@/components/product-provider-modal'
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
import { ArrowLeft, ClipboardPlus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ProductDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = Number(params.id)
  const product = useProductStore((state) =>
    state.products.find((p) => p.id === id)
  )

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const addProductProvider = useProductProviderStore(
    (state) => state.addProductProvider
  )

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const updateProduct = useProductStore((state) => state.updateProduct)

  const handleCreateProvider = (newProvider: ProductProvider) => {
    addProductProvider(newProvider)

    updateProduct(product!.id, {
      ...product,
      providers: [...product!.providers, newProvider], // Actualizamos la tabla
    })
  }

  if (!product) {
    return <div>Producto no encontrado</div>
  }

  const isLoteFijo = product.inventoryPolicy === 'LOTE_FIJO'

  return (
    <div className="w-full h-auto overflow-hidden">
      <div className="flex flex-row items-center">
        <div className="flex flex-row justify-end items-center gap-x-2 mx-2 my-4">
          <Button
            className="hover:cursor-pointer"
            onClick={() => router.push('/dashboard/products')}
          >
            <ArrowLeft className="h-4 w-4 text-white" />
          </Button>
        </div>
        <h1 className="text-3xl font-bold w-full flex justify-center items-center mt-7">
          Producto: {product.description}
        </h1>
      </div>

      <ProductProviderModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onCreate={handleCreateProvider}
        productId={product.id}
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
                <TableCell>
                  {isLoteFijo ? 'Lote fijo' : 'Inventario fijo'}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        {/* Política de lote */}
        <div className="col-span-2 row-span-2 row-start-2  border border-gray-500/30 rounded-2xl p-4">
          <h3 className="text-2xl font-bold w-full my-2">Política de lote</h3>
          <div className="w-full flex flex-row justify-between border-b-1 border-gray-500/30 my-2 p-2">
            <p>Tamaño de lote óptimo</p>
            <span>
              {isLoteFijo ? product.fixedLotPolicy.optimalLotSize : '-'}{' '}
              {/* <-- */}
            </span>
          </div>
          <div className="w-full flex flex-row justify-between border-b-1 border-gray-500/30 my-2 p-2">
            <p>Punto de reorden</p>
            <span>
              {isLoteFijo ? product.fixedLotPolicy.reorderPoint : '-'}{' '}
              {/* <-- */}
            </span>
          </div>
          <div className="w-full flex flex-row justify-between my-2 p-2">
            <p>Stock de seguridad</p>
            <span>
              {isLoteFijo ? product.fixedLotPolicy?.safetyStock ?? '-' : '-'}{' '}
              {/* <-- */}
            </span>
          </div>
        </div>
        {/* Política de intervalo */}
        <div className="col-span-2 row-span-2 row-start-4  border border-gray-500/30 rounded-2xl p-4">
          <h3 className="text-2xl font-bold w-full my-2">
            Política de intervalo
          </h3>
          <div className="w-full flex flex-row justify-between border-b-1 border-gray-500/30 my-2 p-2">
            <p>Stock de seguridad</p>
            <span>
              {!isLoteFijo
                ? product.fixedIntervalPolicy?.safetyStock ?? '-'
                : '-'}{' '}
              {/* <-- */}
            </span>
          </div>
          <div className="w-full flex flex-row justify-between border-b-1 border-gray-500/30 my-2 p-2">
            <p>Intervalo de revisión</p>
            <span>
              {!isLoteFijo && product.fixedIntervalPolicy?.reviewIntervalDays
                ? `${product.fixedIntervalPolicy.reviewIntervalDays} días`
                : '-'}{' '}
              {/* <-- */}
            </span>
          </div>
          <div className="w-full flex flex-row justify-between my-2 p-2 border-b-1 border-gray-500/30">
            <p>Nivel máximo de inventario</p>
            <span>
              {!isLoteFijo
                ? product.fixedIntervalPolicy?.maxInventoryLevel ?? '-'
                : '-'}{' '}
              {/* <-- */}
            </span>
          </div>
          <div className="w-full flex flex-row justify-between my-2 p-2">
            <p>Última revisión</p>
            <span>
              {!isLoteFijo && product.fixedIntervalPolicy?.lastReviewDate
                ? product.fixedIntervalPolicy.lastReviewDate.replaceAll(
                    '-',
                    '/'
                  )
                : '-'}{' '}
              {/* <-- */}
            </span>
          </div>
        </div>

        {/* Proveedores */}
        <div className="col-span-2 row-span-4 col-start-3 row-start-2  border border-gray-500/30 rounded-2xl p-4">
          <h3 className="text-2xl font-bold w-full my-2">Proveedores</h3>
          <div className="w-full flex justify-end gap-x-2 py-2">
            <Button className="hover:cursor-pointer" onClick={openModal}>
              <ClipboardPlus className="h-4 w-4 text-white" />
            </Button>
            <Button>Setear proovedor como default</Button>
          </div>
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Costo unitario</TableHead>
                  <TableHead>Tiempo de entrega</TableHead>
                  <TableHead>Costo de envío</TableHead>
                  <TableHead>Por defecto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {product.providers.map((provider) => (
                  <TableRow key={provider.id}>
                    <TableCell>{provider.providerName}</TableCell>
                    <TableCell>{provider.unitCost}</TableCell>
                    <TableCell>{provider.leadTime}</TableCell>
                    <TableCell>{provider.shippingCost}</TableCell>
                    <TableCell>{provider.isDefault ? 'Sí' : 'No'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}
