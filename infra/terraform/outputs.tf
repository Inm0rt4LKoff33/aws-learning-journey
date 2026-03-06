# ── Outputs ────────────────────────────────────────────────────────────────────
# Values printed after `terraform apply` completes.
# Useful for confirming what was provisioned without opening each dashboard.

output "vercel_project_id" {
  description = "Vercel project ID for the KBLT frontend"
  value       = data.vercel_project.kblt_frontend.id
}

output "vercel_project_name" {
  description = "Vercel project name"
  value       = data.vercel_project.kblt_frontend.name
}

output "railway_api_url" {
  description = "Railway API public URL"
  value       = var.railway_api_url
}

output "supabase_project_ref" {
  description = "Supabase project reference ID"
  value       = var.supabase_project_ref
}
