import ProductCard from "@/app/components/ProductCard"
import { products } from "@/app/data/products"
import Link from "next/link"

const featuredProducts = products.slice(0, 6)
const totalProducts = products.length
const averagePrice =
  products.reduce((sum, product) => sum + product.price, 0) / totalProducts

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pb-12 pt-12 md:pt-16">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-8 shadow-2xl shadow-violet-900/30 md:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-100">
            KBLT Frontgate
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-black leading-tight md:text-5xl">
            Rare cards, fast checkout, and a cleaner shopping experience.
          </h1>
          <p className="mt-4 max-w-xl text-indigo-100/90">
            Build your collection with trusted condition grades and transparent
            pricing. Explore the featured cards below and add your favorites to
            cart.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#featured"
              className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50"
            >
              Shop featured cards
            </Link>
            <Link
              href="/cart"
              className="rounded-xl border border-white/60 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              View cart
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
              Cards available
            </p>
            <p className="mt-2 text-2xl font-extrabold">{totalProducts}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
              Avg. listed price
            </p>
            <p className="mt-2 text-2xl font-extrabold">
              ${averagePrice.toFixed(2)}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
              Shipping promise
            </p>
            <p className="mt-2 text-2xl font-extrabold">48-hour dispatch</p>
          </div>
        </div>
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