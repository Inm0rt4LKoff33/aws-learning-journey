"use client"

import Link from "next/link"
import Image from "next/image"
import { useAuthStore } from "@/app/store/authStore"
import { useOrderStore } from "@/app/store/orderStore"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Package, LogOut, ShoppingBag, User } from "lucide-react"

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)

const statusColors: Record<string, string> = {
  Processing: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  Shipped: "text-sky-400 bg-sky-400/10 border-sky-400/30",
  Delivered: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
}

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const { orders } = useOrderStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) router.push("/auth")
  }, [isAuthenticated])

  if (!user) return null

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-4xl px-6 py-12">

        {/* Profile header */}
        <div className="flex items-start justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-300">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-slate-400 text-sm">{user.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-slate-700 hover:border-red-500/50 hover:text-red-400 px-4 py-2 text-sm text-slate-400 transition"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Order History */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <ShoppingBag className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-semibold">Order History</h2>
            <span className="ml-1 text-slate-500 text-sm">({orders.length})</span>
          </div>

          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500">
              <Package className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-medium">No orders yet</p>
              <p className="text-sm mt-1">Your order history will appear here</p>
              <Link
                href="/catalog"
                className="mt-4 text-sm text-indigo-400 hover:text-indigo-300"
              >
                Browse the catalog →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl bg-slate-800/50 border border-slate-700 overflow-hidden"
                >
                  {/* Order header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-b border-slate-700 bg-slate-800/60">
                    <div>
                      <p className="text-xs text-slate-400 font-mono">{order.id}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                      <span className="font-bold text-indigo-300">{fmt(order.subtotal)}</span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="px-5 py-4 flex flex-col gap-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="relative w-10 h-14 rounded-lg overflow-hidden bg-slate-700 shrink-0">
                          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-xs text-slate-400">{item.set} · {item.condition} · Qty {item.quantity}</p>
                        </div>
                        <span className="text-sm font-semibold">{fmt(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Shipping info */}
                  <div className="px-5 pb-4">
                    <p className="text-xs text-slate-500">
                      Shipped to: {order.shipping.name} · {order.shipping.address}, {order.shipping.city}, {order.shipping.state} {order.shipping.zip}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}