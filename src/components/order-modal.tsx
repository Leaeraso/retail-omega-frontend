'use client'

import { createOrderSchema, OrderFormData } from '@/schemas/order.schema'
import { Order } from '@/types/order.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Dialog, DialogHeader } from './ui/dialog'
import { DialogContent, DialogTitle } from '@radix-ui/react-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { useProviders } from '@/hooks/use-providers'
import { useEffect, useState } from 'react'
import { Label } from './ui/label'
import { useProducts } from '@/hooks/use-product'
import { Button } from './ui/button'
import { Loader2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useOrder } from '@/hooks/use-order'

interface Props {
  isOpen: boolean
  onClose: () => void
  onCreate: (o: Order) => void
  onUpdate: (id: number, o: OrderFormData) => void
  order?: Order | null
}

export function OrderModal({ isOpen, onClose, order }: Props) {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    watch,
    formState: { isSubmitting },
  } = useForm<OrderFormData>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: { providerId: 0, details: [] },
  })

  const { activeProviders, fetchActiveProviders } = useProviders()
  const {  filteredProducts, fetchProductsByProvider } = useProducts()
  const { updateOrder, addOrder } = useOrder()

  const [selectedProductId, setSelectedProductId] = useState<number>(0)
  const [quantity, setQuantity] = useState<number>(1)

  const addedProducts = watch('details')
  const selectedProviderId = watch('providerId')

  useEffect(() => {
    if (isOpen) {
      if (activeProviders.length === 0) fetchActiveProviders()
    }
  }, [isOpen, activeProviders.length, fetchActiveProviders])

  useEffect(() => {
    if (!selectedProviderId || selectedProviderId === 0) {
      fetchProductsByProvider(0)
      setSelectedProductId(0)
      if (!order) setValue('details', []) 
      return
    }

    fetchProductsByProvider(selectedProviderId)
    setSelectedProductId(0)

    if (!order || selectedProviderId !== order.providerId) {
      setValue('details', [])
    }
  }, [selectedProviderId, fetchProductsByProvider, setValue, order])

  useEffect(() => {
    if (order) {
      reset({ providerId: order.providerId, details: order.details })
      if (order.providerId) {
        fetchProductsByProvider(order.providerId)
      }
    } else {
      reset({ providerId: 0, details: [] })
      fetchProductsByProvider(0)
    }
  }, [order, reset, fetchProductsByProvider])

  const addProduct = () => {
    if (!selectedProductId || quantity <= 0) {
      toast.error('Selecciona un producto y una cantidad válida')
      return
    }

    const current = getValues('details') || []

    const existingIndex = current.findIndex(p => p.productId === selectedProductId)

    if (existingIndex !== -1) {
      const updated = [...current]
      updated[existingIndex] = { productId: selectedProductId, quantity } // reemplaza
      setValue('details', updated)

      toast.success('Cantidad actualizada para el producto seleccionado')
    } else {
      setValue('details', [...current, { productId: selectedProductId, quantity }])
      toast.success('Producto agregado correctamente')
    }

    setSelectedProductId(0)
    setQuantity(1)
  }


  const onSubmit = async (orderData: OrderFormData) => {
    try {
      if (order) {
        const updated = await updateOrder(order.id, orderData)
        if (!updated) throw new Error('Error al actualizar el pedido')
        toast.success('Pedido actualizado correctamente')
      } else {
        const createdOrder = await addOrder(orderData)
        if (!createdOrder) throw new Error('Error al crear el pedido')
        toast.success('Pedido creado correctamente')
      }
      reset()
      onClose()
    } catch (error) {
      toast.error((error as Error).message || 'Error en la operación')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader className="flex justify-center items-center pb-2">
            <DialogTitle className="text-xl font-semibold">
              {order ? 'Editar Pedido' : 'Crear Pedido'}
            </DialogTitle>
          </DialogHeader>

          {/* Select Proveedor */}
          <div>
            <Label htmlFor="providerId" className="py-1 text-sm font-medium">
              Proveedor
            </Label>
            <Controller
              name="providerId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value ? field.value.toString() : ''}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <SelectTrigger className="w-full py-1 text-sm">
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

          {/* Select Producto */}
          <div className="space-y-1">
            <Label className="text-sm font-medium">Producto</Label>
            <Select
              value={selectedProductId ? selectedProductId.toString() : ''}
              onValueChange={(value) => setSelectedProductId(Number(value))}
              disabled={!selectedProviderId || selectedProviderId === 0}
            >
              <SelectTrigger className="w-full py-1 text-sm">
                <SelectValue placeholder="Selecciona un producto" />
              </SelectTrigger>
              <SelectContent>
                {!selectedProviderId || selectedProviderId === 0 ? (
                  <SelectItem value="no-provider" disabled>
                    Debes seleccionar un proveedor
                  </SelectItem>
                ) :  filteredProducts.length === 0 ? (
                  <SelectItem value="loading" disabled>
                    Cargando productos...
                  </SelectItem>
                ) : (
                   filteredProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.description}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            <Label className="mt-2 text-sm font-medium">Cantidad</Label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full border px-2 py-1 rounded text-sm"
            />

            <button
              type="button"
              onClick={addProduct}
              className="mt-2 bg-blue-600 text-white text-sm px-3 py-1.5 rounded"
            >
              Agregar producto
            </button>
          </div>

          {/* Lista de productos agregados */}
          <div>
            <h3 className="text-md font-semibold mb-1">Productos agregados:</h3>
            {addedProducts.length === 0 ? (
              <p className="text-xs text-gray-500">No hay productos aún.</p>
            ) : (
              <ul className="space-y-1 max-h-40 overflow-y-auto">
                {addedProducts.map((item, index) => {
                  const prod =  filteredProducts.find((p) => p.id === item.productId)
                  return (
                    <li
                      key={index}
                      className="flex justify-between items-center border p-1 rounded text-sm"
                    >
                      <span>
                        {prod?.description ?? 'Producto desconocido'} (x{item.quantity})
                      </span>
                      <Button
                        type="button"
                        onClick={() => {
                          const updated = addedProducts.filter((_, i) => i !== index)
                          setValue('details', updated)
                        }}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:underline p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {/* Botón submit */}
          <div className="flex justify-center items-center gap-3 pt-3">
            <Button
              type="submit"
              className="text-white text-sm px-4 py-2 rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : order ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
