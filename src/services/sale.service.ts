import { SaleProduct } from "@/schemas/sale.schema"
import { SalesPagedResponse, SalesTypes } from "@/types/sales.types"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const getSalesPaged = async (
  page: number = 0,
  size: number = 8
): Promise<SalesPagedResponse | null> => {
  try {
    const res = await fetch(`${BASE_URL}/sales/paged?page=${page}&size=${size}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    if (!res.ok) throw new Error("Error fetching paged sales")
    return await res.json()
  } catch (err) {
    console.error("Error al obtener ventas paginadas:", err)
    return null
  }
}

export const createSale = async (
  data: { saleDetail: SaleProduct[] }
): Promise<SalesTypes | null> => {
  try {
    const res = await fetch(`${BASE_URL}/sales`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      let errorMsg = "Error creando venta"
      try {
        const errorData = await res.json()
        if (errorData?.message) errorMsg = errorData.message
      } catch {
      }
      throw new Error(errorMsg)
    }

    return await res.json()
  } catch (err) {
    console.error("Error al crear venta:", err)
    throw err
  }
}
