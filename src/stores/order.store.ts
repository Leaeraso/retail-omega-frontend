import { Order } from "@/types/order.types"
import { create } from "zustand"

interface OrderStore {
  orders: Order[]
  setOrders: (o: Order[]) => void
  addOrder: (o: Order) => void
  updateOrder: (id: number, order: Partial<Order>) => void
  deleteOrder: (id: number) => void
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],

  setOrders: (o) => set({ orders: o }),

  addOrder: (o) => set((state) => ({ orders: [...state.orders, o] })),

  updateOrder: (id, order) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, ...order } : o)),
    })),

  deleteOrder: (id) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id ? { ...o, purchaseOrderState: "CANCELADA" } : o
      ),
    })),
}))
