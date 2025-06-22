'use client'

import { useState } from 'react'
import { sales } from './dato-moqueado-sale'
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

export function SaleTable() {
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedDetail, setSelectedDetail] = useState<SaleDetailsTypes[]>([])

    const handleViewDetails = (details: SaleDetailsTypes[]) => {
        setSelectedDetail(details)
        setModalOpen(true)
    }

    return (
        <main>
            <div className="flex flex-row justify-end items-center gap-x-2 mx-2 my-4">
                <Button className="hover:cursor-pointer">
                    <ClipboardPlus className="h-4 w-4 text-white" />
                </Button>
            </div>

            <div className="p-4">
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
                                        timeStyle: 'short'
                                    }).format(new Date(sale.date))}
                                </TableCell>
                                <TableCell>${Number(sale.total.toFixed(2))}</TableCell>
                                <TableCell>
                                    <Button
                                        className="group hover:cursor-pointer p-2"
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
            </div>

            <SaleDetailModal
                show={modalOpen}
                onHide={() => setModalOpen(false)}
                saleDetail={selectedDetail}
            />
        </main>
    )
}