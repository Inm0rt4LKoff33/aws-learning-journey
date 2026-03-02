import { apiClient } from "./apiClient"
import type { Product } from "./products.api"

export type OrderAddress = {
  id:        string
  label:     string
  street:    string
  city:      string
  state:     string
  zip:       string
  country:   string
  isDefault: boolean
}

export type OrderItem = {
  id:          string
  productId:   string
  quantity:    number
  priceAtTime: number
  product:     Product
}

export type Order = {
  id:        string
  status:    "Processing" | "Shipped" | "Delivered"
  subtotal:  number
  createdAt: string
  address:   OrderAddress
  items:     OrderItem[]
}

export const ordersApi = {
  placeOrder:   (addressId: string) => apiClient.post<{ order: Order }>("/orders", { addressId }),
  getOrders:    ()                  => apiClient.get<{ orders: Order[] }>("/orders"),
  getOrderById: (id: string)        => apiClient.get<{ order: Order }>(`/orders/${id}`),
}