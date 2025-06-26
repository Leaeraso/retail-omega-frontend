'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../components/ui/table'
import { Button } from '../../../../components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useOrder } from '../../../../hooks/use-order'
import { OrderState } from '../../../../components/order-state'

export default function OrderDetailPage() {
  const { orders, fetchOrders } = useOrder()
  const router = useRouter()
  const params = useParams()
  const id = Number(params.id)

  useEffect(() => {
    fetchOrders()
  }, [])

  const order = orders.find((o) => o.id === id)

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  if (!order) {
    return <div className="p-4">Orden no encontrada</div>
  }

  return (
    <div className="w-full p-4">
      <div className="flex items-center justify-between mb-4">
        <Button onClick={() => router.push('/dashboard/orders')}>
          <ArrowLeft className="h-4 w-4 text-white" />
        </Button>
        <h1 className="text-3xl font-bold">Orden #{order.id}</h1>
        <div></div>
      </div>

      <div className="mb-4 border border-gray-300 dark:border-gray-700 rounded-xl p-4">
        <p><strong>Proveedor:</strong> {order.providerName}</p>
        <p className="flex items-center gap-2">
          <strong>Estado:</strong>
          <OrderState state={order.purchaseOrderState} />
        </p>
        <p><strong>Fecha creación:</strong> {formatDate(order.createdAt)}</p>
        <p><strong>Fecha envío:</strong> {formatDate(order.sentAt)}</p>
        <p><strong>Fecha recepción:</strong> {formatDate(order.receivedAt)}</p>
        <p><strong>Total:</strong> ${order.total}</p>
      </div>

      <div className="border border-gray-300 dark:border-gray-700 rounded-xl p-4">
        <h2 className="text-2xl font-semibold mb-2">Detalles del pedido</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Detalle</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Precio Unitario</TableHead>
              <TableHead>Subtotal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.details.map((detail) => (
              <TableRow key={detail.id}>
                <TableCell>{detail.id}</TableCell>
                <TableCell>{detail.productDescription}</TableCell>
                <TableCell>{detail.quantity}</TableCell>
                <TableCell>${detail.price}</TableCell>
                <TableCell>${detail.subtotal}</TableCell>
              </TableRow>
            ))}
            {order.details.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500">
                  No hay productos en esta orden
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
