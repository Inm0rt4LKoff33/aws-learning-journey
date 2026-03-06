# ── KBLT Infrastructure ────────────────────────────────────────────────────────
# Manages the full KBLT stack through code:
#   - Vercel   → frontend deployment and environment variables
#   - Railway  → API service and Redis
#   - Supabase → PostgreSQL database and storage
#
# State is stored remotely in Terraform Cloud so it is never committed to git
# and is shared across machines.

terraform {
  # ── Remote state — Terraform Cloud ─────────────────────────────────────────
  cloud {
    organization = "kbld-core"

    workspaces {
      name = "kbld-infra"
    }
  }

  # ── Providers ───────────────────────────────────────────────────────────────
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 1.0"
    }
    supabase = {
      source  = "supabase/supabase"
      version = "~> 1.0"
    }
  }

  required_version = ">= 1.14.0"
}

# ── Provider configuration ─────────────────────────────────────────────────────
# Tokens are read from Terraform Cloud workspace variables — never hardcoded.

provider "vercel" {
  api_token = var.vercel_api_token
}

provider "supabase" {
  access_token = var.supabase_access_token
}
