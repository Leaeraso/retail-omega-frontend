import { InventoryPolicy } from "@/types/product.types"
import { z } from "zod"

export const productSchema = z.object({
  id: z.number().optional(),
  code: z.string().min(1, "El código es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  currentStock: z.coerce.number().nonnegative("Debe ser >= 0"),
  annualDemand: z.coerce.number().nonnegative("Debe ser >= 0"),
  storageCost: z.coerce.number().nonnegative().optional(),
  totalCost: z.coerce.number().nonnegative().optional(),
  productState: z.enum(["ALTA", "BAJA"]),
  inventoryPolicy: z.enum([
    InventoryPolicy.LOTE_FIJO,
    InventoryPolicy.INTERVALO_FIJO,
  ]),
  fixedLotPolicy: z.object({
    optimalLotSize: z.number(),
    reorderPoint: z.number(),
    safetyStock: z.number(),
  }),
  fixedIntervalPolicy: z.object({
    safetyStock: z.number(),
    reviewIntervalDays: z.number(),
    maxInventoryLevel: z.number(),
    lastReviewDate: z.string(),
  }),
  providers: z.array(
    z.object({
      id: z.number(),
      providerId: z.number(),
      productId: z.number(),
      providerName: z.string(),
      unitCost: z.number(),
      leadTime: z.number(),
      shippingCost: z.number(),
      isDefault: z.boolean(),
    })
  ),
})

export const createProductSchema = z.object({
  code: z.string().min(1, "El código es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  currentStock: z.coerce.number().nonnegative("Debe ser >= 0"),
  annualDemand: z.coerce.number().nonnegative("Debe ser >= 0"),
  storageCost: z.coerce.number().nonnegative("Debe ser >= 0"),
  inventoryPolicy: z.enum([
    InventoryPolicy.LOTE_FIJO,
    InventoryPolicy.INTERVALO_FIJO,
  ]),
  safetyStock: z.coerce.number().nonnegative("Debe ser >= 0"),
  reviewIntervalDays: z.coerce.number().nonnegative("Debe ser >= 0"),
})

export const createProductProviderSchema = z.object({
  providerId: z.number(),
  unitCost: z.coerce.number().nonnegative("Debe ser >= 0"),
  leadTime: z.coerce.number().nonnegative("Debe ser >= 0"),
  shippingCost: z.coerce.number().nonnegative("Debe ser >= 0"),
})

export type ProductSchema = typeof productSchema
export type ProductFormData = z.infer<typeof createProductSchema>
export type ProductProviderFormData = z.infer<
  typeof createProductProviderSchema
>
