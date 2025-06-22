import { getProviders } from "@/services/provider.service"
import { useProviderStore } from "@/stores/provider.store"
import { useCallback } from "react"

export function useProviders() {
  const providers = useProviderStore((state) => state.providers)
  const setProviders = useProviderStore((state) => state.setProviders)

  const fetchProviders = useCallback(async () => {
    const res = await getProviders()
    if (res) {
      setProviders(res)
    }
  }, [setProviders])

  return { providers, fetchProviders }
}
