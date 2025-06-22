const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const boundProductProvider = async (payload: {
  productId: number
  providerId: number
  unitCost: number
  leadTime: number
  shippingCost: number
}) => {
  try {
    const res = await fetch(`${BASE_URL}/product-providers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
    const data = await res.json()

    return data
  } catch (error) {
    console.error(error)
    return {}
  }
}

export const setDefaultProductProvider = async (id: number) => {
  try {
    const res = await fetch(`${BASE_URL}/product-providers/set-default/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await res.json()
    return data
  } catch (error) {
    console.error(error)
    return {}
  }
}
