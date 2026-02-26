"use client"

import Image from "next/image"
import Link from "next/link"
import { useCartStore } from "@/app/store/cartStore"
import { ShoppingCart, Trash2, ArrowLeft, ArrowRight } from "lucide-react"

const conditionColors: Record<string, string> = {
  NM: "var(--success)",
  LP: "var(--warning)",
  MP: "#fb923c",
  HP: "var(--error)",
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)

export default function CartPage() {
  const { items, removeFromCart, addToCart, clearCart } = useCartStore()

  const subtotal  = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  if (items.length === 0) {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center gap-6"
        style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}
      >
        <div className="flex flex-col items-center gap-3" style={{ color: "var(--text-muted)" }}>
          <ShoppingCart className="w-16 h-16 opacity-20" />
          <p className="text-xl font-semibold">Your cart is empty</p>
          <p className="text-sm">Find something you love in the catalog</p>
        </div>
        <Link href="/catalog" className="btn-crimson rounded-xl px-6 py-3 text-sm font-semibold">
          Browse Catalog
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      <div className="mx-auto max-w-5xl px-6 py-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-3xl font-black"
              style={{ fontFamily: "var(--font-cinzel-decorative)" }}
            >
              Shopping Cart
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
          </div>
          <Link
            href="/catalog"
            className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
            style={{ color: "var(--text-secondary)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Cart items */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-2xl p-4"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)" }}
              >
                {/* Thumbnail */}
                <Link href={`/product/${item.id}`} className="shrink-0">
                  <div
                    className="relative w-20 h-28 rounded-xl overflow-hidden"
                    style={{ background: "var(--parchment-dim)" }}
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-contain p-1 hover:scale-105 transition duration-300"
                    />
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/product/${item.id}`}
                        className="font-semibold line-clamp-1 transition-opacity hover:opacity-70"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{item.set}</p>
                      <p className="text-xs font-semibold mt-1" style={{ color: conditionColors[item.condition] }}>
                        {item.condition}
                      </p>
                    </div>
                    {/* Remove all of this item */}
                    <button
                      onClick={() => { for (let i = 0; i < item.quantity; i++) removeFromCart(item.id) }}
                      className="shrink-0 transition-opacity hover:opacity-70"
                      style={{ color: "var(--text-muted)" }}
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Qty controls + line price */}
                  <div className="flex items-center justify-between mt-4">
                    <div
                      className="flex items-center rounded-lg overflow-hidden"
                      style={{ border: "1px solid var(--bg-border)" }}
                    >
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="px-3 py-1.5 text-sm font-bold transition-colors"
                        style={{ color: "var(--text-primary)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-surface)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >−</button>
                      <span
                        className="px-3 py-1.5 text-sm font-medium min-w-[2rem] text-center"
                        style={{ borderLeft: "1px solid var(--bg-border)", borderRight: "1px solid var(--bg-border)" }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        className="px-3 py-1.5 text-sm font-bold transition-colors"
                        style={{ color: "var(--text-primary)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-surface)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >+</button>
                    </div>
                    <span className="font-black" style={{ color: "var(--gold)" }}>
                      {fmt(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={clearCart}
              className="self-start text-xs mt-2 transition-opacity hover:opacity-60"
              style={{ color: "var(--text-muted)" }}
            >
              Remove all items
            </button>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div
              className="rounded-2xl p-6 sticky top-24"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)" }}
            >
              <h2 className="font-semibold text-lg mb-4">Order Summary</h2>

              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between" style={{ color: "var(--text-secondary)" }}>
                  <span>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
                  <span>{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between" style={{ color: "var(--text-secondary)" }}>
                  <span>Shipping</span>
                  <span style={{ color: "var(--success)" }}>Calculated at checkout</span>
                </div>
                <div className="flex justify-between" style={{ color: "var(--text-secondary)" }}>
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="my-4 border-t" style={{ borderColor: "var(--bg-border)" }} />

              <div className="flex justify-between font-black text-lg mb-6">
                <span>Total</span>
                <span style={{ color: "var(--gold)" }}>{fmt(subtotal)}</span>
              </div>

              <Link
                href="/checkout"
                className="btn-crimson flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-semibold"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>

              <p className="mt-4 text-center text-xs" style={{ color: "var(--text-muted)" }}>
                Secure checkout · SSL encrypted
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}