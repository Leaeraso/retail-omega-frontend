import { getOrders } from "@/services/order.service"
import { useOrderStore } from "@/stores/order.store"
import { useCallback } from "react"

export function useOrder() {
  const orders = useOrderStore((state) => state.orders)
  const setOrders = useOrderStore((state) => state.setOrders)
  const addOrder = useOrderStore((state) => state.addOrder)
  const updateOrder = useOrderStore((state) => state.updateOrder)
  const deleteOrder = useOrderStore((state) => state.deleteOrder)

  const fetchOrders = useCallback(async () => {
    const res = await getOrders()
    if (res) {
      setOrders(res)
    }
  }, [setOrders])

  return { orders, fetchOrders, addOrder, updateOrder, deleteOrder }
}
