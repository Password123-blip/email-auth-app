import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AuthForm from "@/components/AuthForm";

export default async function HomePage({ searchParams }) {
  // If the visitor already has a session, skip the landing page.
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  const mode = searchParams?.mode === "signup" ? "signup" : "signin";

  return (
    <main className="shell">
      <section className="hero">
        <div className="brand">
          <span className="brand-dot" />
          Acme Cloud
        </div>
        <h1>One login for your whole workspace.</h1>
        <p>
          A production-ready starter with email authentication, a protected
          dashboard and a server API — wired to Supabase and ready to deploy.
        </p>
        <ul>
          <li>
            <span className="check">&#10003;</span>
            Email &amp; password sign-up with verification
          </li>
          <li>
            <span className="check">&#10003;</span>
            Passwordless magic-link login
          </li>
          <li>
            <span className="check">&#10003;</span>
            Server-side sessions and protected routes
          </li>
          <li>
            <span className="check">&#10003;</span>
            Row-level security on every table
          </li>
        </ul>
      </section>

      <section className="panel">
        <AuthForm initialMode={mode} />
      </section>
    </main>
  );
}
