export interface ProductProvider {
  id: number
  providerId: number
  productId: number
  providerName: string
  unitCost: number
  leadTime: number
  shippingCost: number
  isDefault: boolean
}
