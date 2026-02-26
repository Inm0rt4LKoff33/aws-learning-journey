"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useCartStore } from "@/app/store/cartStore"
import { useOrderStore, ShippingInfo } from "@/app/store/orderStore"
import { ArrowLeft, ArrowRight, CheckCircle, Package } from "lucide-react"

type Step = "shipping" | "review" | "confirmation"

const EMPTY_SHIPPING: ShippingInfo = {
  name: "", email: "", address: "", city: "", state: "", zip: "", country: "US",
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)

export default function CheckoutPage() {
  const [step,     setStep]     = useState<Step>("shipping")
  const [shipping, setShipping] = useState<ShippingInfo>(EMPTY_SHIPPING)
  const [loading,  setLoading]  = useState(false)
  const [orderId,  setOrderId]  = useState("")

  const { items, clearCart } = useCartStore()
  const { placeOrder }       = useOrderStore()

  const subtotal  = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const itemCount = items.reduce((s, i) => s + i.quantity, 0)

  const update = (key: keyof ShippingInfo, value: string) =>
    setShipping((prev) => ({ ...prev, [key]: value }))

  const handlePlaceOrder = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    const order = placeOrder(items, shipping)
    clearCart()
    setOrderId(order.id)
    setStep("confirmation")
    setLoading(false)
  }

  if (items.length === 0 && step !== "confirmation") {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}
      >
        <p style={{ color: "var(--text-muted)" }}>Your cart is empty.</p>
        <Link href="/catalog" className="text-sm" style={{ color: "var(--crimson-light)" }}>
          Browse Catalog
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      <div className="mx-auto max-w-4xl px-6 py-12">

        {/* Step indicator */}
        {step !== "confirmation" && (
          <div className="flex items-center gap-2 mb-10">
            {(["shipping", "review"] as Step[]).map((s, i) => {
              const isActive    = step === s
              const isCompleted = step === "review" && s === "shipping"
              return (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold border-2 transition-all"
                    style={{
                      borderColor: isCompleted ? "var(--success)"  : isActive ? "var(--crimson)"    : "var(--bg-border)",
                      background:  isCompleted ? "rgba(74,222,128,0.1)" : isActive ? "var(--crimson)" : "transparent",
                      color:       isCompleted ? "var(--success)"  : isActive ? "#fff"               : "var(--text-muted)",
                    }}
                  >
                    {isCompleted ? "✓" : i + 1}
                  </div>
                  <span
                    className="text-sm font-medium capitalize"
                    style={{ color: isActive ? "var(--text-primary)" : "var(--text-muted)" }}
                  >
                    {s}
                  </span>
                  {i === 0 && <div className="w-8 h-px mx-1" style={{ background: "var(--bg-border)" }} />}
                </div>
              )
            })}
          </div>
        )}

        {/* ── STEP 1: Shipping ── */}
        {step === "shipping" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-2xl font-black mb-6" style={{ fontFamily: "var(--font-cinzel-decorative)" }}>
                Shipping Information
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name"         value={shipping.name}    onChange={(v) => update("name", v)}    placeholder="John Doe" />
                <Field label="Email"             value={shipping.email}   onChange={(v) => update("email", v)}   placeholder="you@example.com" type="email" />
                <Field label="Address"           value={shipping.address} onChange={(v) => update("address", v)} placeholder="123 Main St" span2 />
                <Field label="City"              value={shipping.city}    onChange={(v) => update("city", v)}    placeholder="San Francisco" />
                <Field label="State / Province"  value={shipping.state}   onChange={(v) => update("state", v)}   placeholder="CA" />
                <Field label="ZIP / Postal Code" value={shipping.zip}     onChange={(v) => update("zip", v)}     placeholder="94102" />
                <Field label="Country"           value={shipping.country} onChange={(v) => update("country", v)} placeholder="US" />
              </div>
              <button
                onClick={() => setStep("review")}
                disabled={!shipping.name || !shipping.email || !shipping.address || !shipping.city || !shipping.zip}
                className="btn-crimson mt-8 flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue to Review <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <SummaryPanel items={items} subtotal={subtotal} itemCount={itemCount} />
          </div>
        )}

        {/* ── STEP 2: Review ── */}
        {step === "review" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-black" style={{ fontFamily: "var(--font-cinzel-decorative)" }}>
                  Review Order
                </h1>
                <button
                  onClick={() => setStep("shipping")}
                  className="flex items-center gap-1 text-sm transition-opacity hover:opacity-70"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <ArrowLeft className="w-4 h-4" /> Edit shipping
                </button>
              </div>

              {/* Shipping summary */}
              <div
                className="rounded-xl p-4 mb-6 text-sm"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)" }}
              >
                <p className="font-semibold mb-1">Shipping to</p>
                <p style={{ color: "var(--text-secondary)" }}>{shipping.name} · {shipping.email}</p>
                <p style={{ color: "var(--text-secondary)" }}>
                  {shipping.address}, {shipping.city}, {shipping.state} {shipping.zip}, {shipping.country}
                </p>
              </div>

              {/* Items */}
              <div className="flex flex-col gap-3 mb-8">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-xl p-3"
                    style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)" }}
                  >
                    <div
                      className="relative w-12 h-16 rounded-lg overflow-hidden shrink-0"
                      style={{ background: "var(--parchment-dim)" }}
                    >
                      <Image src={item.imageUrl} alt={item.name} fill className="object-contain p-1" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {item.set} · {item.condition} · Qty {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-black" style={{ color: "var(--gold)" }}>
                      {fmt(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="btn-crimson flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Placing Order…
                  </span>
                ) : (
                  <>Place Order · {fmt(subtotal)}</>
                )}
              </button>

              <p className="mt-3 text-center text-xs" style={{ color: "var(--text-muted)" }}>
                Payment will be collected at a later step (Stripe integration coming in V2)
              </p>
            </div>
            <SummaryPanel items={items} subtotal={subtotal} itemCount={itemCount} />
          </div>
        )}

        {/* ── STEP 3: Confirmation ── */}
        {step === "confirmation" && (
          <div className="flex flex-col items-center text-center py-12">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full mb-6"
              style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.3)" }}
            >
              <CheckCircle className="w-10 h-10" style={{ color: "var(--success)" }} />
            </div>
            <h1 className="text-3xl font-black mb-2" style={{ fontFamily: "var(--font-cinzel-decorative)" }}>
              Order Placed!
            </h1>
            <p className="mb-1" style={{ color: "var(--text-secondary)" }}>Thank you for your order.</p>
            <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
              Order ID:{" "}
              <span className="font-mono" style={{ color: "var(--text-primary)" }}>{orderId}</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/profile" className="btn-crimson flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold">
                <Package className="w-4 h-4" /> View Order History
              </Link>
              <Link
                href="/catalog"
                className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium border transition"
                style={{ borderColor: "var(--bg-border)", color: "var(--text-secondary)", background: "var(--bg-elevated)" }}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Field({ label, value, onChange, placeholder, type = "text", span2 = false }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; type?: string; span2?: boolean
}) {
  return (
    <div className={span2 ? "sm:col-span-2" : ""}>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>
        {label}
      </label>
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} required
        className="w-full rounded-xl px-4 py-3 text-sm outline-none"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)", color: "var(--text-primary)" }}
      />
    </div>
  )
}

function SummaryPanel({ items, subtotal, itemCount }: {
  items: any[]; subtotal: number; itemCount: number
}) {
  return (
    <div
      className="rounded-2xl p-5 self-start sticky top-24 text-sm"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)" }}
    >
      <h2 className="font-semibold mb-4">
        Order Summary{" "}
        <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>({itemCount} items)</span>
      </h2>
      <div className="flex flex-col gap-2 mb-4 max-h-48 overflow-y-auto">
        {items.map((item: any) => (
          <div key={item.id} className="flex justify-between gap-4" style={{ color: "var(--text-secondary)" }}>
            <span className="truncate">{item.name} ×{item.quantity}</span>
            <span className="shrink-0 font-medium">{fmt(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>
      <div className="border-t pt-3 flex justify-between font-black" style={{ borderColor: "var(--bg-border)" }}>
        <span>Total</span>
        <span style={{ color: "var(--gold)" }}>{fmt(subtotal)}</span>
      </div>
    </div>
  )
}