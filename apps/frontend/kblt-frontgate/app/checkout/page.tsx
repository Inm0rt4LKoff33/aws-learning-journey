"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useCartStore } from "@/app/store/cartStore"
import { useOrderStore, ShippingInfo } from "@/app/store/orderStore"
import { ArrowLeft, ArrowRight, CheckCircle, Package } from "lucide-react"

type Step = "shipping" | "review" | "confirmation"

const EMPTY_SHIPPING: ShippingInfo = {
  name: "",
  email: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  country: "US",
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)

export default function CheckoutPage() {
  const [step, setStep] = useState<Step>("shipping")
  const [shipping, setShipping] = useState<ShippingInfo>(EMPTY_SHIPPING)
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState("")

  const { items, clearCart } = useCartStore()
  const { placeOrder } = useOrderStore()
  const router = useRouter()

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const itemCount = items.reduce((s, i) => s + i.quantity, 0)

  const updateShipping = (key: keyof ShippingInfo, value: string) =>
    setShipping((prev) => ({ ...prev, [key]: value }))

  const handlePlaceOrder = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200)) // simulate API call
    const order = placeOrder(items, shipping)
    clearCart()
    setOrderId(order.id)
    setStep("confirmation")
    setLoading(false)
  }

  // Redirect if cart is empty and not yet confirmed
  if (items.length === 0 && step !== "confirmation") {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center gap-4">
        <p className="text-slate-400">Your cart is empty.</p>
        <Link href="/catalog" className="text-indigo-400 hover:text-indigo-300 text-sm">
          Browse Catalog
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-4xl px-6 py-12">

        {/* Step indicator */}
        {step !== "confirmation" && (
          <div className="flex items-center gap-2 mb-10">
            {(["shipping", "review"] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold border-2 transition ${
                  step === s
                    ? "border-indigo-500 bg-indigo-600 text-white"
                    : step === "review" && s === "shipping"
                    ? "border-emerald-500 bg-emerald-600/20 text-emerald-400"
                    : "border-slate-600 text-slate-500"
                }`}>
                  {step === "review" && s === "shipping" ? "✓" : i + 1}
                </div>
                <span className={`text-sm font-medium capitalize ${step === s ? "text-slate-100" : "text-slate-500"}`}>
                  {s}
                </span>
                {i === 0 && <div className="w-8 h-px bg-slate-700 mx-1" />}
              </div>
            ))}
          </div>
        )}

        {/* STEP 1: Shipping */}
        {step === "shipping" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-2xl font-bold mb-6">Shipping Information</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name" value={shipping.name} onChange={(v) => updateShipping("name", v)} placeholder="John Doe" full />
                <Field label="Email" value={shipping.email} onChange={(v) => updateShipping("email", v)} placeholder="you@example.com" type="email" full />
                <Field label="Address" value={shipping.address} onChange={(v) => updateShipping("address", v)} placeholder="123 Main St" full span2 />
                <Field label="City" value={shipping.city} onChange={(v) => updateShipping("city", v)} placeholder="San Francisco" />
                <Field label="State / Province" value={shipping.state} onChange={(v) => updateShipping("state", v)} placeholder="CA" />
                <Field label="ZIP / Postal Code" value={shipping.zip} onChange={(v) => updateShipping("zip", v)} placeholder="94102" />
                <Field label="Country" value={shipping.country} onChange={(v) => updateShipping("country", v)} placeholder="US" />
              </div>

              <button
                onClick={() => setStep("review")}
                disabled={!shipping.name || !shipping.email || !shipping.address || !shipping.city || !shipping.zip}
                className="mt-8 flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed px-6 py-3.5 text-sm font-semibold transition"
              >
                Continue to Review
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <OrderSummaryPanel items={items} subtotal={subtotal} itemCount={itemCount} />
          </div>
        )}

        {/* STEP 2: Review */}
        {step === "review" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Review Order</h1>
                <button onClick={() => setStep("shipping")} className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200">
                  <ArrowLeft className="w-4 h-4" /> Edit shipping
                </button>
              </div>

              {/* Shipping summary */}
              <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-4 mb-6 text-sm">
                <p className="font-semibold mb-1">Shipping to</p>
                <p className="text-slate-400">{shipping.name} · {shipping.email}</p>
                <p className="text-slate-400">{shipping.address}, {shipping.city}, {shipping.state} {shipping.zip}, {shipping.country}</p>
              </div>

              {/* Items */}
              <div className="flex flex-col gap-3 mb-8">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 rounded-xl bg-slate-800/40 border border-slate-700 p-3">
                    <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-slate-700 shrink-0">
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-slate-400">{item.set} · {item.condition} · Qty {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-indigo-300">{fmt(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-4 text-sm font-semibold transition"
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

              <p className="mt-3 text-center text-xs text-slate-500">
                Payment will be collected at a later step (Stripe integration coming in V2)
              </p>
            </div>

            <OrderSummaryPanel items={items} subtotal={subtotal} itemCount={itemCount} />
          </div>
        )}

        {/* STEP 3: Confirmation */}
        {step === "confirmation" && (
          <div className="flex flex-col items-center text-center py-12">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Order Placed!</h1>
            <p className="text-slate-400 mb-1">Thank you for your order.</p>
            <p className="text-sm text-slate-500 mb-8">
              Order ID: <span className="text-slate-300 font-mono">{orderId}</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-3 text-sm font-semibold transition"
              >
                <Package className="w-4 h-4" />
                View Order History
              </Link>
              <Link
                href="/catalog"
                className="flex items-center gap-2 rounded-xl border border-slate-600 hover:border-indigo-500 px-6 py-3 text-sm font-medium text-slate-300 hover:text-indigo-300 transition"
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

function Field({
  label, value, onChange, placeholder, type = "text", full = false, span2 = false,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  full?: boolean
  span2?: boolean
}) {
  return (
    <div className={span2 ? "sm:col-span-2" : ""}>
      <label className="block text-xs font-semibold text-slate-400 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        className="w-full rounded-xl bg-slate-800/60 border border-slate-700 px-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  )
}

function OrderSummaryPanel({
  items, subtotal, itemCount,
}: {
  items: ReturnType<typeof useCartStore> extends never ? never : any
  subtotal: number
  itemCount: number
}) {
  return (
    <div className="rounded-2xl bg-slate-800/50 border border-slate-700 p-5 self-start sticky top-6 text-sm">
      <h2 className="font-semibold mb-4">
        Order Summary
        <span className="ml-2 text-slate-400 font-normal">({itemCount} items)</span>
      </h2>
      <div className="flex flex-col gap-2 mb-4 max-h-48 overflow-y-auto">
        {items.map((item: any) => (
          <div key={item.id} className="flex justify-between gap-4 text-slate-300">
            <span className="truncate">{item.name} ×{item.quantity}</span>
            <span className="shrink-0 font-medium">{fmt(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-700 pt-3 flex justify-between font-bold">
        <span>Total</span>
        <span className="text-indigo-300">{fmt(subtotal)}</span>
      </div>
    </div>
  )
}