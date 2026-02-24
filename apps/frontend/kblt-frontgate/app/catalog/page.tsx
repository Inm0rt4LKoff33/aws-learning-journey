import { products } from "@/app/data/products"
import ProductCard from "@/app/components/ProductCard"

export default function CatalogPage({
  searchParams,
}: {
  searchParams: { search?: string }
}) {
  const search = searchParams.search?.toLowerCase() || ""

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search)
  )

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Shop Products</h1>

      {filteredProducts.length === 0 && (
        <p className="text-gray-500">No products found.</p>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}