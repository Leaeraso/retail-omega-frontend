import { OrderFormData } from "@/schemas/order.schema"
import { Order } from "@/types/order.types"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const getOrders = async () => {
  try {
    const res = await fetch(`${BASE_URL}/purchase-orders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await res.json()
    return data
  } catch (error) {
    console.error(error)
    return null
  }
}

export const createOrder = async (order: OrderFormData) => {
  try {
    const res = await fetch(`${BASE_URL}/purchase-orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => null)
      const message = errorData?.message || `Error ${res.status}`
      throw new Error(message)
    }

    const data = await res.json()
    return data
  } catch (error) {
    throw error
  }
}
export const updateOrder = async (id: number, order: OrderFormData): Promise<Order | null> => {
  try {
    const res = await fetch(`${BASE_URL}/purchase-orders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    })
    const data = await res.json()
    return data
  } catch (error) {
    console.error(error)
    return null
  }
}

export const deleteOrder = async (id: number) => {
  try {
    const res = await fetch(`${BASE_URL}/purchase-orders/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await res.json()
    return data
  } catch (error) {
    console.error(error)
    return null
  }
}

export const sendOrder = async (id: number) => {
  try {
    await fetch(`${BASE_URL}/purchase-orders/${id}/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
    return
  } catch (error) {
    console.error(error)
    return
  }
}

export const finalizeOrder = async (id: number) => {
  try {
    fetch(`${BASE_URL}/purchase-orders/${id}/finalize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
    return
  } catch (error) {
    console.error(error)
    return
  }
}
