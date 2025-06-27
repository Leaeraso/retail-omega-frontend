import {
  createProductProviderSchema,
  ProductProviderFormData,
} from '@/schemas/product.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { useProviders } from '@/hooks/use-providers'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { boundProductProvider } from '@/services/product-provider.service'
import toast from 'react-hot-toast'
import { ProductProvider } from '@/types/product-provider.types'

interface Props {
  isOpen: boolean
  onClose: () => void
  onCreate: (p: ProductProvider) => void
  productId: number
}

export function ProductProviderModal({
  isOpen,
  onClose,
  onCreate,
  productId,
}: Props) {
  const {
    register: registerProductProvider,
    reset: resetProductProvider,
    control: controlProductProvider,
    handleSubmit,
    reset: resetProvider,
    formState: { errors: errorsProductProvider, isSubmitting },
    watch: watchProvider,
  } = useForm<ProductProviderFormData>({
    resolver: zodResolver(createProductProviderSchema),
    defaultValues: {
      providerId: 0,
      unitCost: 0,
      leadTime: 0,
      shippingCost: 0,
    },
  })
  const { activeProviders, fetchActiveProviders } = useProviders()

  const providerId = watchProvider('providerId')
  const isProviderSelected = providerId !== 0

  useEffect(() => {
    if (isOpen && activeProviders.length === 0) fetchActiveProviders()
  }, [isOpen, activeProviders.length, fetchActiveProviders])

  const onSubmit = async (productProviderData: ProductProviderFormData) => {
    try {
      const res = await boundProductProvider({
        ...productProviderData,
        productId,
      })
      onCreate(res)
      toast.success('Proveedor agregado correctamente')

      resetProductProvider()
      resetProvider()
      onClose()
    } catch (error) {
      console.error(error)
      toast.error('Error al agregar proveedor')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader className="w-full flex justify-center items-center">
            <DialogTitle className="text-2xl font-bold">
              Agregar proveedor
            </DialogTitle>
          </DialogHeader>

          <div>
            <Label htmlFor="providerId" className="py-2">
              Proveedor
            </Label>
            <Controller
              name="providerId"
              control={controlProductProvider}
              render={({ field }) => (
                <Select
                  value={field.value ? field.value.toString() : ''}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeProviders.length === 0 ? (
                      <SelectItem value="loading" disabled>
                        Cargando proveedores...
                      </SelectItem>
                    ) : (
                      activeProviders.map((provider) => (
                        <SelectItem
                          key={provider.id}
                          value={provider.id.toString()}
                        >
                          {provider.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {isProviderSelected && (
            <>
              <div>
                <Label htmlFor="unitCost" className="py-2">
                  Costo unitario
                </Label>
                <Input
                  id="unitCost"
                  type="number"
                  {...registerProductProvider('unitCost', {
                    valueAsNumber: true,
                  })}
                />
                {errorsProductProvider.unitCost && (
                  <p className="text-red-500">
                    {errorsProductProvider.unitCost.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="leadTime" className="py-2">
                  Lead Time
                </Label>
                <Input
                  id="leadTime"
                  type="number"
                  {...registerProductProvider('leadTime', {
                    valueAsNumber: true,
                  })}
                />
                {errorsProductProvider.leadTime && (
                  <p className="text-red-500">
                    {errorsProductProvider.leadTime.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="shippingCost" className="py-2">
                  Costo de envío
                </Label>
                <Input
                  id="shippingCost"
                  type="number"
                  {...registerProductProvider('shippingCost', {
                    valueAsNumber: true,
                  })}
                />
                {errorsProductProvider.shippingCost && (
                  <p className="text-red-500">
                    {errorsProductProvider.shippingCost.message}
                  </p>
                )}
              </div>
            </>
          )}

          <div className="flex flex-row justify-center items-center gap-x-4">
            <Button
              type="submit"
              className="text-white px-4 py-2 rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                'Crear'
              )}
            </Button>
            <Button className="text-white px-4 py-2 rounded" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
