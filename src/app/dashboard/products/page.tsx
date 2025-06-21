import { ProductTable } from '@/components/product-table'

export default function Products() {
  return (
    <div>
      <h2 className="text-3xl font-bold w-full flex justify-center items-center mt-7">
        {' '}
        Productos
      </h2>
      <div>
        <ProductTable />
      </div>
    </div>
  )
}
