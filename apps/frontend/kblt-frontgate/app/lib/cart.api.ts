import { apiClient } from "./apiClient"
import type { Product } from "./products.api"

// ── Types ─────────────────────────────────────────────────────────────────────

export type CartItem = Product & { quantity: number }

export type CartResponse = {
  items:    CartItem[]
  subtotal: number
}

// ── Cart API ──────────────────────────────────────────────────────────────────

export const cartApi = {
  getCart: () =>
    apiClient.get<CartResponse>("/cart"),

  addItem: (productId: string, quantity = 1) =>
    apiClient.post<{ productId: string; quantity: number }>("/cart/items", { productId, quantity }),

  updateItem: (productId: string, quantity: number) =>
    apiClient.patch<{ productId: string; quantity: number }>(`/cart/items/${productId}`, { quantity }),

  removeItem: (productId: string) =>
    apiClient.delete<void>(`/cart/items/${productId}`),

  clearCart: () =>
    apiClient.delete<void>("/cart"),
}