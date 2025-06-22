import { ProductProvider } from "@/types/product-provider.types"
import { create } from "zustand"

interface ProductProviderStore {
  pps: ProductProvider[]
  addProductProvider: (p: ProductProvider) => void
}

export const useProductProviderStore = create<ProductProviderStore>((set) => ({
  pps: [],
  addProductProvider: (pp) =>
    set((state) => ({
      pps: [...state.pps, pp],
    })),
}))
