import { ProductFormInput } from "@/types/product.types"

export const createProduct = async (product: ProductFormInput) => {
  try {
    const res = await fetch(`${process.env.API_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    })
    const data = await res.json()
    return data
  } catch (error) {
    console.error(error)
    return null
  }
}
