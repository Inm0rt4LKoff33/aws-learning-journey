"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/app/components/ThemeProvider"

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="relative flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200"
      style={{
        background: "var(--bg-elevated)",
        borderColor: "var(--bg-border)",
        color: "var(--text-secondary)",
      }}
      title={theme === "dark" ? "Switch to parchment mode" : "Switch to tavern mode"}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 transition-transform duration-300" style={{ color: "var(--gold)" }} />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-300" style={{ color: "var(--crimson)" }} />
      )}
    </button>
  )
}