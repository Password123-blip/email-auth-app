import "./globals.css";

export const metadata = {
  title: "Acme — Sign in",
  description:
    "Full-stack Next.js starter with Supabase email authentication and a protected dashboard.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
