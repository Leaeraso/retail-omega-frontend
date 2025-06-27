import { ProductProvider } from "@/types/product-provider.types"
import { create } from "zustand"

interface ProductProviderStore {
  pps: ProductProvider[]
  addProductProvider: (p: ProductProvider) => void
  updateProductProvider: (pp: Partial<ProductProvider>) => void
}

export const useProductProviderStore = create<ProductProviderStore>((set) => ({
  pps: [],
  addProductProvider: (pp) =>
    set((state) => ({
      pps: [...state.pps, pp],
    })),

  updateProductProvider: (pp) =>
    set((state) => ({
      pps: state.pps.map((p) =>
        p.providerId === pp.providerId ? { ...p, ...pp } : p
      ),
    })),
}))
