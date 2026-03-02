import ProductCard from "@/app/components/ProductCard"
import { productsApi } from "@/app/lib/products.api"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function FeaturedProducts() {
  let products: Awaited<ReturnType<typeof productsApi.getFeatured>>["products"] = []

  try {
    const data = await productsApi.getFeatured()
    products = data.products
  } catch {
    // API unreachable — render empty section silently
    // The catalog page will still work independently
  }

  return (
    <section className="py-24" style={{ background: "var(--bg-surface)" }}>
      <div className="mx-auto max-w-7xl px-6">

        {/* Section header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <span
              className="text-xs font-semibold uppercase tracking-[0.2em] mb-3 block"
              style={{ color: "var(--gold)", fontFamily: "var(--font-cinzel-decorative)" }}
            >
              Hand Picked
            </span>
            <h2
              className="text-3xl md:text-4xl font-black tracking-tight"
              style={{ color: "var(--text-primary)", fontFamily: "var(--font-cinzel-decorative)" }}
            >
              Featured Cards
            </h2>
          </div>

          <Link
            href="/catalog"
            className="text-sm font-semibold transition-colors"
            style={{ color: "var(--crimson-light)" }}
          >
            View all →
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-[610/835] rounded-2xl animate-pulse"
                style={{ background: "var(--bg-elevated)" }}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  )
}