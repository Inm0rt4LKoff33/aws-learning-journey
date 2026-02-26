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

// All using inline style objects — no hardcoded Tailwind color strings,
// so every badge works correctly in both dark and light themes.

const conditionInfo: Record<string, {
  label: string
  color: string; bg: string; border: string
  description: string
}> = {
  NM: {
    label: "Near Mint",
    color: "var(--success)", bg: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.3)",
    description: "Card is in perfect or near-perfect condition with minimal to no wear.",
  },
  LP: {
    label: "Lightly Played",
    color: "var(--warning)", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.3)",
    description: "Minor wear visible on edges or corners. Still excellent for play or collection.",
  },
  MP: {
    label: "Moderately Played",
    color: "#fb923c", bg: "rgba(251,146,60,0.08)", border: "rgba(251,146,60,0.3)",
    description: "Noticeable wear on edges, corners, or surface. Good for gameplay.",
  },
  HP: {
    label: "Heavily Played",
    color: "var(--error)", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.3)",
    description: "Significant wear. May have creases, scuffs or stains. Best for gameplay only.",
  },
}

const rarityStyle: Record<string, { color: string; bg: string; border: string }> = {
  "Common":     { color: "var(--text-secondary)", bg: "var(--bg-elevated)",    border: "var(--bg-border)"   },
  "Uncommon":   { color: "#4ade80",               bg: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.3)" },
  "Rare":       { color: "#60a5fa",               bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.3)" },
  "Holo Rare":  { color: "#c084fc",               bg: "rgba(192,132,252,0.08)",border: "rgba(192,132,252,0.3)" },
  "Ultra Rare": { color: "var(--gold-light)",     bg: "var(--gold-glow)",      border: "var(--gold-dark)"   },
}

const gameStyle: Record<string, { color: string; bg: string; border: string }> = {
  Pokemon: { color: "var(--gold-light)",    bg: "var(--gold-glow)",    border: "var(--gold-dark)"    },
  YuGiOh:  { color: "#c084fc",             bg: "rgba(192,132,252,0.08)", border: "rgba(192,132,252,0.3)" },
  Magic:    { color: "var(--crimson-light)",bg: "var(--crimson-glow)", border: "var(--crimson-dark)"  },
}

export default function ProductClient({ product }: Props) {
  const addToCart = useCartStore((s) => s.addToCart)
  const cartItems = useCartStore((s) => s.items)
  const [added, setAdded] = useState(false)

  const inCart    = cartItems.find((i) => i.id === product.id)
  const condition = conditionInfo[product.condition] ?? conditionInfo["NM"]
  const rarity    = rarityStyle[product.rarity]     ?? rarityStyle["Common"]
  const game      = gameStyle[product.game]         ?? gameStyle["Magic"]
  const stockLeft = product.stock

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD",
  }).format(product.price)

  const handleAddToCart = () => {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <main className="min-h-screen" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      <div className="mx-auto max-w-6xl px-6 py-10">

        {/* Back */}
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 text-sm mb-8 transition-opacity hover:opacity-70"
          style={{ color: "var(--text-secondary)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Image */}
          <div className="flex items-start justify-center">
            <div
              className="relative w-full max-w-sm aspect-[610/835] rounded-2xl overflow-hidden shadow-2xl"
              style={{
                background:  "var(--parchment-dim)",
                border:      "1px solid var(--parchment-border)",
                boxShadow:   "0 25px 60px rgba(0,0,0,0.5), 0 0 40px var(--crimson-glow)",
              }}
            >
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-contain p-4"
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-6">

            {/* Game + Rarity badges */}
            <div className="flex flex-wrap gap-2">
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full border"
                style={{ color: game.color, background: game.bg, borderColor: game.border }}
              >
                {product.game}
              </span>
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full border"
                style={{ color: rarity.color, background: rarity.bg, borderColor: rarity.border }}
              >
                {product.rarity}
              </span>
            </div>

            {/* Name + Set */}
            <div>
              <h1
                className="text-4xl font-black tracking-tight"
                style={{ fontFamily: "var(--font-cinzel-decorative)" }}
              >
                {product.name}
              </h1>
              <p className="mt-1" style={{ color: "var(--text-secondary)" }}>{product.set}</p>
            </div>

            {/* Price */}
            <div
              className="text-3xl font-black"
              style={{ color: "var(--gold)", fontFamily: "var(--font-cinzel-decorative)" }}
            >
              {formattedPrice}
            </div>

            {/* Condition */}
            <div
              className="flex items-start gap-3 rounded-xl border p-4"
              style={{ color: condition.color, background: condition.bg, borderColor: condition.border }}
            >
              <Shield className="w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm">{product.condition} — {condition.label}</p>
                <p className="text-xs mt-0.5 opacity-80">{condition.description}</p>
              </div>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              <Package className="w-4 h-4" />
              {stockLeft === 0 ? (
                <span style={{ color: "var(--error)" }} className="font-medium">Out of stock</span>
              ) : stockLeft <= 2 ? (
                <span style={{ color: "var(--warning)" }} className="font-medium">Only {stockLeft} left in stock</span>
              ) : (
                <span>{stockLeft} in stock</span>
              )}
            </div>

            {/* Add to cart */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button
                onClick={handleAddToCart}
                disabled={stockLeft === 0}
                className="btn-crimson flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-4 h-4" />
                {added ? "Added!" : stockLeft === 0 ? "Out of Stock" : "Add to Cart"}
              </button>

              {inCart && (
                <Link
                  href="/cart"
                  className="flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-medium border transition"
                  style={{
                    borderColor: "var(--bg-border)",
                    color:       "var(--text-secondary)",
                    background:  "var(--bg-elevated)",
                  }}
                >
                  View Cart ({inCart.quantity})
                </Link>
              )}
            </div>

            {/* Meta table */}
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--bg-border)" }}>
              {[
                ["Game",      product.game],
                ["Set",       product.set],
                ["Rarity",    product.rarity],
                ["Condition", `${product.condition} — ${condition.label}`],
              ].map(([label, value], i) => (
                <div
                  key={label}
                  className="flex items-center justify-between px-4 py-3 text-sm"
                  style={{
                    background:   i % 2 === 0 ? "var(--bg-elevated)" : "var(--bg-surface)",
                    borderBottom: i < 3 ? "1px solid var(--bg-border)" : "none",
                  }}
                >
                  <span style={{ color: "var(--text-muted)" }}>{label}</span>
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