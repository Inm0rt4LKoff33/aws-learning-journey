"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/app/store/authStore"
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react"
import Link from "next/link"

type Tab = "login" | "register"

export default function AuthPage() {
  const [tab, setTab] = useState<Tab>("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { login, register } = useAuthStore()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const result =
      tab === "login"
        ? await login(email, password)
        : await register(name, email, password)

    setLoading(false)

    if (!result.success) {
      setError(result.error ?? "Something went wrong.")
    } else {
      router.push("/")
    }
  }

  const switchTab = (t: Tab) => {
    setTab(t)
    setError("")
    setName("")
    setEmail("")
    setPassword("")
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo / brand */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            KBLT<span className="text-indigo-400">.</span>
          </Link>
          <p className="mt-1 text-sm text-slate-400">
            {tab === "login" ? "Welcome back" : "Create your account"}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-slate-800/60 border border-slate-700 p-8">

          {/* Tabs */}
          <div className="flex rounded-xl bg-slate-900/60 border border-slate-700 p-1 mb-8">
            {(["login", "register"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
                  tab === t
                    ? "bg-indigo-600 text-white shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {t === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Name (register only) */}
            {tab === "register" && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="John Doe"
                  className="w-full rounded-xl bg-slate-900/60 border border-slate-700 px-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-xl bg-slate-900/60 border border-slate-700 px-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
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
                  className="w-full rounded-xl bg-slate-900/60 border border-slate-700 px-4 py-3 pr-11 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2.5 text-sm text-red-400">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3.5 text-sm font-semibold transition"
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

          {/* Demo hint for login */}
          {tab === "login" && (
            <p className="mt-4 text-center text-xs text-slate-500">
              Demo account: <span className="text-slate-400">demo@kblt.com</span> / <span className="text-slate-400">password123</span>
            </p>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-slate-500">
          By continuing you agree to our{" "}
          <span className="text-slate-400 underline cursor-pointer">Terms of Service</span>
        </p>
      </div>
    </main>
  )
}