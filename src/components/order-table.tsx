'use client'

import { ClipboardPlus, Eye, EyeClosed, Pen, Trash } from 'lucide-react'
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
  const { orders, fetchOrders, addOrder, updateOrder, deleteOrder } = useOrder()
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
  }

  const handleEdit = (order: Order) => {
    setEditingOrder(order)
    openModal()
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
            <TableHead>Fecha envio</TableHead>
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
              <TableCell>{order.recievedAt}</TableCell>
              <TableCell>{order.total}</TableCell>
              <TableCell>{order.providerName}</TableCell>
              <TableCell>
                <OrderState state={order.purchaseOrderState} />
              </TableCell>
              <TableCell>
                <div className="flex flex-row items-center gap-x-2">
                  <Button
                    className=" text-white group hover:cursor-pointer p-2 "
                    onClick={() =>
                      router.push(`/dashboard/providers/${order.id}`)
                    }
                  >
                    <EyeClosed className="h-3 w-3 text-white group-hover:hidden" />
                    <Eye className="h-3  w-3 text-white hidden group-hover:inline" />
                  </Button>

                  <Button
                    className=" text-white group hover:cursor-pointer p-2"
                    onClick={() => handleEdit(provider)}
                  >
                    <Pen className="h-3 w-3 text-white" />
                  </Button>
                  <Button
                    className="hover:cursor-pointer"
                    onClick={() => handleDeleteProvider(provider.id)}
                  >
                    <Trash className="h-3 w-3 text-white" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  )
}
