import "zustand/middleware"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type User = {
  id: string
  name: string
  email: string
}

type AuthState = {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

// Simulated registered users (in V2 this will hit the .NET API)
const MOCK_USERS: (User & { password: string })[] = [
  { id: "user-1", name: "Demo User", email: "demo@kblt.com", password: "password123" },
]

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email, password) => {
        // Simulate network delay
        await new Promise((r) => setTimeout(r, 600))

        const found = MOCK_USERS.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        )

        if (!found) {
          return { success: false, error: "Invalid email or password." }
        }

        const { password: _, ...user } = found
        set({ user, isAuthenticated: true })
        return { success: true }
      },

      register: async (name, email, password) => {
        await new Promise((r) => setTimeout(r, 600))

        const exists = MOCK_USERS.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        )

        if (exists) {
          return { success: false, error: "An account with this email already exists." }
        }

        const newUser: User & { password: string } = {
          id: `user-${Date.now()}`,
          name,
          email,
          password,
        }

        MOCK_USERS.push(newUser)

        const { password: _, ...user } = newUser
        set({ user, isAuthenticated: true })
        return { success: true }
      },

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "kblt-auth",
      // Only persist user + isAuthenticated, not the action functions
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)