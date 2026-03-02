import { apiClient } from "./apiClient"
import type { OrderAddress } from "./orders.api"

export type { OrderAddress }

export type AddressPayload = {
  label?:   string
  street:   string
  city:     string
  state:    string
  zip:      string
  country?: string
}

export const addressesApi = {
  getAll:     ()                                    => apiClient.get<{ addresses: OrderAddress[] }>("/users/me/addresses"),
  create:     (data: AddressPayload)                => apiClient.post<{ address: OrderAddress }>("/users/me/addresses", data),
  update:     (id: string, data: Partial<AddressPayload>) => apiClient.patch<{ address: OrderAddress }>(`/users/me/addresses/${id}`, data),
  remove:     (id: string)                          => apiClient.delete<void>(`/users/me/addresses/${id}`),
  setDefault: (id: string)                          => apiClient.put<{ message: string }>(`/users/me/addresses/${id}/default`),
}