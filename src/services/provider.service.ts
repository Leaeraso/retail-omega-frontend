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
