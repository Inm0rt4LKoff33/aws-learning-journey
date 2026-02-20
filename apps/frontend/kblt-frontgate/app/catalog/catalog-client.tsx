"use client"

import { Product } from "@/app/types/Product"
import ProductCard from "@/app/components/ProductCard"
import { useRouter, useSearchParams } from "next/navigation"

type Props = {
  products: Product[]
}

export default function CatalogClient({ products }: Props) {
  const router = useRouter()
  const params = useSearchParams()

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(params.toString())

    if (value) newParams.set(key, value)
    else newParams.delete(key)

    router.push(`/catalog?${newParams.toString()}`)
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">Catalog</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-8 flex-wrap">
        <select
          onChange={(e) => updateFilter("game", e.target.value)}
          className="border p-2 rounded"
          defaultValue=""
        >
          <option value="">All Games</option>
          <option value="Pokemon">Pokemon</option>
          <option value="YuGiOh">YuGiOh</option>
          <option value="Magic">Magic</option>
        </select>

        <select
          onChange={(e) => updateFilter("rarity", e.target.value)}
          className="border p-2 rounded"
          defaultValue=""
        >
          <option value="">All Rarities</option>
          <option value="Common">Common</option>
          <option value="Rare">Rare</option>
          <option value="Ultra Rare">Ultra Rare</option>
        </select>

        <input
          type="text"
          placeholder="Search cards..."
          className="border p-2 rounded"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateFilter("q", (e.target as HTMLInputElement).value)
            }
          }}
        />
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  )
}
