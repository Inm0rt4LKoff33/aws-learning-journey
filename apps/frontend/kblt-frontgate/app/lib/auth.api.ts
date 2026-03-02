import { apiClient } from "./apiClient"
import type { User } from "@/app/store/authStore"

type AuthResponse = {
  token: string
  user:  User
}

export const authApi = {
  register: (name: string, email: string, password: string) =>
    apiClient.post<AuthResponse>("/auth/register", { name, email, password }),

  login: (email: string, password: string) =>
    apiClient.post<AuthResponse>("/auth/login", { email, password }),

  logout: () =>
    apiClient.post<{ message: string }>("/auth/logout"),

  me: () =>
    apiClient.get<{ user: User }>("/users/me"),
}