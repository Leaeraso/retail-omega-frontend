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
import {
  createOrder,
  deleteOrder,
  finalizeOrder,
  sendOrder,
  updateOrder,
} from '@/services/order.service'
import { Button } from './ui/button'
import { Loader2, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  isOpen: boolean
  onClose: () => void
  onCreate: (o: Order) => void
  onUpdate: (id: number, o: OrderFormData) => void
  order?: Order | null
}

export function OrderModal({
  isOpen,
  onClose,
  onCreate,
  onUpdate,
  order,
}: Props) {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    watch: watchProvider,
    formState: { isSubmitting },
  } = useForm<OrderFormData>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      providerId: 0,
      details: [],
    },
  })

  const { providers, fetchProviders } = useProviders()
  const { products, fetchProducts } = useProducts()
  const [selectedProductId, setSelectedProductId] = useState<number>(0)
  const [quantity, setQuantity] = useState<number>(1)

  const addProduct = () => {
    if (selectedProductId && quantity > 0) {
      const current = getValues('details')
      const alreadtExists = current.some(
        (p) => p.productId === selectedProductId
      )

      if (!alreadtExists) {
        setValue('details', [
          ...current,
          { productId: selectedProductId, quantity },
        ])
        setSelectedProductId(0)
        setQuantity(1)
      }
    }
  }

  useEffect(() => {
    if (isOpen && providers.length === 0) {
      fetchProviders()
    }
    if (isOpen && products.length === 0) {
      fetchProducts()
    }
  }, [isOpen])

  const addedProducts = watchProvider('details')

  const handleDelete = async () => {
    if (!order) return
    try {
      await deleteOrder(order.id)
      toast.success('Pedido cancelado correctamente')
      onClose()
    } catch (error) {
      console.error('Error al eliminar la orden:', error)
      toast.error('Error al cancelar la orden')
    }
  }

  const handleSend = async () => {
    if (!order) return
    try {
      await sendOrder(order.id)
      toast.success('Pedido enviado correctamente')
      onClose()
    } catch (error) {
      console.error('Error al enviar la orden:', error)
      toast.error('Error al enviar la orden')
    }
  }

  const handleFinalize = async () => {
    if (!order) return
    try {
      await finalizeOrder(order.id)
      toast.success('Pedido finalizado correctamente')
      onClose()
    } catch (error) {
      console.error('Error al finalizar la orden:', error)
      toast.error('Error al finalizar la orden')
    }
  }

  const onSubmit = async (orderData: OrderFormData) => {
    if (order) {
      await updateOrder(order.id, orderData)
      onUpdate(order.id, orderData)
      toast.success('Pedido actualizado correctamente')
    } else {
      const createdOrder = await createOrder(orderData)
      if (!createOrder) {
        toast.error('Error al crear el pedido')
        return
      }
      onCreate(createdOrder)
      toast.success('Pedido creado correctamente')
    }

    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="w-full flex justify-center items-center">
            <DialogTitle className="text-2xl font-bold">
              {order ? 'Editar Pedido' : 'Crear Pedido'}
            </DialogTitle>
          </DialogHeader>
          <div>
            <Label htmlFor="providerId" className="py-2">
              Proovedor
            </Label>
            <Controller
              name="providerId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value ? field.value.toString() : ''}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {providers.length === 0 ? (
                      <SelectItem value="hola" disabled>
                        Cargando proveedores...
                      </SelectItem>
                    ) : (
                      providers.map((provider) => (
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

          <div className="mt-4 space-y-2">
            <Label>Producto</Label>
            <Select
              value={selectedProductId ? selectedProductId.toString() : ''}
              onValueChange={(value) => setSelectedProductId(Number(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona un producto" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Label className="mt-2">Cantidad</Label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full border px-2 py-1 rounded"
            />

            <button
              type="button"
              onClick={addProduct}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Agregar producto
            </button>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold">Productos agregados:</h3>
            {addedProducts.length === 0 && (
              <p className="text-sm text-gray-500">No hay productos aún.</p>
            )}
            <ul className="space-y-2 mt-2">
              {addedProducts.map((item, index) => {
                const prod = products.find((p) => p.id === item.productId)
                return (
                  <li
                    key={index}
                    className="flex justify-between items-center border p-2 rounded"
                  >
                    <span>
                      {prod?.description ?? 'Producto desconocido'} (x
                      {item.quantity})
                    </span>
                    <Button
                      type="button"
                      onClick={() => {
                        const updated = addedProducts.filter(
                          (_, i) => i !== index
                        )
                        setValue('details', updated)
                      }}
                      className="text-red-500 hover:underline"
                    >
                      <X className="text-white h-3 w-3 rounded-full" />
                    </Button>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="flex flex-row justify-center items-center gap-x-4 pt-4">
            <Button
              type="submit"
              className=" text-white px-4 py-2 rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : order ? (
                'Actualizar'
              ) : (
                'Crear'
              )}
            </Button>
            {order?.purchaseOrderState === 'PENDIENTE' && (
              <div>
                <Button
                  className="text-white px-4 py-2 rounded"
                  onClick={handleSend}
                >
                  Enviar orden
                </Button>
                <Button
                  className="text-white px-4 py-2 rounded"
                  onClick={handleDelete}
                >
                  Cancelar orden
                </Button>
              </div>
            )}
            {order?.purchaseOrderState === 'ENVIADA' && (
              <Button
                className="text-white px-4 py-2 rounded"
                onClick={handleFinalize}
              >
                Finalizar orden
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
