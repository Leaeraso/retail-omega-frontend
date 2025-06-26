'use client'

import {
  ClipboardPlus,
  Eye,
  EyeClosed,
  Pen,
  Send,
  X,
  CheckCircle,
} from 'lucide-react'
import { Button } from './ui/button'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from './ui/table'
import { useOrder } from '@/hooks/use-order'
import { useEffect, useState } from 'react'
import { OrderState } from './order-state'
import { useRouter } from 'next/navigation'
import { Order } from '@/types/order.types'
import { OrderModal } from './order-modal'

export function OrderTable() {
  const { orders, fetchOrders, addOrder, updateOrder, deleteOrder, sendOrder, finalizeOrder } =
    useOrder()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchOrders()
  }, [])

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingOrder(null)
  }

  const handleEdit = (order: Order) => {
    setEditingOrder(order)
    openModal()
  }

  const handleSend = async (id: number) => {
    const confirm = window.confirm('¿Estás seguro que deseas ENVIAR esta orden de compra?')
    if (!confirm) return

    await sendOrder(id)
    fetchOrders()
  }

  const handleCancel = async (id: number) => {
    const confirm = window.confirm('¿Estás seguro que deseas CANCELAR esta orden de compra?')
    if (!confirm) return

    await deleteOrder(id)
    fetchOrders()
  }

  const handleFinalize = async (id: number) => {
    const confirm = window.confirm('¿Estás seguro que deseas FINALIZAR esta orden de compra?')
    if (!confirm) return

    await finalizeOrder(id)
    fetchOrders()
  }


  return (
    <main>
      <div className="flex flex-row justify-end items-center gap-x-2 mx-2 my-4">
        <Button className="hover:cursor-pointer" onClick={openModal}>
          <ClipboardPlus className="h-4 w-4 text-white" />
        </Button>
      </div>

      <OrderModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onCreate={addOrder}
        onUpdate={updateOrder}
        order={editingOrder}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Fecha creación</TableHead>
            <TableHead>Fecha envío</TableHead>
            <TableHead>Fecha entrega</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Proveedor</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.createdAt}</TableCell>
              <TableCell>{order.sentAt}</TableCell>
              <TableCell>{order.receivedAt}</TableCell>
              <TableCell>{order.total}</TableCell>
              <TableCell>{order.providerName}</TableCell>
              <TableCell>
                <OrderState state={order.purchaseOrderState} />
              </TableCell>
              <TableCell>
                <div className="flex flex-row items-center gap-x-2">
                  {/* Ver detalle */}
                  <Button
                    className="text-white group hover:cursor-pointer p-2"
                    onClick={() => router.push(`/dashboard/orders/${order.id}`)}
                  >
                    <EyeClosed className="h-3 w-3 text-white group-hover:hidden" />
                    <Eye className="h-3 w-3 text-white hidden group-hover:inline" />
                  </Button>

                  {/* Editar */}
                  {order.purchaseOrderState === 'PENDIENTE' && (
                    <Button
                      className="text-white group hover:cursor-pointer p-2"
                      onClick={() => handleEdit(order)}
                    >
                      <Pen className="h-3 w-3 text-white" />
                    </Button>
                  )}

                  {/* Acciones según estado */}
                  {order.purchaseOrderState === 'PENDIENTE' && (
                    <>
                      <Button
                        className="bg-red-500 hover:bg-red-600 p-2"
                        onClick={() => handleCancel(order.id)}
                      >
                        <X className="h-4 w-4 text-white" />
                      </Button>
                      <Button
                        className="bg-blue-500 hover:bg-blue-600 p-2"
                        onClick={() => handleSend(order.id)}
                      >
                        <Send className="h-4 w-4 text-white" />
                      </Button>
                    </>
                  )}

                  {order.purchaseOrderState === 'ENVIADA' && (
                    <Button
                      className="bg-green-600 hover:bg-green-700 p-2"
                      onClick={() => handleFinalize(order.id)}
                    >
                      <CheckCircle className="h-4 w-4 text-white" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  )
}

