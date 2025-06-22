const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const boundProductProvider = async (payload: {
  productId: number
  providerId: number
}) => {
  try {
    const body = {
      ...payload,
      unitCost: 0,
      leadTime: 0,
      shippingCost: 0,
    }

    const res = await fetch(`${BASE_URL}/product-providers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    const data = await res.json()

    return data
  } catch (error) {
    console.error(error)
    return {}
  }
}
