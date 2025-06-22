import { getProducts } from "@/services/product.service"
import { useProductStore } from "@/stores/product.store"
import { useCallback } from "react"

export function useProducts() {
  const products = useProductStore((state) => state.products)
  const setProducts = useProductStore((state) => state.setProducts)
  const addProduct = useProductStore((state) => state.addProduct)

  const fetchProducts = useCallback(async () => {
    const res = await getProducts()
    if (res) {
      setProducts(res)
    }
  }, [setProducts])

  return { products, fetchProducts, addProduct }
}
