import { Product } from "@/app/types/Product"
import { products } from "@/app/data/products"

// Hand-picked by ID — one marquee card per game + the two most iconic Pokemon.
// These are used by RotatingHeroCard (hero carousel) and FeaturedProducts (homepage grid).
// To change the selection, just update the IDs below to match app/data/products.ts.
const FEATURED_IDS = [
  "9",  // Charizard — Base Set Shadowless Holo Rare (Pokemon)
  "6",  // Blastoise — Base Set Shadowless Holo Rare (Pokemon)
  "3",  // Venusaur  — Base Set Shadowless Holo Rare (Pokemon)
  "12", // Blue-Eyes White Dragon — LOB Ultra Rare (YuGiOh)
  "19", // Black Lotus — Beta Edition Ultra Rare (Magic)
]

export const featuredCards: Product[] = FEATURED_IDS
  .map((id) => products.find((p) => p.id === id))
  .filter((p): p is Product => p !== undefined)