import { useSaleStore } from "@/stores/sale.store"
import { getSalesPaged, createSale } from "@/services/sale.service"
import { SaleProduct } from "@/schemas/sale.schema"
import { useCallback } from "react"

export function useSale() {
  const sales = useSaleStore((state) => state.sales)
  const setSales = useSaleStore((state) => state.setSales)
  const addSale = useSaleStore((state) => state.addSale)
  const pagination = useSaleStore((state) => state.pagination)
  const setPagination = useSaleStore((state) => state.setPagination)

  const fetchSales = useCallback(
    async (page: number = 0, size: number = 8) => {
      const res = await getSalesPaged(page, size)
      if (res) {
        setSales(res.content)
        setPagination({
          totalPages: res.totalPages,
          totalElements: res.totalElements,
          size: res.size,
          number: res.number,
          first: res.first,
          last: res.last,
          numberOfElements: res.numberOfElements,
        })
      }
    },
    [setSales, setPagination]
  )

  const saveSale = useCallback(
    async (products: SaleProduct[]) => {
      const sale = await createSale({ saleDetail: products })
      if (sale) {
        addSale(sale)
      }
    },
    [addSale]
  )

  return { sales, fetchSales, saveSale, pagination }
}
