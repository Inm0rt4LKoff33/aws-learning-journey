import ProductCard from "@/app/components/ProductCard"
import { featuredCards } from "@/app/data/featuredCards"
import Link from "next/link"

export default function FeaturedProducts() {
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
            href="/catalog?featured=true"
            className="text-sm font-semibold transition-colors"
            style={{ color: "var(--crimson-light)" }}
          >
            View all →
          </Link>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredCards.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}