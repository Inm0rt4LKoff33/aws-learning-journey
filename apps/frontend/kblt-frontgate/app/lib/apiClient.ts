const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

let _token: string | null = null

export const tokenManager = {
  get: ()              => _token,
  set: (t: string)     => { _token = t },
  clear: ()            => { _token = null },
}

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

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  const token = tokenManager.get()
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