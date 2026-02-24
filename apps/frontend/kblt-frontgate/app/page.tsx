import ProductCard from "@/app/components/ProductCard"
import Hero from "@/app/components/Hero"
import { products } from "@/app/data/products"
import Link from "next/link"
import FeaturedProducts from "@/app/components/FeaturedProducts"
import Categories from "@/app/components/Categories"
import TrustSection from "./components/TrustSection"

const featuredProducts = products.slice(0, 6)

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <>
        <Hero />
        <FeaturedProducts />
        <Categories />
        <TrustSection />
      </>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pb-12 pt-12 md:pt-16">
        <section id="featured" className="pt-4">
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold md:text-3xl">Featured cards</h2>
            <Link
              href="/cart"
              className="text-sm font-semibold text-indigo-300 hover:text-indigo-200"
            >
              Checkout now →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}