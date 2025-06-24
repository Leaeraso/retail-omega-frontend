import { Provider, ProviderFormInput } from "@/types/provider.types"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const getProviders = async () => {
  try {
    const res = await fetch(`${BASE_URL}/providers`, {
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

export const getActiveProviders = async () => {
  try {
    const res = await fetch(`${BASE_URL}/providers/active`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (!res.ok) {
      console.error("Error fetching active providers:", res.status)
      return []
    }
    const data = await res.json()
    return data
  } catch (error) {
    console.error(error)
    return []
  }
}

export const createProvider = async (payload: ProviderFormInput) => {
  try {
    const res = await fetch(`${BASE_URL}/providers`, {
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

export const updateProvider = async (
  id: number,
  payload: Partial<Provider>
) => {
  try {
    const res = await fetch(`${BASE_URL}/providers/${id}`, {
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

export const deleteProvider = async (id: number) => {
  try {
    const res = await fetch(`${BASE_URL}/providers/${id}`, {
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
      return { success: false, error: errorData.message || 'No se puede eliminar el proveedor' }
    }

    return { success: false, error: 'Error inesperado' }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Error de red' }
  }
}

