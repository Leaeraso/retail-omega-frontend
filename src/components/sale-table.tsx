'use client'

import { useEffect, useState } from 'react'
import { useSale } from '@/hooks/use-sale'
import { Button } from './ui/button'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from './ui/table'
import { ClipboardPlus, Eye, EyeClosed } from 'lucide-react'
import SaleDetailModal from './sale-detail-modal'
import { SaleDetailsTypes } from '@/types/sales.types'
import AddSaleModal from './add-sale-modal'

export function SaleTable() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedDetail, setSelectedDetail] = useState<SaleDetailsTypes[]>([])
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const { sales, fetchSales, saveSale, pagination } = useSale()

  useEffect(() => {
        fetchSales(0, 8)
    }, [fetchSales, refreshTrigger])

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const handleViewDetails = (details: SaleDetailsTypes[]) => {
    setSelectedDetail(details)
    setModalOpen(true)
  }

  return (
    <main>
      <div className="flex flex-row justify-end items-center gap-x-2 mx-2 my-4">
        <Button onClick={openModal}>
          <ClipboardPlus className="h-4 w-4 text-white" />
        </Button>
      </div>

      <AddSaleModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={async (products) => {
            await saveSale(products)
            setRefreshTrigger((prev) => prev + 1) // 🔁 Forzamos refetch
        }}
      />

      <div className="p-4 relative max-w mx-auto min-h-[600px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Fecha de venta</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>{sale.id}</TableCell>
                <TableCell>
                  {new Intl.DateTimeFormat('es-AR', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  }).format(new Date(sale.date))}
                </TableCell>
                <TableCell>${sale.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Button
                    className="group p-2"
                    onClick={() => handleViewDetails(sale.saleDetailResponses)}
                  >
                    <EyeClosed className="h-4 w-4 text-white group-hover:hidden" />
                    <Eye className="h-4 w-4 text-white hidden group-hover:inline" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {pagination && (
            <div
            className="flex gap-3 items-center bg-muted rounded-md px-4 py-2 absolute bottom-0 left-1/2 transform -translate-x-1/2 shadow-md"
            style={{ backgroundColor: 'var(--background)' }} // asegúrate de que el color sea el de tu theme
            >
            <Button
                variant="destructive"
                className="px-4 py-2"
                onClick={() => fetchSales(pagination.number - 1)}
                disabled={pagination.first}
            >
                ← Anterior
            </Button>

            <Button
                variant="destructive"
                className="px-4 py-2 cursor-default select-none"
                onClick={(e) => e.preventDefault()}
            >
                Página {pagination.number + 1} de {pagination.totalPages}
            </Button>

            <Button
                variant="destructive"
                className="px-4 py-2"
                onClick={() => fetchSales(pagination.number + 1)}
                disabled={pagination.last}
            >
                Siguiente →
            </Button>
            </div>
        )}
        </div>

      <SaleDetailModal
        show={modalOpen}
        onHide={() => setModalOpen(false)}
        saleDetail={selectedDetail}
      />
    </main>
  )
}