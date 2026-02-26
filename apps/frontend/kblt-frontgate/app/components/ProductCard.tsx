"use client"

import Image from "next/image"
import Link from "next/link"
import { useCartStore } from "@/app/store/cartStore"
import { ShoppingCart } from "lucide-react"
import { Product } from "@/app/types/Product"

type Props = {
  product: Product
}

const rarityColors: Record<string, { bg: string; text: string; border: string }> = {
  "Common":     { bg: "#2a2a2a",   text: "#a0a0a0", border: "#444" },
  "Uncommon":   { bg: "#0d2d2a",   text: "#4ade80", border: "#166534" },
  "Rare":       { bg: "#0c1a3a",   text: "#60a5fa", border: "#1e3a5f" },
  "Holo Rare":  { bg: "#1e0a3a",   text: "#c084fc", border: "#4c1d95" },
  "Ultra Rare": { bg: "var(--gold-muted)", text: "var(--gold-light)", border: "var(--gold-dark)" },
}

const conditionColors: Record<string, string> = {
  NM: "#4ade80",
  LP: "#fbbf24",
  MP: "#fb923c",
  HP: "#f87171",
}

export default function ProductCard({ product }: Props) {
  const addToCart = useCartStore((s) => s.addToCart)

  const rarity = rarityColors[product.rarity] ?? rarityColors["Common"]

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.price)

  return (
    <div
      className="group flex flex-col rounded-3xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
      style={{
        background: "var(--bg-elevated)",
        borderColor: "var(--bg-border)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
      }}
    >
      {/* Image — parchment surface */}
      <Link href={`/product/${product.id}`} className="block">
        <div
          className="relative aspect-[610/835] overflow-hidden"
          style={{ background: "var(--parchment-dim)" }}
        >
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-contain p-4 drop-shadow-lg group-hover:scale-105 transition duration-500"
          />

          {/* Rarity badge */}
          <span
            className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full border"
            style={{
              background: rarity.bg,
              color: rarity.text,
              borderColor: rarity.border,
            }}
          >
            {product.rarity}
          </span>

          {/* Condition dot */}
          <span
            className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(0,0,0,0.6)",
              color: conditionColors[product.condition],
              border: `1px solid ${conditionColors[product.condition]}40`,
            }}
          >
            {product.condition}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <Link href={`/product/${product.id}`}>
          <h3
            className="font-semibold text-sm leading-tight mb-1 hover:opacity-80 transition-opacity"
            style={{ color: "var(--text-primary)" }}
          >
            {product.name}
          </h3>
        </Link>

        <p className="text-xs mb-4 truncate" style={{ color: "var(--text-muted)" }}>
          {product.set}
        </p>

        <div className="flex items-center justify-between mt-auto gap-3">
          <span
            className="text-lg font-black"
            style={{ color: "var(--gold)", fontFamily: "var(--font-cinzel-decorative)" }}
          >
            {formattedPrice}
          </span>

          <button
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "var(--crimson)",
              color: "#fff",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--crimson-light)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--crimson)")}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {product.stock === 0 ? "Sold Out" : "Add"}
          </button>
        </div>
      </div>
    </div>
  )
}