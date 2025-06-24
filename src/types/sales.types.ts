export interface SalesTypes {
    id: number;
    date: Date;
    total: number;
    saleDetailResponses: SaleDetailsTypes[]
}

export interface SaleDetailsTypes {
    id: number;
    unitPrice: number;
    quantity: number;
    subtotal: number;
    productId: number;
    productCode: string;
    productDescription: string;
}


export interface SalesPagedResponse {
  content: SalesTypes[]
  totalPages: number
  totalElements: number
  size: number
  number: number
  first: boolean
  last: boolean
  numberOfElements: number
}