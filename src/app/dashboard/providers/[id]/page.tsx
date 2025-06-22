'use client'

import { useProviderStore } from '@/stores/provider.store'
import { Button } from '@/components/ui/button'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { ProductState } from '@/components/product-state'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ProviderDetails() {
  const router = useRouter()
  const params = useParams()
  const id = Number(params.id)
  const provider = useProviderStore((state) =>
    state.providers.find((p) => p.id === id)
  )

  if (!provider) {
    return <div>Proveedor no encontrado</div>
  }

  return (
    <div className="w-full h-auto overflow-hidden">
      <div className="flex flex-row items-center">
        <div className="flex flex-row justify-end items-center gap-x-2 mx-2 my-4">
          <Button
            className="hover:cursor-pointer"
            onClick={() => router.push('/dashboard/providers')}
          >
            <ArrowLeft className="h-4 w-4 text-white" />
          </Button>
        </div>
        <h1 className="text-3xl font-bold w-full flex justify-center items-center mt-7">
          Proovedor: {provider.name}
        </h1>
      </div>

      <div className="flex justify-center mt-8">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Detalles del Proveedor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Id</p>
              <p className="text-lg font-medium">{provider.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Nombre</p>
              <p className="text-lg font-medium">{provider.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-lg font-medium">{provider.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Teléfono</p>
              <p className="text-lg font-medium">{provider.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estado</p>
              <ProductState state={provider.providerState} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fecha baja</p>
              <p className="text-lg font-medium">
                {provider.deactivateDate || '-'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
