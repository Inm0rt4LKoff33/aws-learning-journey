"use client"

import { Product } from "@/app/types/Product"
import { useCartStore } from "@/app/store/cartStore"
import Link from "next/link"

type Props = {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const addToCart = useCartStore((s) => s.addToCart)

  return (
    <div className="border rounded-xl p-4 shadow hover:shadow-lg transition">
      <Link href={`/product/${product.id}`}>
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-60 object-cover rounded-lg center"
      />
      </Link>
      <h2 className="text-lg font-semibold mt-3">{product.name}</h2>
      <p className="text-sm text-gray-500">{product.set}</p>
      <p className="mt-2 font-bold">${product.price}</p>
      <button
        onClick={() => addToCart(product)}
        className="mt-3 w-full bg-black text-white py-2 rounded-lg"
        >
        Add to Cart
        </button>
    </div>
  )
}
