"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, Suspense } from "react"
import { ShoppingCart, Search, User, LogOut, Menu, X } from "lucide-react"
import { useCartStore } from "@/app/store/cartStore"
import { useAuthStore } from "@/app/store/authStore"
import ThemeToggle from "@/app/components/ThemeToggle"

// ── NavbarContent ─────────────────────────────────────────────────────────────
// Isolated so useSearchParams() sits inside a Suspense boundary.
// Next.js 15 App Router requires this — any component calling useSearchParams()
// outside Suspense will throw at build time.

function NavbarContent() {
  const cartItems = useCartStore((s) => s.items)
  const { user, isAuthenticated, logout } = useAuthStore()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search,     setSearch]     = useState("")
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled,   setScrolled]   = useState(false)

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0)

  // Keep input in sync with URL — handles browser back/forward
  useEffect(() => {
    setSearch(searchParams.get("q") ?? "")
  }, [searchParams])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = search.trim()
    // Fix: empty submit now clears the ?q= param instead of doing nothing
    router.push(q ? `/catalog?q=${encodeURIComponent(q)}` : "/catalog")
    setMobileOpen(false)
  }

  const clearSearch = () => {
    setSearch("")
    router.push("/catalog")
  }

  const handleLogout = () => {
    logout()
    router.push("/")
    setMobileOpen(false)
  }

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background:   "var(--bg-surface)",
        borderBottom: scrolled ? "1px solid var(--bg-border)" : "1px solid transparent",
        boxShadow:    scrolled ? "0 4px 24px rgba(0,0,0,0.3)" : "none",
      }}
    >
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-black tracking-widest shrink-0"
          style={{ color: "var(--gold)", fontFamily: "var(--font-cinzel-decorative)" }}
        >
          KBLT
        </Link>

        {/* Desktop search */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-sm items-center gap-2 rounded-xl border px-4 py-2 transition-colors"
          style={{ background: "var(--bg-elevated)", borderColor: "var(--bg-border)" }}
        >
          <Search className="w-4 h-4 shrink-0" style={{ color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search cards, sets…"
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "var(--text-primary)" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              onClick={clearSearch}
              className="shrink-0 transition-opacity hover:opacity-70"
              style={{ color: "var(--text-muted)" }}
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-5">
          <Link
            href="/catalog"
            className="text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: "var(--text-secondary)" }}
          >
            Catalog
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative" style={{ color: "var(--text-secondary)" }}>
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span
                className="absolute -top-2 -right-2.5 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold"
                style={{ background: "var(--crimson)" }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          <ThemeToggle />

          {/* Auth */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
                style={{ color: "var(--text-secondary)" }}
              >
                <User className="w-4 h-4" />
                <span style={{ color: "var(--gold)" }}>{user.name.split(" ")[0]}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="transition-opacity hover:opacity-70"
                style={{ color: "var(--text-muted)" }}
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link href="/auth" className="btn-crimson rounded-xl px-4 py-2 text-sm font-semibold">
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />
          <button
            style={{ color: "var(--text-secondary)" }}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="md:hidden border-t px-6 py-5 flex flex-col gap-4"
          style={{ background: "var(--bg-elevated)", borderColor: "var(--bg-border)" }}
        >
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2 rounded-xl border px-4 py-2"
            style={{ background: "var(--bg-surface)", borderColor: "var(--bg-border)" }}
          >
            <Search className="w-4 h-4 shrink-0" style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="Search cards…"
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: "var(--text-primary)" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className="shrink-0 transition-opacity hover:opacity-70"
                style={{ color: "var(--text-muted)" }}
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          <Link href="/catalog" className="text-sm font-medium" style={{ color: "var(--text-primary)" }} onClick={() => setMobileOpen(false)}>
            Catalog
          </Link>
          <Link href="/cart" className="text-sm font-medium" style={{ color: "var(--text-primary)" }} onClick={() => setMobileOpen(false)}>
            Cart {cartCount > 0 && `(${cartCount})`}
          </Link>

          {isAuthenticated && user ? (
            <>
              <Link href="/profile" className="text-sm font-medium" style={{ color: "var(--text-primary)" }} onClick={() => setMobileOpen(false)}>
                Profile — <span style={{ color: "var(--gold)" }}>{user.name.split(" ")[0]}</span>
              </Link>
              <button onClick={handleLogout} className="text-sm text-left" style={{ color: "var(--text-muted)" }}>
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/auth" className="btn-crimson rounded-xl px-4 py-2.5 text-sm font-semibold text-center" onClick={() => setMobileOpen(false)}>
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}

// ── Navbar (default export) ───────────────────────────────────────────────────
// Suspense wrapper satisfies Next.js 15's requirement for useSearchParams().
// The fallback is a height-matched skeleton to prevent layout shift.

export default function Navbar() {
  return (
    <Suspense
      fallback={
        <nav
          className="fixed top-0 left-0 right-0 z-50 h-[72px]"
          style={{ background: "var(--bg-surface)" }}
        />
      }
    >
      <NavbarContent />
    </Suspense>
  )
}