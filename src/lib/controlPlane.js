import { supabase, isSupabaseConfigured } from "./supabaseClient";

/**
 * Control-plane reads aligned with admin dashboard tables.
 * Adjust column names to match your exact migrations (e.g. `status` vs `publish_state`).
 */

export function controlPlaneNotConfiguredError() {
  return new Error(
    "Supabase is not configured. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in my-app/.env and restart the dev server.",
  );
}

/**
 * Example: published rows from content_registry.
 * Typical filters: status = 'published' OR is_published = true — replace with your schema.
 */
export async function loadPublishedContentRegistry({ limit = 50 } = {}) {
  if (!isSupabaseConfigured() || !supabase) {
    return { data: null, error: controlPlaneNotConfiguredError() };
  }

  const { data, error } = await supabase
    .from("content_registry")
    .select("*")
    .eq("status", "published")
    .order("updated_at", { ascending: false })
    .limit(limit);

  return { data, error };
}

/**
 * Example: global feature flags (scope = 'global').
 */
export async function loadGlobalFeatureFlags() {
  if (!isSupabaseConfigured() || !supabase) {
    return { data: null, error: controlPlaneNotConfiguredError() };
  }

  const { data, error } = await supabase
    .from("feature_flags")
    .select("*")
    .eq("scope", "global")
    .order("key", { ascending: true });

  return { data, error };
}

/**
 * Optional: navigation_registry (adjust columns as in your DB).
 */
export async function loadNavigationRegistry() {
  if (!isSupabaseConfigured() || !supabase) {
    return { data: null, error: controlPlaneNotConfiguredError() };
  }

  const { data, error } = await supabase.from("navigation_registry").select("*").order("id", { ascending: true });

  return { data, error };
}
