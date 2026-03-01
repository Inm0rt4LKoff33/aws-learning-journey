import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Product } from "@/app/lib/products.api"

type CartItem = Product & { quantity: number }

type CartState = {
  items: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addToCart: (product) =>
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
        }),

      removeFromCart: (id) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === id)
          if (!existing) return state
          if (existing.quantity === 1) {
            return { items: state.items.filter((i) => i.id !== id) }
          }
          return {
            items: state.items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity - 1 } : i
            ),
          }
        }),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "kblt-cart",
      // Only persist items array, not the action functions
      partialize: (state) => ({ items: state.items }),
    }
  )
)