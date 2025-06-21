import { Product } from "@/types/product.types"
import { create } from "zustand"

interface ProductFormInput extends Partial<Product> {
  safetyStock: number
  reviewIntervalDays: number
}

interface ProductStore {
  products: Product[]
  setProducts: (p: Product[]) => void
  addProduct: (p: ProductFormInput) => Product
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
  addProduct: (product) => {
    const createdProduct = {
      id: 0,
      code: product.code || "",
      description: product.description || "",
      currentStock: product.currentStock ?? 0,
      annualDemand: product.annualDemand ?? 0,
      storageCost: product.storageCost ?? 0,
      totalCost: 0,
      deactivationDate: "",
      productState: "ALTA",
      inventoryPolicy: product.inventoryPolicy!,
      fixedLotPolicy: {
        optimalLotSize: 0,
        reorderPoint: 0,
        safetyStock: product.safetyStock ?? 0,
      },
      fixedIntervalPolicy: {
        safetyStock: 0,
        reviewIntervalDays: product.reviewIntervalDays ?? 0,
        maxInventoryLevel: 0,
        lastReviewDate: "",
      },
      providers: [],
    }

    set((state) => {
      createdProduct.id = state.products.length + 1
      return { products: [...state.products, createdProduct] }
    })

    return createdProduct
  },
}))
