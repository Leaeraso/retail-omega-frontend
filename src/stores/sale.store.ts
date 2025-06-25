import { SalesTypes } from "@/types/sales.types"
import { create } from "zustand"

interface SaleStore {
  sales: SalesTypes[]
  pagination: Omit<
    {
      totalPages: number
      totalElements: number
      size: number
      number: number
      first: boolean
      last: boolean
      numberOfElements: number
    },
    "content"
  > | null
  setSales: (sales: SalesTypes[]) => void
  addSale: (sale: SalesTypes) => void
  setPagination: (
    pagination: Omit<
      {
        totalPages: number
        totalElements: number
        size: number
        number: number
        first: boolean
        last: boolean
        numberOfElements: number
      },
      "content"
    >
  ) => void
}

export const useSaleStore = create<SaleStore>((set) => ({
  sales: [],
  pagination: null,
  setSales: (sales) => set({ sales }),
  addSale: (sale) => set((state) => ({ sales: [...state.sales, sale] })),
  setPagination: (pagination) => set({ pagination }),
}))
