'use client'

import { ProductState } from '@/components/product-state'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useParams } from 'next/navigation'

const product = {
  id: 1,
  code: '1001',
  description: 'Producto 1',
  currentStock: 120,
  annualDemand: 1342,
  storageCost: 4,
  totalCost: 360,
  deactivationDate: '2025-06-21',
  productState: 'ALTA',
  inventoryPolicy: 'LOTE_FIJO',
  fixedLotPolicy: {
    optimalLotSize: 0,
    reorderPoint: 0,
    safetyStock: 0,
  },
  fixedIntervalPolicy: {
    safetyStock: 0,
    reviewIntervalDays: 0,
    maxInventoryLevel: 0,
    lastReviewDate: '2025-06-21',
  },
  providers: [
    {
      id: 1,
      providerId: 0,
      productId: 0,
      providerName: 'Juan Ignacio Fernandez',
      unitCost: 0,
      leadTime: 0,
      shippingCost: 0,
      isDefault: true,
    },
    {
      id: 2,
      providerId: 0,
      productId: 0,
      providerName: 'Juan Ignacio Fernandez',
      unitCost: 0,
      leadTime: 0,
      shippingCost: 0,
      isDefault: true,
    },
    {
      id: 3,
      providerId: 0,
      productId: 0,
      providerName: 'Juan Ignacio Fernandez',
      unitCost: 0,
      leadTime: 0,
      shippingCost: 0,
      isDefault: true,
    },
  ],
}

export default function ProductDetailPage() {
  //   const params = useParams()
  //   const id = Number(params.id)

  return (
    <div className="w-full h-auto overflow-hidden">
      <h1 className="text-3xl font-bold w-full flex justify-center items-center mt-7">
        Producto: {product.description}
      </h1>
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
                  {product.inventoryPolicy === 'LOTE_FIJO'
                    ? 'Lote fijo'
                    : 'Inventario fijo'}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="col-span-2 row-span-2 row-start-2  border border-gray-500/30 rounded-2xl p-4">
          <h3 className="text-2xl font-bold w-full my-2">Política de lote</h3>
          <div className="w-full flex flex-row justify-between border-b-1 border-gray-500/30 my-2 p-2">
            <p>Tamaño de lote optimo</p>
            <span>{product.fixedLotPolicy.optimalLotSize}</span>
          </div>
          <div className="w-full flex flex-row justify-between border-b-1 border-gray-500/30 my-2 p-2">
            <p>Punto de reorden</p>
            <span>{product.fixedLotPolicy.reorderPoint}</span>
          </div>
          <div className="w-full flex flex-row justify-between my-2 p-2">
            <p>Stock de seguridad</p>
            <span>{product.fixedLotPolicy.safetyStock}</span>
          </div>
        </div>
        <div className="col-span-2 row-span-4 col-start-3 row-start-2  border border-gray-500/30 rounded-2xl p-4">
          <h3 className="text-2xl font-bold w-full my-2">Proveedores</h3>
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Costo unitario</TableHead>
                  <TableHead>Tiempo de entrega</TableHead>
                  <TableHead>Costo de envio</TableHead>
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
                    <TableCell>{provider.isDefault}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="col-span-2 row-span-2 row-start-4  border border-gray-500/30 rounded-2xl p-4">
          <h3 className="text-2xl font-bold w-full my-2">
            Política de intervalo
          </h3>
          <div className="w-full flex flex-row justify-between border-b-1 border-gray-500/30 my-2 p-2">
            <p>Stock de seguridad</p>
            <span>{product.fixedIntervalPolicy.safetyStock}</span>
          </div>
          <div className="w-full flex flex-row justify-between border-b-1 border-gray-500/30 my-2 p-2">
            <p>Intervalo de revisión</p>
            <span>{product.fixedIntervalPolicy.reviewIntervalDays} días</span>
          </div>
          <div className="w-full flex flex-row justify-between my-2 p-2 border-b-1 border-gray-500/30">
            <p>Nivel máximo de inventario</p>
            <span>{product.fixedIntervalPolicy.maxInventoryLevel}</span>
          </div>
          <div className="w-full flex flex-row justify-between my-2 p-2">
            <p>Ultima revisión</p>
            <span>
              {product.fixedIntervalPolicy.lastReviewDate.replaceAll('-', '/')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
