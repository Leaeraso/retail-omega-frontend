import { Product } from '@/app/types/product.types'
import { Button } from './ui/button'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from './ui/table'
import { Badge } from './ui/badge'
import { ProductState } from './product-state'

const products = [
  {
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
        id: 0,
        providerId: 0,
        productId: 0,
        providerName: 'Juan Ignacio Fernandez',
        unitCost: 0,
        leadTime: 0,
        shippingCost: 0,
        isDefault: true,
      },
    ],
  },
  {
    id: 2,
    code: '1002',
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
        id: 0,
        providerId: 0,
        productId: 0,
        providerName: 'Maximiliano Rodriguez',
        unitCost: 0,
        leadTime: 0,
        shippingCost: 0,
        isDefault: true,
      },
    ],
  },
  {
    id: 3,
    code: '1003',
    description: 'Producto 1',
    currentStock: 120,
    annualDemand: 1342,
    storageCost: 4,
    totalCost: 360,
    deactivationDate: '2025-06-21',
    productState: 'BAJA',
    inventoryPolicy: 'INVENTARIO_FIJO',
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
        id: 0,
        providerId: 0,
        productId: 0,
        providerName: 'Martin perez',
        unitCost: 0,
        leadTime: 0,
        shippingCost: 0,
        isDefault: true,
      },
    ],
  },
]

export function ProductTable() {
  // const products: Product[] = []

  return (
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
            <TableHead>Mas+</TableHead>
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
                <TableCell>{product.fixedIntervalPolicy.safetyStock}</TableCell>
                <TableCell>{product.providers[0].providerName}</TableCell>
                <TableCell>
                  <Button className="hover:cursor-pointer">Ver más</Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
