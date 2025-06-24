import { z } from "zod"

export const createOrderSchema = z.object({
  providerId: z.coerce.number().min(1, "El cliente es requerido"),
  details: z
    .array(
      z.object({
        productId: z.number().min(1),
        quantity: z.number().min(1),
      })
    )
    .min(1, "Debes agregar al menos un producto"),
})

export type OrderFormData = z.infer<typeof createOrderSchema>
