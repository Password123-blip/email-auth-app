# Acme Cloud — Email Auth Starter

A complete, production-ready **full-stack** starter: a Next.js (React) frontend,
Next.js API routes as the server, and [Supabase](https://supabase.com) for
authentication and the database.

Anyone can land on the page, sign up with an email address, and get into a
protected dashboard.

---

## What's included

| Layer | Tech | Where |
| --- | --- | --- |
| Frontend | Next.js App Router (React) | `app/`, `components/` |
| Backend / server | Next.js Route Handlers + middleware | `app/api/`, `middleware.js` |
| Database & auth | Supabase (Postgres + GoTrue) | `profiles` table, `auth.users` |
| Styling | Plain CSS (no build step, no Tailwind) | `app/globals.css` |

### Features

- Email + password **sign up** and **sign in**
- **Magic-link** (passwordless) login
- Email confirmation flow handled by `/auth/callback`
- **Server-side sessions** via cookies (`@supabase/ssr`)
- **Protected routes** — `/dashboard` redirects anonymous users to `/login`
- **Row-level security** on the `profiles` table
- Auto-created profile row on signup (Postgres trigger)
- A sample JSON API at `GET /api/me` that identifies the current user

---

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy the example file and fill in your Supabase values
(**Project Settings → API** in the Supabase dashboard):

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-publishable-or-anon-key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Create the database schema

Run the SQL in [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql)
in the Supabase **SQL Editor**, or apply it with the Supabase CLI:

```bash
supabase db push
```

### 4. Run it

```bash
npm run dev
```

Open <http://localhost:3000> — sign up with any email address.

---

## Project structure

```
email-auth-app/
├── app/
│   ├── api/me/route.js        # sample JSON API (the "server")
│   ├── auth/callback/route.js # handles email confirmation / magic links
│   ├── dashboard/page.js      # protected page (server component)
│   ├── login/page.js          # sign-in page
│   ├── globals.css            # all styling
│   ├── layout.js              # root layout
│   └── page.js                # public landing page
├── components/
│   ├── AuthForm.js            # sign in / sign up / magic link (client)
│   └── LogoutButton.js
├── lib/supabase/
│   ├── client.js              # browser Supabase client
│   └── server.js              # server Supabase client (cookies)
├── supabase/migrations/
│   └── 0001_init.sql          # profiles table, RLS policies, trigger
├── middleware.js              # session refresh + route protection
├── next.config.mjs
├── jsconfig.json
└── package.json
```

---

## Auth flows at a glance

**Sign up (email confirmation ON)**
1. `AuthForm` calls `supabase.auth.signUp()`.
2. Supabase emails a confirmation link pointing at `/auth/callback`.
3. The route exchanges the one-time code for a session and redirects to `/dashboard`.

**Sign up (email confirmation OFF)**
1. `signUp()` returns a session immediately → straight to `/dashboard`.

**Magic link**
1. `supabase.auth.signInWithOtp()` emails a login link.
2. `/auth/callback` exchanges the code, then redirects.

**Protected route**
- `middleware.js` runs on every request, refreshes the session cookie, and
  redirects anonymous users away from `/dashboard`.

---

## Where to go next

- Add a `notes` (or `items`) table scoped to `auth.uid()` and a CRUD UI.
- Add OAuth providers (Google, GitHub) with `supabase.auth.signInWithOAuth()`.
- Deploy the frontend to Vercel and set the same env vars there.
- Turn on **Confirm email** and add a custom SMTP sender for production.

---

## Notes on email in development

Supabase's built-in email service is rate-limited (a handful of emails per
hour) and is meant for testing. If confirmation emails are not arriving:

- **Project Settings → Authentication → Sign In / Providers → Email** →
  turn **Confirm email** off for instant local sign-ups, **or**
- Configure your own SMTP provider under **Project Settings → Authentication → SMTP**.

Remember to add your production URL (e.g. `https://your-app.vercel.app/auth/callback`)
to **Authentication → URL Configuration → Redirect URLs** before you deploy.
