import CatalogClient from "./catalog-client"
import { productsApi } from "@/app/lib/products.api"
import { Suspense } from "react"

export const dynamic = "force-dynamic"

export const metadata = {
  title:       "Catalog — KBLT",
  description: "Browse rare and authentic trading cards across Pokémon, Yu-Gi-Oh!, and Magic: The Gathering.",
}

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function CatalogPage({ searchParams }: Props) {
  const params = await searchParams

  let products: Awaited<ReturnType<typeof productsApi.getAll>>["products"] = []

  try {
    const data = await productsApi.getAll({
      game:   params.game,
      search: params.q,
      limit:  100,
    })
    products = data.products
  } catch {
    // API unreachable — CatalogClient renders with empty array
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
      <CatalogClient products={products} />
    </Suspense>
  )
}