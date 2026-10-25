import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AuthForm from "@/components/AuthForm";

export const metadata = {
  title: "Sign in — Acme",
};

export default async function LoginPage({ searchParams }) {
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
        <h1>Welcome back.</h1>
        <p>
          Sign in with your email address. No password manager gymnastics — use
          a password or a one-time magic link.
        </p>
      </section>

      <section className="panel">
        <AuthForm initialMode={mode} />
      </section>
    </main>
  );
}
