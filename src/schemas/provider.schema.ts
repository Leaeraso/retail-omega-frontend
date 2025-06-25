import { z } from "zod"

export const createProviderSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Debe ingresar un email valido").min(1, "El correo es requerido"),
  phone: z.string().min(1, "El telefono es requerido"),
})

export type ProviderFormData = z.infer<typeof createProviderSchema>
