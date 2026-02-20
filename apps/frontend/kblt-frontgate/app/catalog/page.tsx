import { products } from "@/app/data/products"
import CatalogClient from "./catalog-client"

type Props = {
  searchParams: Promise<{
    game?: string
    rarity?: string
    q?: string
  }>
}

export default async function CatalogPage({ searchParams }: Props) {
  const { game, rarity, q } = await searchParams

  let filtered = products

  if (game) filtered = filtered.filter((p) => p.game === game)
  if (rarity) filtered = filtered.filter((p) => p.rarity === rarity)
  if (q) {
    const query = q.toLowerCase()
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(query)
    )
  }

  return <CatalogClient products={filtered} />
}
