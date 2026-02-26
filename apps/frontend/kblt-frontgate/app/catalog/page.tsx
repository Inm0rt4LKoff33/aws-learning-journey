import { products } from "@/app/data/products"
import CatalogClient from "./catalog-client"
import { Suspense } from "react"

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export const metadata = {
  title: "Catalog — KBLT",
  description: "Browse rare and authentic trading cards across Pokémon, Yu-Gi-Oh!, and Magic: The Gathering.",
}

export default async function CatalogPage({ searchParams }: Props) {
  // Next.js 15+: searchParams is a Promise
  const params = await searchParams

  // Pre-filter by game server-side so CatalogClient receives a smaller dataset
  // when navigating from the Categories section (e.g. /catalog?game=Pokemon)
  let filtered = [...products]
  if (params.game) {
    filtered = filtered.filter((p) => p.game === params.game)
  }

  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: "var(--bg-base)" }}
        >
          <div
            className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: "var(--crimson)" }}
          />
        </div>
      }
    >
      <CatalogClient products={filtered} />
    </Suspense>
  )
}