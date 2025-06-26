import {
  getProducts,
  getActiveProducts,
  deleteProducts,
  getProductsByProvider,
  getProductsBelowSecurityStock,
  getProductsBelowReorderPoint,
} from "@/services/product.service"
import { useProductStore } from "@/stores/product.store"
import { useCallback } from "react"

export function useProducts() {
  const products = useProductStore((state) => state.products)
  const activeProducts = useProductStore((state) => state.activeProducts)
  const filteredProducts = useProductStore((state) => state.filteredProducts)

  const setProducts = useProductStore((state) => state.setProducts)
  const setActiveProducts = useProductStore((state) => state.setActiveProducts)
  const setFilteredProducts = useProductStore(
    (state) => state.setFilteredProducts
  )

  const addProduct = useProductStore((state) => state.addProduct)
  const updateProductState = useProductStore(
    (state) => state.updateProductState
  )

  const fetchProducts = useCallback(async () => {
    const res = await getProducts()
    if (res) {
      setProducts(res)
      setFilteredProducts([]) // limpia filtros activos
    }
  }, [setProducts, setFilteredProducts])

  const fetchActiveProducts = useCallback(async () => {
    const res = await getActiveProducts()
    if (res) {
      setActiveProducts(res)
    }
  }, [setActiveProducts])

  const fetchProductsByProvider = useCallback(
    async (providerId: number) => {
      const res = await getProductsByProvider(providerId)
      setFilteredProducts(Array.isArray(res) ? res : [])
    },
    [setFilteredProducts]
  )

  const fetchProductsBelowSecurityStock = useCallback(async () => {
    const res = await getProductsBelowSecurityStock()
    setFilteredProducts(Array.isArray(res) ? res : [])
  }, [setFilteredProducts])

  const fetchProductsBelowReorderPoint = useCallback(async () => {
    const res = await getProductsBelowReorderPoint()
    setFilteredProducts(Array.isArray(res) ? res : [])
  }, [setFilteredProducts])

  const deleteProductById = useCallback(
    async (id: number) => {
      const res = await deleteProducts(id)
      if (res.success) {
        updateProductState(id, "BAJA")
      }
      return res
    },
    [updateProductState]
  )

  return {
    products,
    activeProducts,
    filteredProducts,
    fetchProducts,
    fetchActiveProducts,
    addProduct,
    deleteProductById,
    fetchProductsByProvider,
    fetchProductsBelowSecurityStock,
    fetchProductsBelowReorderPoint,
  }
}
