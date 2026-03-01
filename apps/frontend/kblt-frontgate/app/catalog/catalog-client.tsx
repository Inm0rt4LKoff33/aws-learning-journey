"use client"

import { Product } from "@/app/lib/products.api"
import ProductCard from "@/app/components/ProductCard"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useMemo, useEffect } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"

type Props = {
  products: Product[]
}

const CONDITIONS = ["NM", "LP", "MP", "HP"] as const
const RARITIES   = ["Common", "Uncommon", "Rare", "Holo Rare", "Ultra Rare"] as const
const GAMES      = ["Pokemon", "YuGiOh", "Magic"] as const
const SORT_OPTIONS = [
  { label: "Name A–Z",           value: "name-asc"   },
  { label: "Name Z–A",           value: "name-desc"  },
  { label: "Price: Low to High", value: "price-asc"  },
  { label: "Price: High to Low", value: "price-desc" },
]

// Inline style objects — work correctly in both dark and light themes
const conditionColors: Record<string, string> = {
  NM: "var(--success)",
  LP: "var(--warning)",
  MP: "#fb923c",
  HP: "var(--error)",
}

export default function CatalogClient({ products }: Props) {
  const router = useRouter()
  const params = useSearchParams()

  const [showFilters, setShowFilters] = useState(false)
  const [search,    setSearch]    = useState(params.get("q")         ?? "")
  const [game,      setGame]      = useState(params.get("game")      ?? "")
  const [rarity,    setRarity]    = useState(params.get("rarity")    ?? "")
  const [condition, setCondition] = useState(params.get("condition") ?? "")
  const [sort,      setSort]      = useState(params.get("sort")      ?? "name-asc")
  const [priceMin,  setPriceMin]  = useState(params.get("priceMin")  ?? "")
  const [priceMax,  setPriceMax]  = useState(params.get("priceMax")  ?? "")

  // Sync filters to URL so links are shareable
  useEffect(() => {
    const p = new URLSearchParams()
    if (search)              p.set("q",         search)
    if (game)                p.set("game",      game)
    if (rarity)              p.set("rarity",    rarity)
    if (condition)           p.set("condition", condition)
    if (sort !== "name-asc") p.set("sort",      sort)
    if (priceMin)            p.set("priceMin",  priceMin)
    if (priceMax)            p.set("priceMax",  priceMax)
    const qs = p.toString()
    router.replace(`/catalog${qs ? `?${qs}` : ""}`, { scroll: false })
  }, [search, game, rarity, condition, sort, priceMin, priceMax])

  const activeFilterCount = [game, rarity, condition, priceMin, priceMax].filter(Boolean).length

  const clearAll = () => {
    setSearch(""); setGame(""); setRarity("")
    setCondition(""); setPriceMin(""); setPriceMax("")
    setSort("name-asc")
  }

  const filtered = useMemo(() => {
    let r = [...products]
    if (search.trim()) {
      const q = search.toLowerCase()
      r = r.filter((p) => p.name.toLowerCase().includes(q) || p.set.toLowerCase().includes(q))
    }
    if (game)      r = r.filter((p) => p.game      === game)
    if (rarity)    r = r.filter((p) => p.rarity    === rarity)
    if (condition) r = r.filter((p) => p.condition === condition)
    if (priceMin)  r = r.filter((p) => p.price >= parseFloat(priceMin))
    if (priceMax)  r = r.filter((p) => p.price <= parseFloat(priceMax))
    r.sort((a, b) => {
      switch (sort) {
        case "name-asc":   return a.name.localeCompare(b.name)
        case "name-desc":  return b.name.localeCompare(a.name)
        case "price-asc":  return a.price - b.price
        case "price-desc": return b.price - a.price
        default: return 0
      }
    })
    return r
  }, [products, search, game, rarity, condition, sort, priceMin, priceMax])

  // Shared input style
  const inputStyle = {
    background:  "var(--bg-elevated)",
    border:      "1px solid var(--bg-border)",
    color:       "var(--text-primary)",
  }

  return (
    <main className="min-h-screen" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      <div className="mx-auto max-w-7xl px-6 py-12">

        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-4xl font-black tracking-tight"
            style={{ fontFamily: "var(--font-cinzel-decorative)" }}
          >
            Card Catalog
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            {filtered.length} {filtered.length === 1 ? "card" : "cards"} found
          </p>
        </div>

        {/* Search + sort + filter toggle */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">

          {/* Search */}
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or set…"
              className="w-full rounded-xl pl-10 pr-10 py-3 text-sm outline-none"
              style={inputStyle}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
                style={{ color: "var(--text-muted)" }}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl px-4 py-3 text-sm outline-none"
            style={inputStyle}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-colors"
            style={{
              background:  showFilters ? "var(--crimson-muted)" : "var(--bg-elevated)",
              border:      `1px solid ${showFilters ? "var(--crimson)" : "var(--bg-border)"}`,
              color:       showFilters ? "var(--crimson-light)" : "var(--text-primary)",
            }}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span
                className="ml-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ background: "var(--crimson)" }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div
            className="mb-8 rounded-2xl p-6"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)" }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* Game */}
              <FilterGroup label="Game">
                {GAMES.map((g) => (
                  <FilterPill
                    key={g} label={g}
                    active={game === g}
                    onClick={() => setGame(game === g ? "" : g)}
                  />
                ))}
              </FilterGroup>

              {/* Rarity */}
              <FilterGroup label="Rarity">
                {RARITIES.map((r) => (
                  <FilterPill
                    key={r} label={r}
                    active={rarity === r}
                    onClick={() => setRarity(rarity === r ? "" : r)}
                  />
                ))}
              </FilterGroup>

              {/* Condition */}
              <FilterGroup label="Condition">
                {CONDITIONS.map((c) => (
                  <FilterPill
                    key={c} label={c}
                    active={condition === c}
                    onClick={() => setCondition(condition === c ? "" : c)}
                    accentColor={conditionColors[c]}
                  />
                ))}
              </FilterGroup>

              {/* Price range */}
              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-widest mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  Price Range (USD)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number" placeholder="Min"
                    value={priceMin} onChange={(e) => setPriceMin(e.target.value)}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)", color: "var(--text-primary)" }}
                  />
                  <span style={{ color: "var(--text-muted)" }}>—</span>
                  <input
                    type="number" placeholder="Max"
                    value={priceMax} onChange={(e) => setPriceMax(e.target.value)}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)", color: "var(--text-primary)" }}
                  />
                </div>
              </div>
            </div>

            {activeFilterCount > 0 && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearAll}
                  className="text-xs transition-opacity hover:opacity-60"
                  style={{ color: "var(--text-muted)" }}
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Active filter chips — shown when panel is collapsed */}
        {activeFilterCount > 0 && !showFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {game      && <FilterChip label={game}      onRemove={() => setGame("")} />}
            {rarity    && <FilterChip label={rarity}    onRemove={() => setRarity("")} />}
            {condition && <FilterChip label={condition} onRemove={() => setCondition("")} />}
            {(priceMin || priceMax) && (
              <FilterChip
                label={`$${priceMin || "0"} – $${priceMax || "∞"}`}
                onRemove={() => { setPriceMin(""); setPriceMax("") }}
              />
            )}
          </div>
        )}

        {/* Grid / empty state */}
        {filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-24"
            style={{ color: "var(--text-muted)" }}
          >
            <Search className="w-12 h-12 mb-4 opacity-30" />
            <p className="text-lg font-medium">No cards found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
            <button
              onClick={clearAll}
              className="mt-4 text-sm transition-opacity hover:opacity-70"
              style={{ color: "var(--crimson-light)" }}
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </main>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        className="block text-xs font-semibold uppercase tracking-widest mb-2"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </label>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

function FilterPill({ label, active, onClick, accentColor }: {
  label: string
  active: boolean
  onClick: () => void
  accentColor?: string
}) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
      style={{
        background:  active ? "var(--crimson-muted)" : "transparent",
        borderColor: active ? "var(--crimson)"       : "var(--bg-border)",
        color:       active ? "var(--crimson-light)"  : accentColor ?? "var(--text-secondary)",
      }}
    >
      {label}
    </button>
  )
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span
      className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border"
      style={{
        background:  "var(--crimson-glow)",
        borderColor: "var(--crimson-muted)",
        color:       "var(--crimson-light)",
      }}
    >
      {label}
      <button
        onClick={onRemove}
        className="transition-opacity hover:opacity-60"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  )
}