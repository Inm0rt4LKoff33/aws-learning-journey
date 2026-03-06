# ── Input Variables ────────────────────────────────────────────────────────────
# Sensitive values are marked sensitive = true so Terraform never prints them
# in plan/apply output.
#
# All variables are set in Terraform Cloud workspace → Variables tab.
# Never put real values in this file — it is committed to git.

# ── Provider tokens ───────────────────────────────────────────────────────────

variable "vercel_api_token" {
  description = "Vercel API token. Generate at vercel.com/account/tokens"
  type        = string
  sensitive   = true
}

variable "supabase_access_token" {
  description = "Supabase personal access token. Generate at supabase.com/dashboard/account/tokens"
  type        = string
  sensitive   = true
}

# ── Project identifiers ────────────────────────────────────────────────────────

variable "vercel_team_id" {
  description = "Vercel team ID (optional — leave empty if using a personal account)"
  type        = string
  default     = ""
}

variable "supabase_organization_id" {
  description = "Supabase organization ID. Found in supabase.com/dashboard/org"
  type        = string
}

variable "supabase_project_ref" {
  description = "Supabase project reference ID. Found in project settings."
  type        = string
}

variable "supabase_db_password" {
  description = "Supabase database password"
  type        = string
  sensitive   = true
}

# ── Application secrets ────────────────────────────────────────────────────────

variable "jwt_secret" {
  description = "Secret key used to sign JWTs in the Fastify API"
  type        = string
  sensitive   = true
}

variable "railway_api_url" {
  description = "Public Railway API URL (e.g. https://kbld-api-production-v1.up.railway.app)"
  type        = string
}
