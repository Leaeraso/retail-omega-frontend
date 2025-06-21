import { ProductProvider } from "@/types/product-provider.types"
import { create } from "zustand"

interface ProductProviderStore {
  pps: ProductProvider[]
  addProductProvider: (
    p: Pick<ProductProvider, "productId" | "providerId">
  ) => void
}

export const useProductProviderStore = create<ProductProviderStore>((set) => ({
  pps: [],
  addProductProvider: (pp) =>
    set((state) => ({
      pps: [
        ...state.pps,
        {
          ...pp,
          unitCost: 0,
          leadTime: 0,
          shippingCost: 0,
        },
      ],
    })),
}))
