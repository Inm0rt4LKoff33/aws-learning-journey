"use client"

import Image from "next/image"
import { useCartStore } from "@/app/store/cartStore"
import { ShoppingCart } from "lucide-react"
import { Product } from "@/app/types/Product"

type Props = {
  product : Product
}

export default function ProductCard({ product }: Props) {
  const addToCart = useCartStore((s) => s.addToCart)

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.price)

  return (
    <div className="group bg-white rounded-3xl shadow-md hover:shadow-2xl transition duration-300 overflow-hidden flex flex-col">
      
      {/* Image */}
      <div className="relative aspect-[610/835] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6 rounded-t-3xl">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-obtain drop-shadow-lg group-hover:scale-110 transition duration-500"
        />

        {/* Badge Example */}
        <span className="absolute top-4 left-4 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full">
          Rare
        </span>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {product.name}
        </h3>

        <p className="text-indigo-600 font-bold text-lg mb-6">
          {formattedPrice}
        </p>

        <button
          onClick={() => addToCart(product)}
          className="mt-auto flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl hover:bg-indigo-600 transition"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  )
}