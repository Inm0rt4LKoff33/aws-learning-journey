"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { ShoppingCart, Search } from "lucide-react"
import { useCartStore } from "@/app/store/cartStore"

export default function Navbar() {
  const cart = useCartStore((s) => s.items)
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState("")

  useEffect(() => {
    setSearch(searchParams.get("search") || "")
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/catalog?search=${search}`)
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-gray-900">
          ModernStore
        </Link>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center bg-gray-100 px-4 py-2 rounded-xl"
        >
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search products..."
            className="bg-transparent outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        {/* Links */}
        <div className="flex items-center gap-6">
          <Link href="/catalog" className="text-gray-700 hover:text-black">
            Shop
          </Link>

          <Link
            href="/cart"
            className="relative flex items-center gap-1 text-gray-700 hover:text-black"
          >
            <ShoppingCart className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-indigo-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cart.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  )
}