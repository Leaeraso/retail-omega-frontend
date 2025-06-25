import { getProviders, getActiveProviders } from "@/services/provider.service"
import { useProviderStore } from "@/stores/provider.store"
import { useCallback } from "react"

export function useProviders() {
  const providers = useProviderStore((state) => state.providers)
  const activeProviders = useProviderStore((state) => state.activeProviders)
  const setProviders = useProviderStore((state) => state.setProviders)
  const setActiveProviders = useProviderStore((state) => state.setActiveProviders)

  const addProvider = useProviderStore((state) => state.addProvider)
  const updateProvider = useProviderStore((state) => state.updateProvider)
  const deleteProvider = useProviderStore((state) => state.deleteProvider)

  const fetchProviders = useCallback(async () => {
    const res = await getProviders()
    if (res) {
      setProviders(res)
    }
  }, [setProviders])

  const fetchActiveProviders = useCallback(async () => {
    const res = await getActiveProviders()
    if (res) {
      setActiveProviders(res)
    }
  }, [setActiveProviders])

  return {
    providers,
    activeProviders,
    fetchProviders,
    fetchActiveProviders,
    addProvider,
    updateProvider,
    deleteProvider,
  }
}
