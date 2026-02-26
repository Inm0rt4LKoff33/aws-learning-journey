import "zustand/middleware"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Product } from "@/app/types/Product"

export type OrderItem = Product & { quantity: number }

export type Order = {
  id: string
  createdAt: string
  items: OrderItem[]
  subtotal: number
  shipping: ShippingInfo
  status: "Processing" | "Shipped" | "Delivered"
}

export type ShippingInfo = {
  name: string
  email: string
  address: string
  city: string
  state: string
  zip: string
  country: string
}

type OrderState = {
  orders: Order[]
  placeOrder: (items: OrderItem[], shipping: ShippingInfo) => Order
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],

      placeOrder: (items, shipping) => {
        const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
        const order: Order = {
          id: `ORD-${Date.now()}`,
          createdAt: new Date().toISOString(),
          items,
          subtotal,
          shipping,
          status: "Processing",
        }
        set({ orders: [order, ...get().orders] })
        return order
      },
    }),
    { name: "kblt-orders" }
  )
)