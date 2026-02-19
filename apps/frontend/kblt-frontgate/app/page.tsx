import ProductCard from "@/app/components/ProductCard"
import { products } from "@/app/data/products"
import Link from "next/link"


export default function Home() {
  return (
    <main className="p-10">
      <Link href="/cart" className="underline">
        Go to Cart
      </Link>


      <h1 className="text-3xl font-bold mb-6">Featured Cards</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  )
}