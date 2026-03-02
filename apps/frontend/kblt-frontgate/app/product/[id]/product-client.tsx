"use client"

import Image from "next/image"
import Link from "next/link"
import { useCartStore } from "@/app/store/cartStore"
import { ShoppingCart, ArrowLeft, Package, Shield } from "lucide-react"
import { useState } from "react"
import type { Product } from "@/app/lib/products.api"

type Props = {
  product:        Product
  availableStock: number
  lowStock:       boolean
  outOfStock:     boolean
}

const conditionInfo: Record<string, { label: string; description: string; color: string; bg: string; border: string }> = {
  NM: {
    label:       "Near Mint",
    description: "Card is in perfect or near-perfect condition with minimal to no wear.",
    color:  "var(--success)", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.3)",
  },
  LP: {
    label:       "Lightly Played",
    description: "Minor wear visible on edges or corners. Still excellent for play or collection.",
    color:  "var(--warning)", bg: "rgba(234,179,8,0.08)", border: "rgba(234,179,8,0.3)",
  },
  MP: {
    label:       "Moderately Played",
    description: "Noticeable wear on edges, corners, or surface. Good for gameplay.",
    color:  "#f97316", bg: "rgba(249,115,22,0.08)", border: "rgba(249,115,22,0.3)",
  },
  HP: {
    label:       "Heavily Played",
    description: "Significant wear. May have creases, scuffs or stains. Best for gameplay only.",
    color:  "var(--error)", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.3)",
  },
}

const rarityStyle: Record<string, { color: string; bg: string; border: string }> = {
  "Common":     { color: "var(--text-secondary)", bg: "var(--bg-elevated)",    border: "var(--bg-border)" },
  "Uncommon":   { color: "#2dd4bf",  bg: "rgba(45,212,191,0.08)",  border: "rgba(45,212,191,0.3)" },
  "Rare":       { color: "#60a5fa",  bg: "rgba(96,165,250,0.08)",  border: "rgba(96,165,250,0.3)" },
  "Holo Rare":  { color: "#c084fc",  bg: "rgba(192,132,252,0.08)", border: "rgba(192,132,252,0.3)" },
  "Ultra Rare": { color: "var(--gold)", bg: "var(--gold-glow)",    border: "var(--gold-muted)" },
}

const gameStyle: Record<string, { color: string; bg: string; border: string }> = {
  "Pokemon": { color: "#fde047", bg: "rgba(253,224,71,0.08)",  border: "rgba(253,224,71,0.3)" },
  "YuGiOh":  { color: "#d8b4fe", bg: "rgba(216,180,254,0.08)", border: "rgba(216,180,254,0.3)" },
  "Magic":   { color: "#fda4af", bg: "rgba(253,164,175,0.08)", border: "rgba(253,164,175,0.3)" },
}

export default function ProductClient({ product, availableStock, lowStock, outOfStock }: Props) {
  const addToCart = useCartStore((s) => s.addToCart)
  const cartItems = useCartStore((s) => s.items)
  const [added, setAdded] = useState(false)

  const inCart    = cartItems.find((i) => i.id === product.id)
  const condition = conditionInfo[product.condition]
  const rarity    = rarityStyle[product.rarity] ?? rarityStyle["Common"]
  const game      = gameStyle[product.game]     ?? gameStyle["Magic"]

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD",
  }).format(Number(product.price))

  const handleAddToCart = () => {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <main className="min-h-screen" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      <div className="mx-auto max-w-6xl px-6 py-10">

        {/* Back link */}
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 text-sm transition mb-8"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Image */}
          <div className="flex items-start justify-center">
            <div
              className="relative w-full max-w-sm aspect-[610/835] rounded-2xl overflow-hidden shadow-2xl"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)" }}
            >
              <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
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
              <h1 className="text-4xl font-bold tracking-tight">{product.name}</h1>
              <p className="mt-1" style={{ color: "var(--text-muted)" }}>{product.set}</p>
            </div>

            {/* Price */}
            <div
              className="text-3xl font-bold"
              style={{ color: "var(--gold)", fontFamily: "var(--font-cinzel-decorative)" }}
            >
              {formattedPrice}
            </div>

            {/* Condition */}
            {condition && (
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
            )}

            {/* Stock — real availableStock from API soft reservation */}
            <div className="flex items-center gap-2 text-sm">
              <Package className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
              {outOfStock ? (
                <span style={{ color: "var(--error)" }} className="font-medium">Out of stock</span>
              ) : lowStock ? (
                <span style={{ color: "var(--warning)" }} className="font-medium">
                  ⚠ Only {availableStock} left — someone else may have this in their cart
                </span>
              ) : (
                <span style={{ color: "var(--text-muted)" }}>{availableStock} in stock</span>
              )}
            </div>

            {/* Add to cart */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button
                onClick={handleAddToCart}
                disabled={outOfStock}
                className="btn-crimson flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-4 h-4" />
                {added ? "Added!" : outOfStock ? "Out of Stock" : "Add to Cart"}
              </button>

              {inCart && (
                <Link
                  href="/cart"
                  className="flex items-center justify-center gap-2 rounded-xl border px-6 py-4 text-sm font-medium transition"
                  style={{ borderColor: "var(--bg-border)", color: "var(--text-secondary)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--crimson)"
                    e.currentTarget.style.color = "var(--crimson-light)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--bg-border)"
                    e.currentTarget.style.color = "var(--text-secondary)"
                  }}
                >
                  View Cart ({inCart.quantity})
                </Link>
              )}
            </div>

            {/* Meta table */}
            <div className="mt-4 rounded-xl overflow-hidden" style={{ border: "1px solid var(--bg-border)" }}>
              {[
                ["Game",      product.game],
                ["Set",       product.set],
                ["Rarity",    product.rarity],
                ["Condition", `${product.condition} — ${condition?.label ?? product.condition}`],
              ].map(([label, value], i) => (
                <div
                  key={label}
                  className="flex items-center justify-between px-4 py-3 text-sm"
                  style={{
                    borderBottom: i < 3 ? "1px solid var(--bg-border)" : "none",
                    background:   i % 2 === 0 ? "var(--bg-elevated)" : "var(--bg-surface)",
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