"use client"

import Image from "next/image"
import Link from "next/link"
import { Product } from "@/app/types/Product"
import { useCartStore } from "@/app/store/cartStore"
import { ShoppingCart, ArrowLeft, Package, Shield } from "lucide-react"
import { useState } from "react"

type Props = {
  product: Product
}

const conditionInfo: Record<string, { label: string; color: string; description: string }> = {
  NM: {
    label: "Near Mint",
    color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
    description: "Card is in perfect or near-perfect condition with minimal to no wear.",
  },
  LP: {
    label: "Lightly Played",
    color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
    description: "Minor wear visible on edges or corners. Still excellent for play or collection.",
  },
  MP: {
    label: "Moderately Played",
    color: "text-orange-400 bg-orange-400/10 border-orange-400/30",
    description: "Noticeable wear on edges, corners, or surface. Good for gameplay.",
  },
  HP: {
    label: "Heavily Played",
    color: "text-red-400 bg-red-400/10 border-red-400/30",
    description: "Significant wear. May have creases, scuffs or stains. Best for gameplay only.",
  },
}

const rarityColors: Record<string, string> = {
  Common: "text-slate-300 bg-slate-700 border-slate-600",
  Uncommon: "text-teal-300 bg-teal-900/30 border-teal-700",
  Rare: "text-sky-300 bg-sky-900/30 border-sky-700",
  "Holo Rare": "text-violet-300 bg-violet-900/30 border-violet-700",
  "Ultra Rare": "text-amber-300 bg-amber-900/30 border-amber-700",
}

const gameColors: Record<string, string> = {
  Pokemon: "text-yellow-300 bg-yellow-900/20 border-yellow-700/40",
  YuGiOh: "text-purple-300 bg-purple-900/20 border-purple-700/40",
  Magic: "text-rose-300 bg-rose-900/20 border-rose-700/40",
}

export default function ProductClient({ product }: Props) {
  const addToCart = useCartStore((s) => s.addToCart)
  const cartItems = useCartStore((s) => s.items)
  const [added, setAdded] = useState(false)

  const inCart = cartItems.find((i) => i.id === product.id)
  const condition = conditionInfo[product.condition]
  const stockLeft = product.stock

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.price)

  const handleAddToCart = () => {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-10">

        {/* Back link */}
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Image */}
          <div className="flex items-start justify-center">
            <div className="relative w-full max-w-sm aspect-[610/835] rounded-2xl overflow-hidden bg-slate-800/60 shadow-2xl ring-1 ring-slate-700">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-6">

            {/* Game + Rarity badges */}
            <div className="flex flex-wrap gap-2">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${gameColors[product.game] ?? "text-slate-300 bg-slate-700 border-slate-600"}`}>
                {product.game}
              </span>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${rarityColors[product.rarity] ?? "text-slate-300 bg-slate-700 border-slate-600"}`}>
                {product.rarity}
              </span>
            </div>

            {/* Name + Set */}
            <div>
              <h1 className="text-4xl font-bold tracking-tight">{product.name}</h1>
              <p className="mt-1 text-slate-400">{product.set}</p>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-indigo-300">{formattedPrice}</div>

            {/* Condition */}
            <div className={`flex items-start gap-3 rounded-xl border p-4 ${condition.color}`}>
              <Shield className="w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm">{product.condition} — {condition.label}</p>
                <p className="text-xs mt-0.5 opacity-80">{condition.description}</p>
              </div>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 text-sm">
              <Package className="w-4 h-4 text-slate-400" />
              {stockLeft === 0 ? (
                <span className="text-red-400 font-medium">Out of stock</span>
              ) : stockLeft <= 2 ? (
                <span className="text-orange-400 font-medium">Only {stockLeft} left in stock</span>
              ) : (
                <span className="text-slate-400">{stockLeft} in stock</span>
              )}
            </div>

            {/* Add to cart */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button
                onClick={handleAddToCart}
                disabled={stockLeft === 0}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed px-6 py-4 text-sm font-semibold transition"
              >
                <ShoppingCart className="w-4 h-4" />
                {added ? "Added!" : stockLeft === 0 ? "Out of Stock" : "Add to Cart"}
              </button>

              {inCart && (
                <Link
                  href="/cart"
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-600 hover:border-indigo-500 px-6 py-4 text-sm font-medium text-slate-300 hover:text-indigo-300 transition"
                >
                  View Cart ({inCart.quantity})
                </Link>
              )}
            </div>

            {/* Meta table */}
            <div className="mt-4 rounded-xl border border-slate-700 overflow-hidden">
              {[
                ["Game", product.game],
                ["Set", product.set],
                ["Rarity", product.rarity],
                ["Condition", `${product.condition} — ${condition.label}`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between px-4 py-3 border-b border-slate-700 last:border-0 bg-slate-800/40 even:bg-slate-800/20 text-sm"
                >
                  <span className="text-slate-400">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}