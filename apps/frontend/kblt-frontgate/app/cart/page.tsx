"use client"

import { useCartStore } from "@/app/store/cartStore"

export default function CartPage() {
  const { items, removeFromCart, addToCart, clearCart } = useCartStore()

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  if (items.length === 0) {
    return (
      <main className="p-10">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
      </main>
    )
  }

  return (
    <main className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="space-y-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 border rounded-xl p-4 items-center"
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-24 h-24 object-cover rounded-lg"
            />

            <div className="flex-1">
              <h2 className="font-semibold">{item.name}</h2>
              <p className="text-sm text-gray-500">{item.set}</p>

              <div className="flex items-center gap-3 mt-2">
                {/* Quantity controls */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="px-3 py-1 border rounded"
                >
                  −
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() => addToCart(item)}
                  className="px-3 py-1 border rounded"
                >
                  +
                </button>
              </div>
            </div>

            <div className="font-bold">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="mt-10 border-t pt-6 flex justify-between items-center">
        <button
          onClick={clearCart}
          className="text-sm text-red-600"
        >
          Clear cart
        </button>

        <div className="text-right">
          <p className="text-lg font-semibold">
            Total: ${total.toFixed(2)}
          </p>

          <button className="mt-3 bg-black text-white px-6 py-3 rounded-lg">
            Checkout
          </button>
        </div>
      </div>
    </main>
  )
}
