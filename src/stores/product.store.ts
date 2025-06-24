import { Product } from "@/types/product.types"
import { create } from "zustand"

interface ProductStore {
  products: Product[]
  activeProducts: Product[]
  setProducts: (p: Product[]) => void
  setActiveProducts: (p: Product[]) => void
  addProduct: (p: Product) => void
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  activeProducts: [],
  setProducts: (products) => set({ products }),
  setActiveProducts: (activeProducts) => set({ activeProducts }),
  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, product],
      activeProducts: product.productState === 'ALTA'
        ? [...state.activeProducts, product]
        : state.activeProducts,
    })),
}))

