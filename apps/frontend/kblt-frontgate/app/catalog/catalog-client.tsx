"use client"

import { Product } from "@/app/types/Product"
import ProductCard from "@/app/components/ProductCard"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useMemo, useEffect } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"

type Props = {
  products: Product[]
}

const CONDITIONS = ["NM", "LP", "MP", "HP"] as const
const RARITIES = ["Common", "Uncommon", "Rare", "Holo Rare", "Ultra Rare"] as const
const GAMES = ["Pokemon", "YuGiOh", "Magic"] as const
const SORT_OPTIONS = [
  { label: "Name A–Z", value: "name-asc" },
  { label: "Name Z–A", value: "name-desc" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
]

export default function CatalogClient({ products }: Props) {
  const router = useRouter()
  const params = useSearchParams()

  const [showFilters, setShowFilters] = useState(false)
  const [search, setSearch] = useState(params.get("q") ?? "")
  const [game, setGame] = useState(params.get("game") ?? "")
  const [rarity, setRarity] = useState(params.get("rarity") ?? "")
  const [condition, setCondition] = useState(params.get("condition") ?? "")
  const [sort, setSort] = useState(params.get("sort") ?? "name-asc")
  const [priceMin, setPriceMin] = useState(params.get("priceMin") ?? "")
  const [priceMax, setPriceMax] = useState(params.get("priceMax") ?? "")

  // Sync state to URL params
  useEffect(() => {
    const newParams = new URLSearchParams()
    if (search) newParams.set("q", search)
    if (game) newParams.set("game", game)
    if (rarity) newParams.set("rarity", rarity)
    if (condition) newParams.set("condition", condition)
    if (sort !== "name-asc") newParams.set("sort", sort)
    if (priceMin) newParams.set("priceMin", priceMin)
    if (priceMax) newParams.set("priceMax", priceMax)
    const qs = newParams.toString()
    router.replace(`/catalog${qs ? `?${qs}` : ""}`, { scroll: false })
  }, [search, game, rarity, condition, sort, priceMin, priceMax])

  const activeFilterCount = [game, rarity, condition, priceMin, priceMax].filter(Boolean).length

  const clearAll = () => {
    setSearch("")
    setGame("")
    setRarity("")
    setCondition("")
    setPriceMin("")
    setPriceMax("")
    setSort("name-asc")
  }

  const filtered = useMemo(() => {
    let result = [...products]

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.set.toLowerCase().includes(q)
      )
    }
    if (game) result = result.filter((p) => p.game === game)
    if (rarity) result = result.filter((p) => p.rarity === rarity)
    if (condition) result = result.filter((p) => p.condition === condition)
    if (priceMin) result = result.filter((p) => p.price >= parseFloat(priceMin))
    if (priceMax) result = result.filter((p) => p.price <= parseFloat(priceMax))

    result.sort((a, b) => {
      switch (sort) {
        case "name-asc": return a.name.localeCompare(b.name)
        case "name-desc": return b.name.localeCompare(a.name)
        case "price-asc": return a.price - b.price
        case "price-desc": return b.price - a.price
        default: return 0
      }
    })

    return result
  }, [products, search, game, rarity, condition, sort, priceMin, priceMax])

  const conditionColors: Record<string, string> = {
    NM: "text-emerald-400",
    LP: "text-yellow-400",
    MP: "text-orange-400",
    HP: "text-red-400",
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-12">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Card Catalog</h1>
          <p className="mt-1 text-slate-400 text-sm">
            {filtered.length} {filtered.length === 1 ? "card" : "cards"} found
          </p>
        </div>

        {/* Search bar + controls row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or set…"
              className="w-full rounded-xl bg-slate-800 border border-slate-700 pl-10 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          <button
            onClick={() => setShowFilters((v) => !v)}
            className="flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-sm font-medium hover:bg-slate-700 transition"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Expandable filter panel */}
        {showFilters && (
          <div className="mb-8 rounded-2xl bg-slate-800/60 border border-slate-700 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* Game */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  Game
                </label>
                <div className="flex flex-wrap gap-2">
                  {GAMES.map((g) => (
                    <button
                      key={g}
                      onClick={() => setGame(game === g ? "" : g)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                        game === g
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : "bg-transparent border-slate-600 text-slate-300 hover:border-indigo-500"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rarity */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  Rarity
                </label>
                <div className="flex flex-wrap gap-2">
                  {RARITIES.map((r) => (
                    <button
                      key={r}
                      onClick={() => setRarity(rarity === r ? "" : r)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                        rarity === r
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : "bg-transparent border-slate-600 text-slate-300 hover:border-indigo-500"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  Condition
                </label>
                <div className="flex flex-wrap gap-2">
                  {CONDITIONS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCondition(condition === c ? "" : c)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                        condition === c
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : "bg-transparent border-slate-600 text-slate-300 hover:border-indigo-500"
                      }`}
                    >
                      <span className={conditionColors[c]}>{c}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  Price Range (USD)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="w-full rounded-lg bg-slate-700 border border-slate-600 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-slate-500">—</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="w-full rounded-lg bg-slate-700 border border-slate-600 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {activeFilterCount > 0 && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearAll}
                  className="text-xs text-slate-400 hover:text-red-400 transition"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Active filter chips */}
        {activeFilterCount > 0 && !showFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {game && <FilterChip label={game} onRemove={() => setGame("")} />}
            {rarity && <FilterChip label={rarity} onRemove={() => setRarity("")} />}
            {condition && <FilterChip label={condition} onRemove={() => setCondition("")} />}
            {(priceMin || priceMax) && (
              <FilterChip
                label={`$${priceMin || "0"} – $${priceMax || "∞"}`}
                onRemove={() => { setPriceMin(""); setPriceMax("") }}
              />
            )}
          </div>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-500">
            <Search className="w-12 h-12 mb-4 opacity-30" />
            <p className="text-lg font-medium">No cards found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
            <button
              onClick={clearAll}
              className="mt-4 text-sm text-indigo-400 hover:text-indigo-300"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-indigo-600/20 border border-indigo-500/30 px-3 py-1 text-xs font-medium text-indigo-300">
      {label}
      <button onClick={onRemove} className="hover:text-white transition">
        <X className="w-3 h-3" />
      </button>
    </span>
  )
}