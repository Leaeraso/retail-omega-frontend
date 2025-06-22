import { Provider } from "@/types/provider.types"
import { create } from "zustand"

interface ProviderStore {
  providers: Provider[]
  setProviders: (p: Provider[]) => void
  addProvider: (p: Provider) => void
  updateProvider: (id: number, p: Partial<Provider>) => void
  deleteProvider: (id: number, date: string) => void
}

export const useProviderStore = create<ProviderStore>((set) => ({
  providers: [],

  setProviders: (providers) => set({ providers }),

  addProvider: (provider) =>
    set((state) => ({
      providers: [...state.providers, provider],
    })),

  updateProvider: (id, provider) =>
    set((state) => ({
      providers: state.providers.map((p) =>
        p.id === id ? { ...p, ...provider } : p
      ),
    })),

  deleteProvider: (id, date) =>
    set((state) => ({
      providers: state.providers.map((p) =>
        p.id === id ? { ...p, deactiveDate: date } : p
      ),
    })),
}))
