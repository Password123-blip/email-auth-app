"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * The email auth card: sign in, sign up, and magic-link, all in one place.
 * Talks to Supabase directly from the browser for auth, then lets the
 * server middleware pick up the session from cookies.
 */
export default function AuthForm({ initialMode = "signin" }) {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState(initialMode); // "signin" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function reset() {
    setError("");
    setNotice("");
  }

  function switchMode(next) {
    reset();
    setMode(next);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    reset();
    setLoading(true);

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;

        // If email confirmation is ON, there is no session yet.
        if (data.session) {
          router.push("/dashboard");
          router.refresh();
        } else {
          setNotice(
            "Check your inbox — we sent a confirmation link to " + email + "."
          );
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleMagicLink() {
    reset();
    if (!email) {
      setError("Enter your email address first.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      setNotice("Magic link sent to " + email + ". Check your inbox.");
    } catch (err) {
      setError(err.message || "Could not send the magic link.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>{mode === "signup" ? "Create your account" : "Sign in"}</h2>
      <p className="sub">
        {mode === "signup"
          ? "Start free — no credit card required."
          : "Use your email to continue to your dashboard."}
      </p>

      <div className="tabs" role="tablist">
        <button
          type="button"
          className={mode === "signin" ? "active" : ""}
          onClick={() => switchMode("signin")}
        >
          Sign in
        </button>
        <button
          type="button"
          className={mode === "signup" ? "active" : ""}
          onClick={() => switchMode("signup")}
        >
          Sign up
        </button>
      </div>

      {error && <div className="msg err">{error}</div>}
      {notice && <div className="msg ok">{notice}</div>}

      <form onSubmit={handleSubmit}>
        {mode === "signup" && (
          <label className="field">
            <span>Full name</span>
            <input
              type="text"
              autoComplete="name"
              placeholder="Ada Lovelace"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </label>
        )}

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            type="password"
            required
            minLength={6}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button className="btn" type="submit" disabled={loading}>
          {loading
            ? "Please wait…"
            : mode === "signup"
            ? "Create account"
            : "Sign in"}
        </button>
      </form>

      <div className="divider">or</div>

      <button
        type="button"
        className="btn secondary"
        onClick={handleMagicLink}
        disabled={loading}
      >
        Email me a magic link
      </button>

      <p className="fine">
        By continuing you agree to our Terms and Privacy Policy.
      </p>
    </div>
  );
}
