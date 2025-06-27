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
export const getProductById = async (productId: number) => {
  try {
    const res = await fetch(`${BASE_URL}/products/${productId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (!res.ok) throw new Error(`Error al obtener el producto con ID ${productId}`)
    const data = await res.json()
    return data
  } catch (error) {
    console.error("Error en getProductById:", error)
    return null
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
export const getProductsByProvider = async (providerId: number) => {
  try {
    const res = await fetch(`${BASE_URL}/products/provider/${providerId}`)
    if (!res.ok) throw new Error("Error al obtener productos por proveedor")
    return await res.json()
  } catch (err) {
    console.error(err)
    return null
  }
}

export const getProductsBelowSecurityStock = async () => {
  try {
    const res = await fetch(`${BASE_URL}/products/belowSecurityStock`)
    if (!res.ok)
      throw new Error("Error al obtener productos bajo stock de seguridad")
    return await res.json()
  } catch (err) {
    console.error(err)
    return null
  }
}

export const getProductsBelowReorderPoint = async () => {
  try {
    const res = await fetch(`${BASE_URL}/products/belowReorderPoint`)
    if (!res.ok)
      throw new Error("Error al obtener productos bajo punto de pedido")
    return await res.json()
  } catch (err) {
    console.error(err)
    return null
  }
}

export const updateProduct = async (productId: number, p: ProductFormInput) => {
  try {
    const res = await fetch(`${BASE_URL}/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(p),
    })
    const data = await res.json()
    return data
  } catch (error) {
    console.error(error)
    return {}
  }
}

export const deleteProducts = async (id: number) => {
  try {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (res.status === 204) {
      return { success: true }
    }
    if (res.status === 400) {
      const errorData = await res.json()
      return {
        success: false,
        error: errorData.message || "No se puede eliminar el producto",
      }
    }
    return { success: false, error: "Error inesperado" }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Error de red" }
  }


}
