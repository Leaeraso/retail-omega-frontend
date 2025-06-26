import { useOrderStore } from "@/stores/order.store"
import {
  deleteOrder as apiDeleteOrder,
  finalizeOrder as apiFinalizeOrder,
  sendOrder as apiSendOrder,
  updateOrder as apiUpdateOrder,
  getOrders as apiGetOrders,
  createOrder as apiCreateOrder, 
} from "@/services/order.service"
import { OrderFormData } from "@/schemas/order.schema"

export const useOrder = () => {
  const {
    orders,
    setOrders,
    addOrder: addOrderStore,
    updateOrder: updateOrderStore,
    deleteOrder: deleteOrderStore,
  } = useOrderStore()

  const fetchOrders = async () => {
    const data = await apiGetOrders()
    if (data) setOrders(data)
  }

 const addOrder = async (order: OrderFormData) => {
    try {
      const created = await apiCreateOrder(order)
      if (created) {
        addOrderStore(created)
        return created
      }
      throw new Error('Error desconocido al crear la orden')
    } catch (error) {
      throw error
    }
  }

  const updateOrder = async (id: number, order: OrderFormData) => {
    const updated = await apiUpdateOrder(id, order)
    if (updated) {
      updateOrderStore(id, updated)
      return updated
    }
    return null
  }

  const deleteOrder = async (id: number) => {
    await apiDeleteOrder(id)
    deleteOrderStore(id)
  }

  const sendOrder = async (id: number) => {
    await apiSendOrder(id)
  }

  const finalizeOrder = async (id: number) => {
    await apiFinalizeOrder(id)
  }

  return {
    orders,
    fetchOrders,
    addOrder,
    updateOrder,
    deleteOrder,
    sendOrder,
    finalizeOrder,
  }
}
