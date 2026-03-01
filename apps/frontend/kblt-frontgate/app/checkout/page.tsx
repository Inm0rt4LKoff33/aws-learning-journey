"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/app/store/cartStore"
import { useAuthStore } from "@/app/store/authStore"
import { addressesApi, AddressPayload, OrderAddress } from "@/app/lib/addresses.api"
import { ordersApi } from "@/app/lib/orders.api"
import { ApiError } from "@/app/lib/apiClient"
import { ArrowLeft, ArrowRight, CheckCircle, Package, Plus, MapPin } from "lucide-react"

type Step = "address" | "review" | "confirmation"

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)

const EMPTY: AddressPayload = { label: "Home", street: "", city: "", state: "", zip: "", country: "US" }

export default function CheckoutPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const { items, clearCart } = useCartStore()

  const [step,           setStep]           = useState<Step>("address")
  const [addresses,      setAddresses]      = useState<OrderAddress[]>([])
  const [selectedId,     setSelectedId]     = useState("")
  const [showNewForm,    setShowNewForm]    = useState(false)
  const [newAddress,     setNewAddress]     = useState<AddressPayload>(EMPTY)
  const [loading,        setLoading]        = useState(false)
  const [addressLoading, setAddressLoading] = useState(true)
  const [orderId,        setOrderId]        = useState("")
  const [error,          setError]          = useState("")

  const subtotal  = items.reduce((s, i) => s + Number(i.price) * i.quantity, 0)
  const itemCount = items.reduce((s, i) => s + i.quantity, 0)

  useEffect(() => { if (!isAuthenticated) router.push("/auth") }, [isAuthenticated, router])

  useEffect(() => {
    if (!isAuthenticated) return
    addressesApi.getAll()
      .then(({ addresses }) => {
        setAddresses(addresses)
        const def = addresses.find((a) => a.isDefault)
        if (def) setSelectedId(def.id)
        if (addresses.length === 0) setShowNewForm(true)
      })
      .catch(() => setShowNewForm(true))
      .finally(() => setAddressLoading(false))
  }, [isAuthenticated])

  const updateNew = (key: keyof AddressPayload, value: string) =>
    setNewAddress((p) => ({ ...p, [key]: value }))

  const handleSaveAddress = async () => {
    setLoading(true)
    try {
      const { address } = await addressesApi.create(newAddress)
      setAddresses((p) => [...p, address])
      setSelectedId(address.id)
      setShowNewForm(false)
      setNewAddress(EMPTY)
      setError("")
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save address.")
    } finally {
      setLoading(false)
    }
  }

  const handlePlaceOrder = async () => {
    if (!selectedId) return
    setLoading(true)
    setError("")
    try {
      const { order } = await ordersApi.placeOrder(selectedId)
      await clearCart()
      setOrderId(order.id)
      setStep("confirmation")
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to place order.")
    } finally {
      setLoading(false)
    }
  }

  const selectedAddress = addresses.find((a) => a.id === selectedId)

  if (items.length === 0 && step !== "confirmation") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
        <p style={{ color: "var(--text-muted)" }}>Your cart is empty.</p>
        <Link href="/catalog" className="text-sm" style={{ color: "var(--crimson-light)" }}>Browse Catalog</Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      <div className="mx-auto max-w-4xl px-6 py-12">

        {/* Step indicator */}
        {step !== "confirmation" && (
          <div className="flex items-center gap-2 mb-10">
            {(["address", "review"] as Step[]).map((s, i) => {
              const isActive    = step === s
              const isCompleted = step === "review" && s === "address"
              return (
                <div key={s} className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold border-2 transition-all"
                    style={{
                      borderColor: isCompleted ? "var(--success)"            : isActive ? "var(--crimson)"  : "var(--bg-border)",
                      background:  isCompleted ? "rgba(74,222,128,0.1)"      : isActive ? "var(--crimson)"  : "transparent",
                      color:       isCompleted ? "var(--success)"            : isActive ? "#fff"             : "var(--text-muted)",
                    }}>
                    {isCompleted ? "✓" : i + 1}
                  </div>
                  <span className="text-sm font-medium capitalize"
                    style={{ color: isActive ? "var(--text-primary)" : "var(--text-muted)" }}>
                    {s === "address" ? "Shipping" : "Review"}
                  </span>
                  {i === 0 && <div className="w-8 h-px mx-1" style={{ background: "var(--bg-border)" }} />}
                </div>
              )
            })}
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className="mb-6 rounded-xl px-4 py-3 text-sm"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", color: "var(--error)" }}>
            {error}
          </div>
        )}

        {/* ── STEP 1: Address ── */}
        {step === "address" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-2xl font-black mb-6" style={{ fontFamily: "var(--font-cinzel-decorative)" }}>
                Shipping Address
              </h1>

              {addressLoading ? (
                <div className="flex items-center gap-2 py-8" style={{ color: "var(--text-muted)" }}>
                  <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                    style={{ borderColor: "var(--crimson)" }} />
                  Loading addresses…
                </div>
              ) : (
                <>
                  {addresses.length > 0 && (
                    <div className="flex flex-col gap-3 mb-6">
                      {addresses.map((addr) => (
                        <button key={addr.id}
                          onClick={() => { setSelectedId(addr.id); setShowNewForm(false) }}
                          className="flex items-start gap-3 rounded-xl p-4 text-left transition-all"
                          style={{
                            background: selectedId === addr.id ? "var(--crimson-muted)" : "var(--bg-elevated)",
                            border: `1px solid ${selectedId === addr.id ? "var(--crimson)" : "var(--bg-border)"}`,
                          }}>
                          <MapPin className="w-4 h-4 mt-0.5 shrink-0"
                            style={{ color: selectedId === addr.id ? "var(--crimson-light)" : "var(--text-muted)" }} />
                          <div>
                            <p className="font-semibold text-sm">{addr.label}</p>
                            <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                              {addr.street}, {addr.city}, {addr.state} {addr.zip}
                            </p>
                          </div>
                          {addr.isDefault && (
                            <span className="ml-auto text-xs px-2 py-0.5 rounded-full"
                              style={{ background: "var(--crimson-muted)", color: "var(--crimson-light)" }}>
                              Default
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {!showNewForm ? (
                    <button onClick={() => setShowNewForm(true)}
                      className="flex items-center gap-2 text-sm mb-6 transition-opacity hover:opacity-70"
                      style={{ color: "var(--crimson-light)" }}>
                      <Plus className="w-4 h-4" /> Add new address
                    </button>
                  ) : (
                    <div className="rounded-xl p-5 mb-6"
                      style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)" }}>
                      <h2 className="text-sm font-semibold mb-4">New Address</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Label"   value={newAddress.label ?? ""}     onChange={(v) => updateNew("label", v)}   placeholder="Home, Office…" />
                        <Field label="Street"  value={newAddress.street}          onChange={(v) => updateNew("street", v)}  placeholder="123 Main St" span2 />
                        <Field label="City"    value={newAddress.city}            onChange={(v) => updateNew("city", v)}    placeholder="San Francisco" />
                        <Field label="State"   value={newAddress.state}           onChange={(v) => updateNew("state", v)}   placeholder="CA" />
                        <Field label="ZIP"     value={newAddress.zip}             onChange={(v) => updateNew("zip", v)}     placeholder="94102" />
                        <Field label="Country" value={newAddress.country ?? "US"} onChange={(v) => updateNew("country", v)} placeholder="US" />
                      </div>
                      <div className="flex gap-3 mt-4">
                        <button onClick={handleSaveAddress}
                          disabled={loading || !newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zip}
                          className="btn-crimson rounded-xl px-5 py-2.5 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed">
                          {loading ? "Saving…" : "Save Address"}
                        </button>
                        {addresses.length > 0 && (
                          <button onClick={() => setShowNewForm(false)}
                            className="text-sm transition-opacity hover:opacity-70"
                            style={{ color: "var(--text-muted)" }}>
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              <button onClick={() => setStep("review")} disabled={!selectedId}
                className="btn-crimson flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed">
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
                <button onClick={() => setStep("address")}
                  className="flex items-center gap-1 text-sm transition-opacity hover:opacity-70"
                  style={{ color: "var(--text-secondary)" }}>
                  <ArrowLeft className="w-4 h-4" /> Edit address
                </button>
              </div>

              {selectedAddress && (
                <div className="rounded-xl p-4 mb-6 text-sm"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)" }}>
                  <p className="font-semibold mb-1">Shipping to — {selectedAddress.label}</p>
                  <p style={{ color: "var(--text-secondary)" }}>
                    {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zip}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-3 mb-8">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 rounded-xl p-3"
                    style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)" }}>
                    <div className="relative w-12 h-16 rounded-lg overflow-hidden shrink-0"
                      style={{ background: "var(--bg-surface)" }}>
                      <Image src={item.imageUrl} alt={item.name} fill className="object-contain p-1" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {item.set} · {item.condition} · Qty {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-black" style={{ color: "var(--gold)" }}>
                      {fmt(Number(item.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <button onClick={handlePlaceOrder} disabled={loading}
                className="btn-crimson flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Placing Order…
                  </span>
                ) : <>Place Order · {fmt(subtotal)}</>}
              </button>
            </div>
            <SummaryPanel items={items} subtotal={subtotal} itemCount={itemCount} />
          </div>
        )}

        {/* ── STEP 3: Confirmation ── */}
        {step === "confirmation" && (
          <div className="flex flex-col items-center text-center py-12">
            <div className="flex h-20 w-20 items-center justify-center rounded-full mb-6"
              style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.3)" }}>
              <CheckCircle className="w-10 h-10" style={{ color: "var(--success)" }} />
            </div>
            <h1 className="text-3xl font-black mb-2" style={{ fontFamily: "var(--font-cinzel-decorative)" }}>
              Order Placed!
            </h1>
            <p className="mb-1" style={{ color: "var(--text-secondary)" }}>Thank you for your order.</p>
            <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
              Order ID: <span className="font-mono" style={{ color: "var(--text-primary)" }}>{orderId}</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/profile" className="btn-crimson flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold">
                <Package className="w-4 h-4" /> View Order History
              </Link>
              <Link href="/catalog"
                className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium border transition"
                style={{ borderColor: "var(--bg-border)", color: "var(--text-secondary)", background: "var(--bg-elevated)" }}>
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

function Field({ label, value, onChange, placeholder, span2 = false }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; span2?: boolean
}) {
  return (
    <div className={span2 ? "sm:col-span-2" : ""}>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>
        {label}
      </label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)", color: "var(--text-primary)" }} />
    </div>
  )
}

function SummaryPanel({ items, subtotal, itemCount }: {
  items: Array<{ id: string; name: string; price: number; quantity: number }>
  subtotal: number; itemCount: number
}) {
  return (
    <div className="rounded-2xl p-5 self-start sticky top-24 text-sm"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)" }}>
      <h2 className="font-semibold mb-4">
        Order Summary <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>({itemCount} items)</span>
      </h2>
      <div className="flex flex-col gap-2 mb-4 max-h-48 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between gap-4" style={{ color: "var(--text-secondary)" }}>
            <span className="truncate">{item.name} ×{item.quantity}</span>
            <span className="shrink-0 font-medium">{fmt(Number(item.price) * item.quantity)}</span>
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