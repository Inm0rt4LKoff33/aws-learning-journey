"use client"

import Image from "next/image"
import Link from "next/link"
import { useCartStore } from "@/app/store/cartStore"
import { ShoppingCart, Trash2, ArrowLeft, ArrowRight } from "lucide-react"

const conditionColors: Record<string, string> = {
  NM: "text-emerald-400",
  LP: "text-yellow-400",
  MP: "text-orange-400",
  HP: "text-red-400",
}

export default function CartPage() {
  const { items, removeFromCart, addToCart, clearCart } = useCartStore()

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center gap-6">
        <div className="flex flex-col items-center gap-4 text-slate-500">
          <ShoppingCart className="w-16 h-16 opacity-20" />
          <p className="text-xl font-semibold">Your cart is empty</p>
          <p className="text-sm">Find something you love in the catalog</p>
        </div>
        <Link
          href="/catalog"
          className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-3 text-sm font-semibold transition"
        >
          Browse Catalog
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <p className="text-slate-400 text-sm mt-1">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
          </div>
          <Link
            href="/catalog"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Cart Items */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 bg-slate-800/50 rounded-2xl border border-slate-700 p-4"
              >
                {/* Image */}
                <Link href={`/product/${item.id}`} className="shrink-0">
                  <div className="relative w-20 h-28 rounded-xl overflow-hidden bg-slate-700">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover hover:scale-105 transition duration-300"
                    />
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/product/${item.id}`}
                        className="font-semibold hover:text-indigo-300 transition line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-slate-400 mt-0.5">{item.set}</p>
                      <p className={`text-xs font-medium mt-1 ${conditionColors[item.condition]}`}>
                        {item.condition}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        for (let i = 0; i < item.quantity; i++) removeFromCart(item.id)
                      }}
                      className="text-slate-500 hover:text-red-400 transition shrink-0"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quantity + line price */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-1 rounded-lg border border-slate-600 overflow-hidden">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="px-3 py-1.5 text-slate-300 hover:bg-slate-700 transition text-sm font-bold"
                      >
                        −
                      </button>
                      <span className="px-3 py-1.5 text-sm font-medium min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        className="px-3 py-1.5 text-slate-300 hover:bg-slate-700 transition text-sm font-bold"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-bold text-indigo-300">
                      {fmt(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={clearCart}
              className="self-start text-xs text-slate-500 hover:text-red-400 transition mt-2"
            >
              Remove all items
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-slate-800/50 border border-slate-700 p-6 sticky top-6">
              <h2 className="font-semibold text-lg mb-4">Order Summary</h2>

              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
                  <span>{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Shipping</span>
                  <span className="text-emerald-400">Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="my-4 border-t border-slate-700" />

              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Total</span>
                <span className="text-indigo-300">{fmt(subtotal)}</span>
              </div>

              <Link
                href="/checkout"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-4 text-sm font-semibold transition"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>

              <p className="mt-4 text-center text-xs text-slate-500">
                Secure checkout · SSL encrypted
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}