import { apiClient } from "./apiClient"

// ── Types ─────────────────────────────────────────────────────────────────────
// Mirrors the Prisma Product model returned by the API.
// Replaces the frontend-only Product type from app/types/Product.ts in V2.

export type Product = {
  id:         string
  name:       string
  game:       string
  set:        string
  rarity:     string
  condition:  string
  price:      number
  stock:      number
  imageUrl:   string
  isFeatured?: boolean
  createdAt?:  string
  updatedAt?:  string
}

export type ProductFilters = {
  game?:      string
  rarity?:    string
  condition?: string
  search?:    string
  sort?:      string
  page?:      number
  limit?:     number
}

export type PaginatedProducts = {
  products:   Product[]
  pagination: {
    total:      number
    page:       number
    limit:      number
    totalPages: number
  }
}

export type ProductDetail = {
  product:        Product
  availableStock: number
  lowStock:       boolean
  outOfStock:     boolean
}

// ── Products API ──────────────────────────────────────────────────────────────

export const productsApi = {
  getAll: (filters?: ProductFilters) =>
    apiClient.get<PaginatedProducts>("/products", filters as Record<string, string | number | boolean | undefined>),

  getById: (id: string) =>
    apiClient.get<ProductDetail>(`/products/${id}`),

  getFeatured: () =>
    apiClient.get<{ products: Product[] }>("/products/featured"),
}