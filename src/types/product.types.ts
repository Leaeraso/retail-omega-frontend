interface FixedLotPolicy {
  optimalLotSize: number
  reorderPoint: number
  safetyStock: number
}

interface FixedIntervalPolicy {
  safetyStock: number
  reviewIntervalDays: number
  maxInventoryLevel: number
  lastReviewDate: string
}

interface Provider {
  id: number
  providerId: number
  productId: number
  providerName: string
  unitCost: number
  leadTime: number
  shippingCost: number
  isDefault: boolean
}

export interface Product {
  id: number
  code: string
  description: string
  currentStock: number
  annualDemand: number
  storageCost: number
  totalCost: number
  deactivationDate: string
  productState: string
  inventoryPolicy: InventoryPolicy
  fixedLotPolicy: FixedLotPolicy
  fixedIntervalPolicy: FixedIntervalPolicy
  providers: Provider[]
}

export enum InventoryPolicy {
  LOTE_FIJO = "LOTE_FIJO",
  INTERVALO_FIJO = "INTERVALO_FIJO",
}

export interface ProductFormInput extends Partial<Product> {
  safetyStock: number
  reviewIntervalDays: number
}
