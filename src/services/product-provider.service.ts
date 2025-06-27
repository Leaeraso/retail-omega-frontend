const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const boundProductProvider = async (payload: {
  productId: number
  providerId: number
  unitCost: number
  leadTime: number
  shippingCost: number
}) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product-providers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (res.status === 400) {
      const error = await res.json()
      return { success: false, error: error.message || "Error de validación" }
    }

    if (!res.ok) {
      return {
        success: false,
        error: `Error ${res.status}: ${await res.text()}`
      }
    }

    const data = await res.json()
    return { success: true, data }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Error de red o servidor' }
  }
}



export const setDefaultProductProvider = async (id: number) => {
  try {
    console.log(`${BASE_URL}/product-providers/set-default/${id}`)
    const res = await fetch(`${BASE_URL}/product-providers/set-default/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await res.text()
    return data
  } catch (error) {
    console.error(error)
    return {}
  }
}

export const updateProviderProduct = async (
  productId: number,
  payload: {
    productId: number
    providerId: number
    unitCost: number
    leadTime: number
    shippingCost: number
  }
) => {
  try {
    const res = await fetch(`${BASE_URL}/products-providers/${productId}`, {
      method: "PUT",
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
