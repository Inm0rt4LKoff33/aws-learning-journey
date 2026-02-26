"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/app/store/authStore"
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react"
import Link from "next/link"

type Tab = "login" | "register"

export default function AuthPage() {
  const [tab,          setTab]          = useState<Tab>("login")
  const [name,         setName]         = useState("")
  const [email,        setEmail]        = useState("")
  const [password,     setPassword]     = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState("")

  const { login, register } = useAuthStore()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    const result = tab === "login"
      ? await login(email, password)
      : await register(name, email, password)
    setLoading(false)
    if (!result.success) setError(result.error ?? "Something went wrong.")
    else router.push("/")
  }

  const switchTab = (t: Tab) => {
    setTab(t); setError("")
    setName(""); setEmail(""); setPassword("")
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}
    >
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="text-2xl font-black tracking-widest"
            style={{ color: "var(--text-primary)", fontFamily: "var(--font-cinzel-decorative)" }}
          >
            KBLT<span style={{ color: "var(--gold)" }}>.</span>
          </Link>
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
            {tab === "login" ? "Welcome back" : "Create your account"}
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)" }}
        >
          {/* Tabs */}
          <div
            className="flex rounded-xl p-1 mb-8"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)" }}
          >
            {(["login", "register"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className="flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all duration-200"
                style={{
                  background: tab === t ? "var(--crimson)" : "transparent",
                  color:      tab === t ? "#fff"           : "var(--text-muted)",
                }}
              >
                {t === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Name — register only */}
            {tab === "register" && (
              <AuthField
                label="Full Name" type="text"
                value={name} onChange={setName} placeholder="John Doe"
              />
            )}

            <AuthField
              label="Email" type="email"
              value={email} onChange={setEmail} placeholder="you@example.com"
            />

            {/* Password with show/hide */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full rounded-xl px-4 py-3 pr-11 text-sm outline-none"
                  style={{
                    background:  "var(--bg-surface)",
                    border:      "1px solid var(--bg-border)",
                    color:       "var(--text-primary)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
                  style={{ color: "var(--text-muted)" }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p
                className="rounded-lg px-4 py-2.5 text-sm"
                style={{
                  background:  "rgba(248,113,113,0.08)",
                  border:      "1px solid rgba(248,113,113,0.3)",
                  color:       "var(--error)",
                }}
              >
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-crimson mt-2 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {tab === "login" ? "Signing in…" : "Creating account…"}
                </span>
              ) : (
                <>
                  {tab === "login" ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  {tab === "login" ? "Sign In" : "Create Account"}
                </>
              )}
            </button>
          </form>

          {/* Demo hint */}
          {tab === "login" && (
            <p className="mt-5 text-center text-xs" style={{ color: "var(--text-muted)" }}>
              Demo:{" "}
              <span style={{ color: "var(--text-secondary)" }}>demo@kblt.com</span>
              {" / "}
              <span style={{ color: "var(--text-secondary)" }}>password123</span>
            </p>
          )}
        </div>

        <p className="mt-4 text-center text-xs" style={{ color: "var(--text-muted)" }}>
          By continuing you agree to our{" "}
          <span className="underline cursor-pointer" style={{ color: "var(--text-secondary)" }}>
            Terms of Service
          </span>
        </p>
      </div>
    </main>
  )
}

// ── Reusable field ────────────────────────────────────────────────────────────
function AuthField({ label, type, value, onChange, placeholder }: {
  label: string
  type: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        placeholder={placeholder}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none"
        style={{
          background: "var(--bg-surface)",
          border:     "1px solid var(--bg-border)",
          color:      "var(--text-primary)",
        }}
      />
    </div>
  )
}