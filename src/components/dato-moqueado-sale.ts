import { SalesTypes } from "@/types/sales.types";

export const sales: SalesTypes[] = [
    {
        id: 1,
        date: new Date(),
        total: 10000,
        saleDetailResponses: [
            {
                id: 1,
                unitPrice: 5000,
                quantity: 1,
                subtotal: 5000,
                productId: 101,
                productCode: 'P001',
                productDescription: 'Producto A',
            },
            {
                id: 2,
                unitPrice: 5000,
                quantity: 1,
                subtotal: 5000,
                productId: 102,
                productCode: 'P002',
                productDescription: 'Producto B',
            },
        ],
    },
    {
        id: 2,
        date: new Date(),
        total: 20000,
        saleDetailResponses: [
            {
                id: 3,
                unitPrice: 10000,
                quantity: 2,
                subtotal: 20000,
                productId: 103,
                productCode: 'P003',
                productDescription: 'Producto C',
            },
        ],
    },
    {
        id: 3,
        date: new Date(),
        total: 30000,
        saleDetailResponses: [
            {
                id: 4,
                unitPrice: 15000,
                quantity: 1,
                subtotal: 15000,
                productId: 104,
                productCode: 'P004',
                productDescription: 'Producto D',
            },
            {
                id: 5,
                unitPrice: 15000,
                quantity: 1,
                subtotal: 15000,
                productId: 105,
                productCode: 'P005',
                productDescription: 'Producto E',
            },
        ],
    },
];