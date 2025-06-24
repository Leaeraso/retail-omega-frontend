'use client'

import React from 'react'
import { SaleDetailsTypes } from '@/types/sales.types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from './ui/table'

interface SaleDetailModalProps {
    show: boolean
    onHide: () => void
    saleDetail?: SaleDetailsTypes[]
}

const SaleDetailModal: React.FC<SaleDetailModalProps> = ({ show, onHide, saleDetail }) => {
    if (!saleDetail) return null

    return (
        <Dialog open={show} onOpenChange={(open) => !open && onHide()}>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Detalle de Venta</DialogTitle>
                </DialogHeader>
                <div className="p-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Numero Item</TableHead>
                                <TableHead>Precio Unitario</TableHead>
                                <TableHead>Cantidad</TableHead>
                                <TableHead>Subtotal</TableHead>
                                <TableHead>Codigo Producto</TableHead>
                                <TableHead>Descripcion Producto</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {saleDetail.map((detail) => (
                                <TableRow key={detail.id}>
                                    <TableCell>{detail.id}</TableCell>
                                    <TableCell>{detail.unitPrice}</TableCell>
                                    <TableCell>{detail.quantity}</TableCell>
                                    <TableCell>{detail.subtotal}</TableCell>
                                    <TableCell>{detail.productCode}</TableCell>
                                    <TableCell>{detail.productDescription}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={5} className="text-right font-semibold">
                                    Total:
                                </TableCell>
                                <TableCell className="font-bold text-green-500">
                                    ${saleDetail.reduce((acc, item) => acc + item.subtotal, 0).toLocaleString('es-AR')}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
                <div className="flex justify-end mt-4">
                    <Button onClick={onHide} variant="outline">Cerrar</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default SaleDetailModal
