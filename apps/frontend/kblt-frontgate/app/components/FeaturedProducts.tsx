import ProductCard from "@/app/components/ProductCard"
import { featuredCards } from "@/app/data/featuredCards"


export default function FeaturedProducts() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Featured Cards
          </h2>

          <a
            href="/catalog?featured=true"
            className="text-indigo-600 font-semibold hover:underline"
          >
            View all →
          </a>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featuredCards.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}