import { Provider } from "@/types/provider.types"
import { create } from "zustand"

interface ProviderStore {
  providers: Provider[]
  setProviders: (p: Provider[]) => void
  addProvider: (p: Provider) => void
}

export const useProviderStore = create<ProviderStore>((set) => ({
  providers: [],
  setProviders: (providers) => set({ providers }),
  addProvider: (provider) =>
    set((state) => ({
      providers: [...state.providers, provider],
    })),
}))
