import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";

export const metadata = {
  title: "Dashboard — Acme",
};

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Belt-and-braces: middleware already guards this, but never render
  // a private page without a user.
  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const displayName =
    profile?.full_name || user.email?.split("@")[0] || "there";
  const initial = (displayName[0] || "?").toUpperCase();

  return (
    <div className="dash">
      <header className="topbar">
        <div className="brand" style={{ color: "var(--ink)", marginBottom: 0 }}>
          <span className="brand-dot" />
          Acme Cloud
        </div>
        <div className="who">
          <div className="avatar">{initial}</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{displayName}</div>
            <div style={{ color: "var(--muted)", fontSize: 12 }}>
              {user.email}
            </div>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="dash-inner">
        <h1>Welcome, {displayName} 👋</h1>
        <p style={{ color: "var(--ink-soft)", margin: 0 }}>
          You are signed in. This page is protected — it is only reachable with a
          valid session.
        </p>

        <div className="grid">
          <div className="tile">
            <h3>User ID</h3>
            <p>{user.id}</p>
          </div>
          <div className="tile">
            <h3>Email</h3>
            <p>{user.email}</p>
          </div>
          <div className="tile">
            <h3>Member since</h3>
            <p>{new Date(user.created_at).toLocaleString("en-IN")}</p>
          </div>
          <div className="tile">
            <h3>Last sign-in</h3>
            <p>
              {user.last_sign_in_at
                ? new Date(user.last_sign_in_at).toLocaleString("en-IN")
                : "—"}
            </p>
          </div>
        </div>

        <div className="profile-card">
          <h3
            style={{
              margin: "0 0 10px",
              fontSize: 13,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--muted)",
            }}
          >
            Your profile row (from the database)
          </h3>
          <p style={{ margin: 0, color: "var(--ink-soft)", fontSize: 14 }}>
            Full name: <strong>{profile?.full_name || "— not set —"}</strong>
            <br />
            Row created:{" "}
            {profile?.created_at
              ? new Date(profile.created_at).toLocaleString("en-IN")
              : "—"}
          </p>
          <p style={{ margin: "14px 0 0", color: "var(--muted)", fontSize: 13 }}>
            Try the API route:{" "}
            <a href="/api/me" target="_blank" rel="noreferrer">
              /api/me
            </a>{" "}
            — it returns your user and profile as JSON.
          </p>
        </div>
      </main>
    </div>
  );
}
