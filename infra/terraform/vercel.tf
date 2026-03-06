# ── Vercel ─────────────────────────────────────────────────────────────────────
# Manages the KBLT frontend project on Vercel including environment variables.
# Changes to env vars here are applied with `terraform apply` instead of
# manually updating them in the Vercel dashboard.

# ── Project ────────────────────────────────────────────────────────────────────
# References the existing Vercel project rather than creating a new one.
# The project was originally connected to GitHub via the Vercel dashboard.
data "vercel_project" "kblt_frontend" {
  name = "koboldtavern"
}

# ── Environment variables ──────────────────────────────────────────────────────
# Manages all env vars as code. Any manual changes in the Vercel dashboard
# will be overwritten on the next `terraform apply`.

# API URL for browser requests (prefixed with NEXT_PUBLIC_)
resource "vercel_env" "next_public_api_url" {
  project_id = data.vercel_project.kblt_frontend.id
  key        = "NEXT_PUBLIC_API_URL"
  value      = var.railway_api_url
  target     = ["production", "preview"]
}

# API URL for server component requests (no NEXT_PUBLIC_ prefix)
resource "vercel_env" "api_url" {
  project_id = data.vercel_project.kblt_frontend.id
  key        = "API_URL"
  value      = var.railway_api_url
  target     = ["production", "preview"]
}
