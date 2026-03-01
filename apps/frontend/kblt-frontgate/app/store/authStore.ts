"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { authApi } from "@/app/lib/auth.api"
import { tokenManager, ApiError } from "@/app/lib/apiClient"

export type User = {
  id:    string
  name:  string
  email: string
}

type AuthState = {
  user:            User | null
  token:           string | null
  isAuthenticated: boolean
  login:    (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout:   () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user:            null,
      token:           null,
      isAuthenticated: false,

      // ── Login ───────────────────────────────────────────────────────────────
      login: async (email, password) => {
        try {
          const { token, user } = await authApi.login(email, password)
          tokenManager.set(token)
          set({ user, token, isAuthenticated: true })
          return { success: true }
        } catch (err) {
          const message = err instanceof ApiError
            ? err.message
            : "Something went wrong. Please try again."
          return { success: false, error: message }
        }
      },

      // ── Register ────────────────────────────────────────────────────────────
      register: async (name, email, password) => {
        try {
          const { token, user } = await authApi.register(name, email, password)
          tokenManager.set(token)
          set({ user, token, isAuthenticated: true })
          return { success: true }
        } catch (err) {
          const message = err instanceof ApiError
            ? err.message
            : "Something went wrong. Please try again."
          return { success: false, error: message }
        }
      },

      // ── Logout ──────────────────────────────────────────────────────────────
      logout: async () => {
        try {
          // Tell the API to blacklist the token in Redis
          await authApi.logout()
        } catch {
          // Logout should always succeed on the client side
          // even if the API call fails (e.g. token already expired)
        } finally {
          tokenManager.clear()
          set({ user: null, token: null, isAuthenticated: false })
        }
      },
    }),
    {
      name: "kblt-auth",
      partialize: (state) => ({
        user:            state.user,
        token:           state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      // Rehydrate the in-memory token manager when the store loads from localStorage
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          tokenManager.set(state.token)
        }
      },
    }
  )
)