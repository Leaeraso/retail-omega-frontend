import { ProductFormInput } from "@/types/product.types"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL
export const createProduct = async (product: ProductFormInput) => {
  try {
    console.log("data", product)

    const res = await fetch(`${BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    })
    if (!res.ok) {
      console.error("Error del servidor:", res.status, await res.text())
      return {}
    }
    const data = await res.json()
    return data
  } catch (error) {
    console.error(error)
    return {}
  }
}

export const getProducts = async () => {
  try {
    console.log("BASE_URL:", process.env.NEXT_PUBLIC_API_URL)

    const res = await fetch(`${BASE_URL}/products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await res.json()
    return data
  } catch (error) {
    console.error(error)
    return []
  }
}
export const getActiveProducts = async () => {
  try {
    const res = await fetch(`${BASE_URL}/products/active`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (!res.ok) throw new Error("Error al obtener productos activos")
    return await res.json()
  } catch (error) {
    console.error("Error en getActiveProducts:", error)
    return []
  }
}
