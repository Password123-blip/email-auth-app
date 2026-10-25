import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for use in the browser (Client Components).
 * Safe to expose: it only uses the publishable/anon key.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
