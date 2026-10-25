import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Example API route ("the backend"). It proves that the server can identify
 * the logged-in user from their session cookie and return per-user data.
 *
 * GET /api/me  ->  { user, profile }  or  401 when not signed in
 */
export async function GET() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return NextResponse.json({
    user: { id: user.id, email: user.email },
    profile,
    serverTime: new Date().toISOString(),
  });
}
