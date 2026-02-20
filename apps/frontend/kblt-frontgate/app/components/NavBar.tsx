"use client"

import Link from "next/link"
import { useCartStore } from "@/app/store/cartStore"

export default function NavBar() {
  const items = useCartStore((s) => s.items)

  const totalItems = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  return (
    <nav className="w-full border-b bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          TCG Market
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          <Link
            href="/catalog"
            className="hover:text-gray-600 transition"
          >
            Catalog
          </Link>

          <Link
            href="/cart"
            className="relative hover:text-gray-600 transition"
          >
            Cart

            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-black text-white text-xs px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  )
}