import { Provider } from "@/types/provider.types"
import { create } from "zustand"

interface ProviderStore {
  providers: Provider[]
  activeProviders: Provider[]
  setProviders: (p: Provider[]) => void
  setActiveProviders: (p: Provider[]) => void
  addProvider: (p: Provider) => void
  updateProvider: (id: number, p: Partial<Provider>) => void
  deleteProvider: (id: number, date: string) => void
}

export const useProviderStore = create<ProviderStore>((set) => ({
  providers: [],
  activeProviders: [],

  setProviders: (providers) => set({ providers }),
  setActiveProviders: (activeProviders) => set({ activeProviders }),

  addProvider: (provider) =>
    set((state) => ({
      providers: [...state.providers, provider],
      activeProviders: provider.providerState === "BAJA"
        ? state.activeProviders
        : [...state.activeProviders, provider],
    })),

  updateProvider: (id, provider) =>
    set((state) => ({
      providers: state.providers.map((p) =>
        p.id === id ? { ...p, ...provider } : p
      ),
      activeProviders: state.activeProviders.map((p) =>
        p.id === id ? { ...p, ...provider } : p
      ),
    })),

  deleteProvider: (id, date) =>
    set((state) => ({
      providers: state.providers.map((p) =>
        p.id === id ? { ...p, deactiveDate: date } : p
      ),
      activeProviders: state.activeProviders.filter((p) => p.id !== id),
    })),
}))
