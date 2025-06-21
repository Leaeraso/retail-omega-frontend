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
}

export default function ProductDetailPage() {
  const params = useParams()
  const id = Number(params.id)

  return (
    <div>
      <h1>Producto: {product.description}</h1>
    </div>
  )
}
