'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { saleProductSchema, SaleProduct } from '@/schemas/sale.schema'
import { useProducts } from '../hooks/use-product'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from './ui/select'

interface Props {
    isOpen: boolean
    onClose: () => void
    onSave: (products: SaleProduct[]) => void
}

export default function AddSaleModal({ isOpen, onClose, onSave }: Props) {
    const [products, setProducts] = useState<SaleProduct[]>([])
    const { activeProducts, fetchActiveProducts } = useProducts()

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<SaleProduct>({
        resolver: zodResolver(saleProductSchema),
        defaultValues: {
            productId: undefined,
            quantity: 1,
            unitPrice: 0,
        },
    })

    useEffect(() => {
        if (isOpen) fetchActiveProducts()
    }, [isOpen, fetchActiveProducts])

    const onAddProduct = (data: SaleProduct) => {
        setProducts((prev) => [...prev, data])
        reset()
    }

    const onSubmit = () => {
        if (products.length > 0) {
            onSave(products)
            setProducts([])
            onClose()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Agregar Venta</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onAddProduct)} className="space-y-4">
                    <div>
                        <Label>Producto</Label>
                        <Controller
                            name="productId"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    value={field.value ? String(field.value) : ''}
                                    onValueChange={(value) => field.onChange(Number(value))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona un producto" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {activeProducts.map((p) => (
                                            <SelectItem key={p.id} value={String(p.id)}>
                                                {p.code} - {p.description}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.productId && (
                            <p className="text-red-500 text-sm">{errors.productId.message}</p>
                        )}
                    </div>

                    <div>
                        <Label>Cantidad</Label>
                        <Input type="number" {...register('quantity')} />
                        {errors.quantity && (
                            <p className="text-red-500 text-sm">{errors.quantity.message}</p>
                        )}
                    </div>

                    <div>
                        <Label>Precio Unitario</Label>
                        <Input type="number" {...register('unitPrice')} />
                        {errors.unitPrice && (
                            <p className="text-red-500 text-sm">{errors.unitPrice.message}</p>
                        )}
                    </div>

                    <Button type="submit">Agregar Producto</Button>
                </form>

                {products.length > 0 && (
                    <div className="mt-4 space-y-1">
                        <h4 className="font-semibold">Productos agregados:</h4>
                        <ul className="list-disc pl-4">
                            {products.map((p, i) => (
                                <li key={i}>
                                    ID: {p.productId} | Cantidad: {p.quantity} | Precio: ${p.unitPrice}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button onClick={onSubmit} disabled={products.length === 0}>
                        Guardar Venta
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
