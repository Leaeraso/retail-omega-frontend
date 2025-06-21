import { Product } from "@/types/product.types"
import { create } from "zustand"

interface ProductStore {
  products: Product[]
  setProducts: (p: Product[]) => void
  addProduct: (p: Product) => void
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, product],
    })),
}))
