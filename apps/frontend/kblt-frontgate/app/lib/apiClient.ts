// ── API Client ────────────────────────────────────────────────────────────────
// Central fetch wrapper used by all API modules.
// Handles: base URL, Authorization header, JSON parsing, error normalization.

const BASE_URL =
  typeof window === "undefined"
    ? (process.env.API_URL          ?? "http://localhost:3001") // server components
    : (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001") // browser

// In-memory token — set by authStore on login/register.
// Falls back to localStorage on first request after a page refresh,
// before Zustand's onRehydrateStorage has had a chance to fire.
let _token: string | null = null

function getToken(): string | null {
  if (_token) return _token

  // Fallback: read directly from the persisted Zustand auth store in localStorage.
  // This covers the window between page load and rehydration completing.
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("kblt-auth")
      if (raw) {
        const parsed = JSON.parse(raw)
        const token  = parsed?.state?.token ?? null
        if (token) {
          _token = token // cache it so subsequent calls don't re-parse
          return _token
        }
      }
    } catch {
      // localStorage parse failed — continue without token
    }
  }

  return null
}

export const tokenManager = {
  get:   ()             => _token,
  set:   (t: string)    => { _token = t },
  clear: ()             => { _token = null },
}

// ── Core request function ─────────────────────────────────────────────────────

type RequestOptions = {
  method:  "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  path:    string
  body?:   unknown
  params?: Record<string, string | number | boolean | undefined>
}

export class ApiError extends Error {
  constructor(
    public status:  number,
    public message: string
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function request<T>({ method, path, body, params }: RequestOptions): Promise<T> {
  let url = `${BASE_URL}${path}`

  if (params) {
    const qs = Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join("&")
    if (qs) url += `?${qs}`
  }

  const headers: Record<string, string> = {}

  if (body !== undefined) {
    headers["Content-Type"] = "application/json"
  }

  const token = getToken()
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const res = await fetch(url, {
    method,
    headers,
    ...(body !== undefined && { body: JSON.stringify(body) }),
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const message = data?.error ?? data?.message ?? `Request failed (${res.status})`
    throw new ApiError(res.status, message)
  }

  return data as T
}

export const apiClient = {
  get: <T>(path: string, params?: RequestOptions["params"]) =>
    request<T>({ method: "GET", path, params }),

  post: <T>(path: string, body?: unknown) =>
    request<T>({ method: "POST", path, body }),

  patch: <T>(path: string, body?: unknown) =>
    request<T>({ method: "PATCH", path, body }),

  put: <T>(path: string, body?: unknown) =>
    request<T>({ method: "PUT", path, body }),

  delete: <T>(path: string) =>
    request<T>({ method: "DELETE", path }),
}