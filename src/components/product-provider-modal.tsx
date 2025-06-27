'use client'

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
import { updateProviderProduct } from '@/services/product-provider.service'
import toast from 'react-hot-toast'
import { ProductProvider } from '@/types/product-provider.types'

interface Props {
  isOpen: boolean
  onClose: () => void
  onCreate?: (p: ProductProvider) => void
  onUpdate?: (p: ProductProvider) => void
  productId: number
  editingProvider?: ProductProvider | null
}

export function ProductProviderModal({
  isOpen,
  onClose,
  onCreate,
  onUpdate,
  productId,
  editingProvider = null,
}: Props) {
  const {
    register: registerProductProvider,
    reset,
    control: controlProductProvider,
    handleSubmit,
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

  useEffect(() => {
    if (editingProvider) {
      reset({
        providerId: editingProvider.providerId,
        unitCost: editingProvider.unitCost,
        leadTime: editingProvider.leadTime,
        shippingCost: editingProvider.shippingCost,
      })
    } else {
      reset({
        providerId: 0,
        unitCost: 0,
        leadTime: 0,
        shippingCost: 0,
      })
    }
  }, [editingProvider, reset])

  const onSubmit = async (data: ProductProviderFormData) => {
    if (editingProvider) {
      const res = await updateProviderProduct(productId, {
        productId,
        providerId: data.providerId,
        unitCost: data.unitCost,
        leadTime: data.leadTime,
        shippingCost: data.shippingCost,
      })

      if (!res.success) {
        toast.error(res.error || 'Error al actualizar proveedor')
        return
      }

      if (onUpdate) {
        onUpdate(res.data)
      }

      if (onCreate) {
        onCreate(res.data)
      }
      toast.success('Proveedor actualizado correctamente')
      onClose()
    } else {
      const res = await boundProductProvider({
        ...data,
        productId,
      })

      if (!res.success) {
        toast.error(res.error || 'Error al agregar proveedor')
        return
      }

      if (onUpdate) {
        onUpdate(res.data)
      }

      if (onCreate) {
        onCreate(res.data)
      }
      
      toast.success('Proveedor agregado correctamente')
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader className="w-full flex justify-center items-center">
            <DialogTitle className="text-2xl font-bold">
              {editingProvider ? 'Editar proveedor' : 'Agregar proveedor'}
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
                  disabled={!!editingProvider}
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
                        <SelectItem key={provider.id} value={provider.id.toString()}>
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
                  <p className="text-red-500">{errorsProductProvider.unitCost.message}</p>
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
                  <p className="text-red-500">{errorsProductProvider.leadTime.message}</p>
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
                  <p className="text-red-500">{errorsProductProvider.shippingCost.message}</p>
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
                editingProvider ? 'Actualizar' : 'Crear'
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
