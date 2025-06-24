import { Product } from "@/types/product.types"
import { create } from "zustand"

interface ProductStore {
  products: Product[]
  activeProducts: Product[]
  filteredProducts: Product[]
  setProducts: (p: Product[]) => void
  setActiveProducts: (p: Product[]) => void
  setFilteredProducts: (p: Product[]) => void
  addProduct: (p: Product) => void
  updateProductState: (id: number, newState: string) => void
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  activeProducts: [],
  filteredProducts: [],
  setProducts: (products) => set({ products }),
  setActiveProducts: (activeProducts) => set({ activeProducts }),
  setFilteredProducts: (filteredProducts) => set({ filteredProducts }),
  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, product],
      activeProducts:
        product.productState === "ALTA"
          ? [...state.activeProducts, product]
          : state.activeProducts,
    })),
  updateProductState: (id, newState) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, productState: newState } : p
      ),
      activeProducts: state.activeProducts.filter((p) => p.id !== id),
    })),
}))
