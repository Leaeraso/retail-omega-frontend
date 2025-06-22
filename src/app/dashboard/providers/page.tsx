import { ProviderTable } from '@/components/provider-table'

export default function Providers() {
  return (
    <div>
      <h1 className="text-3xl font-bold w-full flex justify-center items-center mt-7">
        {' '}
        Proveedores
      </h1>
      <ProviderTable />
    </div>
  )
}
