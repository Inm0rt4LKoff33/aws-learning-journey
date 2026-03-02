"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { cartApi, CartItem } from "@/app/lib/cart.api"
import { ApiError } from "@/app/lib/apiClient"
import type { Product } from "@/app/lib/products.api"

type CartState = {
  items:  CartItem[]
  synced: boolean     // true once loaded from API at least once
  error:  string | null

  syncCart:       ()                        => Promise<void>
  addToCart:      (product: Product)        => Promise<void>
  updateQuantity: (id: string, qty: number) => Promise<void>
  removeFromCart: (id: string)              => Promise<void>
  clearCart:      ()                        => Promise<void>
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items:  [],
      synced: false,
      error:  null,

      // ── Sync from API ──────────────────────────────────────────────────────
      // Called on mount when user is authenticated.
      // Replaces local Zustand state with the server's Redis cart.
      syncCart: async () => {
        try {
          const { items } = await cartApi.getCart()
          set({ items, synced: true, error: null })
        } catch (err) {
          if (err instanceof ApiError && err.status === 401) {
            set({ synced: true })
            return
          }
          set({ error: "Failed to load cart." })
        }
      },

      // ── Add to cart ────────────────────────────────────────────────────────
      // Optimistic: updates local state immediately, rolls back on API error.
      addToCart: async (product) => {
        const prev = get().items

        set((state) => {
          const existing = state.items.find((i) => i.id === product.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            }
          }
          return { items: [...state.items, { ...product, quantity: 1 }] }
        })

        try {
          await cartApi.addItem(product.id, 1)
          set({ error: null })
        } catch (err) {
          set({ items: prev, error: err instanceof ApiError ? err.message : "Failed to add item." })
        }
      },

      // ── Update quantity ────────────────────────────────────────────────────
      updateQuantity: async (id, qty) => {
        const prev = get().items

        set((state) => ({
          items: qty === 0
            ? state.items.filter((i) => i.id !== id)
            : state.items.map((i) => i.id === id ? { ...i, quantity: qty } : i),
        }))

        try {
          qty === 0
            ? await cartApi.removeItem(id)
            : await cartApi.updateItem(id, qty)
          set({ error: null })
        } catch (err) {
          set({ items: prev, error: err instanceof ApiError ? err.message : "Failed to update cart." })
        }
      },

      // ── Remove from cart ───────────────────────────────────────────────────
      removeFromCart: async (id) => {
        const prev = get().items
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }))

        try {
          await cartApi.removeItem(id)
          set({ error: null })
        } catch (err) {
          set({ items: prev, error: err instanceof ApiError ? err.message : "Failed to remove item." })
        }
      },

      // ── Clear cart ─────────────────────────────────────────────────────────
      clearCart: async () => {
        const prev = get().items
        set({ items: [] })
        try {
          await cartApi.clearCart()
          set({ error: null })
        } catch {
          set({ items: prev })
        }
      },
    }),
    {
      name: "kblt-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
)