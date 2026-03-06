# ── Supabase ───────────────────────────────────────────────────────────────────
# Manages the KBLT Supabase project settings.
# The project itself was created manually — Terraform manages its configuration.
#
# Note: The Supabase Terraform provider is still maturing. It covers project
# settings and auth configuration. Schema migrations are handled by Prisma,
# not Terraform.

# ── Project settings ───────────────────────────────────────────────────────────
resource "supabase_settings" "kblt" {
  project_ref = var.supabase_project_ref

  # ── Auth settings ────────────────────────────────────────────────────────────
  # Disable email confirmations — the API handles auth via JWT directly
  auth = jsonencode({
    site_url                    = var.railway_api_url
    disable_signup              = false
    jwt_expiry                  = 604800  # 7 days in seconds — matches JWT_EXPIRES_IN
    enable_email_confirmations  = false
  })
}
