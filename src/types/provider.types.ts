export interface Provider {
  id: number
  name: string
  email: string
  phone: string
  providerState: string
  deactivateDate: string | null
}

export interface ProviderFormInput {
  name: string
  email: string
  phone: string
}
