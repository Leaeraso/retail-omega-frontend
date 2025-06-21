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
import { ProductState } from './product-state'
import { useRouter } from 'next/navigation'
import { ClipboardPlus, Eye, Pen, Trash } from 'lucide-react'
import { useState } from 'react'
import { useProductStore } from '@/stores/product.store'
import AddProductModal from './add-product-modal'

export function ProductTable() {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const products = useProductStore((state) => state.products)
  const addProduct = useProductStore((state) => state.addProduct)

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <main>
      <div className="flex flex-row justify-end items-center gap-x-2 mx-2 my-4">
        <Button className="hover:cursor-pointer" onClick={openModal}>
          <ClipboardPlus className="h-4 w-4 text-white" />
        </Button>
        <Button className="hover:cursor-pointer">
          <Pen className="h-4 w-4 text-white" />
        </Button>
      </div>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onCreate={addProduct}
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
              <TableHead>Proovedores</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              return (
                <TableRow key={product.id}>
                  <TableCell>{product.code}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.currentStock}</TableCell>
                  <TableCell>{product.annualDemand}</TableCell>
                  <TableCell>$ {product.storageCost}</TableCell>
                  <TableCell>$ {product.totalCost}</TableCell>
                  <TableCell>
                    <ProductState state={product.productState} />
                  </TableCell>
                  <TableCell>
                    {product.inventoryPolicy === 'LOTE_FIJO'
                      ? 'Lote Fijo'
                      : 'Inventario Fijo'}
                  </TableCell>
                  <TableCell>{product.fixedLotPolicy.reorderPoint}</TableCell>
                  <TableCell>
                    {product.fixedIntervalPolicy.safetyStock}
                  </TableCell>
                  <TableCell>{product.providers[0].providerName}</TableCell>
                  <TableCell>
                    <div className="flex flex-row justify-end items-center gap-x-2">
                      <Button className="hover:cursor-pointer">
                        <Trash className="h-3 w-3 text-white" />
                      </Button>
                      <Button
                        className=" text-white hover:cursor-pointer"
                        onClick={() =>
                          router.push(`/dashboard/products/${product.id}`)
                        }
                      >
                        <Eye className="h-3 w-3 text-white" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </main>
  )
}
