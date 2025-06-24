import { getProducts, getActiveProducts } from "@/services/product.service"
import { useProductStore } from "@/stores/product.store"
import { useCallback } from "react"

export function useProducts() {
  const products = useProductStore((state) => state.products)
  const activeProducts = useProductStore((state) => state.activeProducts)
  const setProducts = useProductStore((state) => state.setProducts)
  const setActiveProducts = useProductStore((state) => state.setActiveProducts)
  const addProduct = useProductStore((state) => state.addProduct)

  const fetchProducts = useCallback(async () => {
    const res = await getProducts()
    if (res) {
      setProducts(res)
    }
  }, [setProducts])

  const fetchActiveProducts = useCallback(async () => {
    const res = await getActiveProducts()
    if (res) {
      setActiveProducts(res)
    }
  }, [setActiveProducts])

  return { products, activeProducts, fetchProducts, fetchActiveProducts, addProduct }
}

