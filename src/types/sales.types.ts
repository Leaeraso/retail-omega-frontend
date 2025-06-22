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