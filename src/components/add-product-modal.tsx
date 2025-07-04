'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import {
  createProductProviderSchema,
  createProductSchema,
  ProductFormData,
  ProductProviderFormData,
} from '@/schemas/product.schema'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { InventoryPolicy, Product } from '@/types/product.types'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { DialogTitle } from '@radix-ui/react-dialog'
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from './ui/select'
import { useProductProviderStore } from '@/stores/product-provider.store'
import { useEffect, useState } from 'react'
import { createProduct, updateProduct } from '@/services/product.service'

import { useProviders } from '@/hooks/use-providers' // <--- IMPORTA EL HOOK CORRECTAMENTE
import {
  boundProductProvider,
  setDefaultProductProvider,
  updateProviderProduct,
} from '@/services/product-provider.service'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
  onCreate: (p: Product) => void
  onUpdate: (id: number, p: ProductFormData) => void
  product?: Product | null
}

export default function AddProductModal({
  isOpen,
  onClose,
  onCreate,
  onUpdate,
  product,
}: Props) {
  const {
    register: registerProduct,
    handleSubmit: handleSubmitProduct,
    reset: resetProduct,
    control: controlProduct,
    setValue,
    reset,
    formState: { errors: errorsProduct, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      code: '',
      description: '',
      currentStock: 0,
      annualDemand: 0,
      storageCost: 0,
      inventoryPolicy: InventoryPolicy.LOTE_FIJO,
      safetyStock: 0,
      reviewIntervalDays: 0,
    },
  })

  const {
    register: registerProductProvider,
    getValues: getValuesProvider,
    reset: resetProductProvider,
    control: controlProductProvider,
    setValue: setProviderValue,
    reset: resetProvider,
    formState: { errors: errorsProductProvider },
    watch: watchProvider,
    trigger: triggerProviderValidation,
  } = useForm<ProductProviderFormData>({
    resolver: zodResolver(createProductProviderSchema),
    defaultValues: {
      providerId: 0,
      unitCost: 0,
      leadTime: 0,
      shippingCost: 0,
    },
  })

  const providerId = watchProvider('providerId')
  const isProviderSelected = providerId !== 0

  const addProductProvider = useProductProviderStore(
    (state) => state.addProductProvider
  )
  const updateProductProvider = useProductProviderStore(
    (state) => state.updateProductProvider
  )
  const [isLoteFijo, setIsLoteFijo] = useState(true)

  // Uso el hook correcto useProviders
  const { activeProviders, fetchActiveProviders } = useProviders()

  useEffect(() => {
    if (isOpen && activeProviders.length === 0) {
      fetchActiveProviders()
    }
    if (product) {
      setValue('code', product.code)
      setValue('description', product.description)
      setValue('currentStock', product.currentStock)
      setValue('annualDemand', product.annualDemand)
      setValue('storageCost', product.storageCost)
      setValue('inventoryPolicy', product.inventoryPolicy)
      setValue(
        'safetyStock',
        product.inventoryPolicy === 'LOTE_FIJO'
          ? product.fixedLotPolicy?.safetyStock
          : product.fixedIntervalPolicy?.safetyStock
      )
      setValue(
        'reviewIntervalDays',
        product.inventoryPolicy === 'LOTE_FIJO'
          ? 0
          : product.fixedIntervalPolicy?.reviewIntervalDays
      )
      setProviderValue('providerId', product.providers[0].id)
      setProviderValue('unitCost', product.providers[0].unitCost)
      setProviderValue('leadTime', product.providers[0].leadTime)
      setProviderValue('shippingCost', product.providers[0].shippingCost)
    } else {
      reset()
      resetProvider()
    }
  }, [
    isOpen,
    activeProviders.length,
    fetchActiveProviders,
    product,
    reset,
    resetProvider,
    setValue,
    setProviderValue,
  ])

  const onSubmit = async (productData: ProductFormData) => {
    const providerValidation = await triggerProviderValidation()

    if (!providerValidation) {
      toast.error('Completá los datos del proveedor')
      return
    }

    if (product) {
      const res = await updateProduct(product.id, productData)
      onUpdate(product.id, res)

      if (isProviderSelected && res.ok) {
        const res2 = await updateProviderProduct(product.id, {
          ...getValuesProvider(),
          productId: product.id,
        })
        if (res2.ok) {
          updateProductProvider({
            ...getValuesProvider(),
            productId: product.id,
          })
        }
      }

      toast.success('Producto actualizado correctamente')
    } else {
      const productCreated = await createProduct(productData)
      if (!productCreated) return

      const providerData = getValuesProvider()
      const bound = await boundProductProvider({
        productId: productCreated.id,
        ...providerData,
      })
      await setDefaultProductProvider(bound.data.id)

      addProductProvider(bound.data)
      onCreate(productCreated)
      toast.success('Producto creado correctamente')
    }

    resetProduct()
    resetProductProvider()
    onClose()
  }


  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent>
        <form onSubmit={handleSubmitProduct(onSubmit)} className="space-y-4">
          <DialogHeader className="w-full flex justify-center items-center">
            <DialogTitle className="text-2xl font-bold">
              {product ? 'Editar producto' : 'Crear producto'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 grid-rows-2 gap-4">
            <div className="row-span-2">
              {/* Campos del producto */}
              <div>
                <Label htmlFor="code" className="py-2">
                  Código
                </Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  {...registerProduct('code')}
                />
                {errorsProduct.code && (
                  <p className="text-red-500">{errorsProduct.code.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="description" className="py-2">
                  Descripción
                </Label>
                <Input
                  id="description"
                  type="text"
                  placeholder="Producto 1"
                  {...registerProduct('description')}
                />
                {errorsProduct.description && (
                  <p className="text-red-500">
                    {errorsProduct.description.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="currentStock" className="py-2">
                  Stock Actual
                </Label>
                <Input
                  id="currentStock"
                  type="number"
                  {...registerProduct('currentStock', { valueAsNumber: true })}
                />
                {errorsProduct.currentStock && (
                  <p className="text-red-500">
                    {errorsProduct.currentStock.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="annualDemand" className="py-2">
                  Demanda Anual
                </Label>
                <Input
                  id="annualDemand"
                  type="number"
                  {...registerProduct('annualDemand', { valueAsNumber: true })}
                />
                {errorsProduct.annualDemand && (
                  <p className="text-red-500">
                    {errorsProduct.annualDemand.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="storageCost" className="py-2">
                  Costo de almacenamiento
                </Label>
                <Input
                  id="storageCost"
                  type="number"
                  {...registerProduct('storageCost', { valueAsNumber: true })}
                />
                {errorsProduct.storageCost && (
                  <p className="text-red-500">
                    {errorsProduct.storageCost.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="inventoryPolicy" className="py-2">
                  Política de inventario
                </Label>
                <Controller
                  name="inventoryPolicy"
                  control={controlProduct}
                  render={({ field }) => (
                    <Select
                      value={field.value ? field.value.toString() : ''}
                      onValueChange={(value) => {
                        field.onChange(value)
                        setIsLoteFijo(value === 'LOTE_FIJO')
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona una política" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOTE_FIJO">Lote Fijo</SelectItem>
                        <SelectItem value="INTERVALO_FIJO">
                          Intervalo Fijo
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errorsProduct.inventoryPolicy && (
                  <p className="text-red-500">
                    {errorsProduct.inventoryPolicy.message}
                  </p>
                )}
              </div>
            </div>

            <div className="row-span-2">
              {/* Campos de seguridad y proveedor */}
              <div>
                <Label htmlFor="safetyStock" className="py-2">
                  Stock de Seguridad
                </Label>
                <Input
                  id="safetyStock"
                  type="number"
                  {...registerProduct('safetyStock', { valueAsNumber: true })}
                />
                {errorsProduct.safetyStock && (
                  <p className="text-red-500">
                    {errorsProduct.safetyStock.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="reviewIntervalDays" className="py-2">
                  Intervalo de revisión
                </Label>
                <Input
                  id="reviewIntervalDays"
                  type="number"
                  {...registerProduct('reviewIntervalDays', {
                    valueAsNumber: true,
                  })}
                  disabled={isLoteFijo}
                />
                {errorsProduct.reviewIntervalDays && (
                  <p className="text-red-500">
                    {errorsProduct.reviewIntervalDays.message}
                  </p>
                )}
              </div>

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
            </div>
          </div>

          <div className="flex flex-row justify-center items-center gap-x-4">
            <Button
              type="submit"
              className="text-white px-4 py-2 rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : product ? (
                'Actualizar'
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
