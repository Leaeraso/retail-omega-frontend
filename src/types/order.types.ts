export interface Order {
  id: number
  createdAt: string
  sentAt: string
  recievedAt: string
  total: number
  purchaseOrderState: string
  providerId: number
  providerName: string
  details: OrderDetail[]
}

export interface OrderDetail {
  id: number
  quantity: number
  price: number
  subtotal: number
  productId: number
  productDescription: string
}

export interface OrderFormInput {
  providerId: number
  detials: {
    productId: number
    quantity: number
  }[]
}
