"use client"

import { Product } from "@/app/types/Product"
import { useCartStore } from "@/app/store/cartStore"
import Link from "next/link"

type Props = {
  product: Product
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

export default function ProductCard({ product }: Props) {
  const addToCart = useCartStore((s) => s.addToCart)

  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-lg shadow-black/25 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10">
      <Link href={`/product/${product.id}`} className="block">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-64 w-full object-cover"
        />
      </Link>
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-100">{product.name}</h3>
          <p className="text-lg font-extrabold text-emerald-300">
            {currency.format(product.price)}
          </p>
        </div>

        <p className="text-sm text-slate-400">{product.set}</p>

        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{product.condition}</span>
          <span>{product.rarity}</span>
          <span>Stock: {product.stock}</span>
        </div>

        <button
          onClick={() => addToCart(product)}
          className="mt-2 w-full rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400">
            Add to Cart
          </button>
      </div>
    </article>
  )
}
