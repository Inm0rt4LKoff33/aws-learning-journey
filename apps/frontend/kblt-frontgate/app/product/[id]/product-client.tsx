"use client"

import { Product } from "@/app/types/Product"
import { useCartStore } from "@/app/store/cartStore"

type Props = {
  product: Product
}

export default function ProductClient({ product }: Props) {
  const addToCart = useCartStore((s) => s.addToCart)

  return (
    <main className="p-10 max-w-4xl mx-auto">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-96 object-cover rounded-xl"
      />

      <h1 className="text-3xl font-bold mt-6">{product.name}</h1>
      <p className="text-gray-500">{product.set}</p>
      <p className="text-xl font-semibold mt-4">${product.price}</p>

      <button
        onClick={() => addToCart(product)}
        className="mt-6 bg-black text-white px-6 py-3 rounded-lg"
      >
        Add to Cart
      </button>
    </main>
  )
}
