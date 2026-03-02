"use client"

import Link from "next/link"
import Image from "next/image"
import { useAuthStore } from "@/app/store/authStore"
import { ordersApi, Order } from "@/app/lib/orders.api"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Package, LogOut, ShoppingBag, User } from "lucide-react"

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)

const statusStyle: Record<string, { color: string; bg: string; border: string }> = {
  Processing: { color: "var(--warning)", bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.3)"  },
  Shipped:    { color: "#60a5fa",        bg: "rgba(96,165,250,0.08)",  border: "rgba(96,165,250,0.3)"  },
  Delivered:  { color: "var(--success)", bg: "rgba(74,222,128,0.08)",  border: "rgba(74,222,128,0.3)"  },
}

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const router = useRouter()

  const [orders,  setOrders]  = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState("")

  useEffect(() => {
    if (!isAuthenticated) { router.push("/auth"); return }

    ordersApi.getOrders()
      .then(({ orders }) => setOrders(orders))
      .catch(() => setError("Failed to load orders."))
      .finally(() => setLoading(false))
  }, [isAuthenticated, router])

  if (!user) return null

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <main className="min-h-screen" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      <div className="mx-auto max-w-4xl px-6 py-12">

        {/* Profile header */}
        <div className="flex items-start justify-between mb-10">
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full"
              style={{ background: "var(--crimson-glow)", border: "1px solid var(--crimson-muted)", color: "var(--crimson-light)" }}
            >
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black" style={{ fontFamily: "var(--font-cinzel-decorative)" }}>
                {user.name}
              </h1>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>{user.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm border transition-all"
            style={{ borderColor: "var(--bg-border)", color: "var(--text-muted)", background: "var(--bg-elevated)" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--crimson-dark)"; e.currentTarget.style.color = "var(--crimson-light)" }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--bg-border)";    e.currentTarget.style.color = "var(--text-muted)" }}
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        {/* Order history */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <ShoppingBag className="w-5 h-5" style={{ color: "var(--crimson-light)" }} />
            <h2 className="text-xl font-semibold">Order History</h2>
            {!loading && (
              <span className="ml-1 text-sm" style={{ color: "var(--text-muted)" }}>({orders.length})</span>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center gap-3 py-16" style={{ color: "var(--text-muted)" }}>
              <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: "var(--crimson)" }} />
              Loading orders…
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-xl px-4 py-3 text-sm"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", color: "var(--error)" }}>
              {error}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && orders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16" style={{ color: "var(--text-muted)" }}>
              <Package className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-medium">No orders yet</p>
              <p className="text-sm mt-1">Your order history will appear here</p>
              <Link href="/catalog" className="mt-4 text-sm" style={{ color: "var(--crimson-light)" }}>
                Browse the catalog →
              </Link>
            </div>
          )}

          {/* Orders */}
          {!loading && orders.length > 0 && (
            <div className="flex flex-col gap-4">
              {orders.map((order) => {
                const status = statusStyle[order.status] ?? statusStyle["Processing"]
                return (
                  <div key={order.id} className="rounded-2xl overflow-hidden"
                    style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)" }}>

                    {/* Order header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-b"
                      style={{ background: "var(--bg-surface)", borderColor: "var(--bg-border)" }}>
                      <div>
                        <p className="text-xs font-mono" style={{ color: "var(--text-secondary)" }}>{order.id}</p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric", month: "long", day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-semibold px-3 py-1 rounded-full border"
                          style={{ color: status.color, background: status.bg, borderColor: status.border }}>
                          {order.status}
                        </span>
                        <span className="font-black" style={{ color: "var(--gold)" }}>
                          {fmt(Number(order.subtotal))}
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="px-5 py-4 flex flex-col gap-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="relative w-10 h-14 rounded-lg overflow-hidden shrink-0"
                            style={{ background: "var(--bg-surface)" }}>
                            <Image
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              fill
                              className="object-contain p-1"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.product.name}</p>
                            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                              {item.product.set} · {item.product.condition} · Qty {item.quantity}
                            </p>
                          </div>
                          {/* priceAtTime — snapshot price at purchase, immune to future price changes */}
                          <span className="text-sm font-semibold">
                            {fmt(Number(item.priceAtTime) * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Address */}
                    <div className="px-5 pb-4">
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        Shipped to: {order.address.label} · {order.address.street},{" "}
                        {order.address.city}, {order.address.state} {order.address.zip}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}