import { z } from 'zod'

export const saleProductSchema = z.object({
    productId: z.coerce.number().min(1, 'Producto requerido'),
    quantity: z.coerce.number().min(1, 'Cantidad debe ser mayor a 0'),
    unitPrice: z.coerce.number().min(0, 'Precio debe ser mayor o igual a 0'),
})

export type SaleProduct = z.infer<typeof saleProductSchema>