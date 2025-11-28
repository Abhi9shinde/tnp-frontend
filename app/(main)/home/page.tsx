"use client";

import { useSession } from "@/providers/session-provider";
import LandingPage from "@/components/landing/landing-page";

export default function Home() {
  const session = useSession();
  if (session) {
    return <LandingPage />;
  }

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center px-6 text-center py-8 pb-0">
      <div className="max-w-2xl space-y-6">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-500">
          Centralised Placement System
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight">
          Streamline hiring conversations between students and recruiters.
        </h1>
        <p className="text-base text-muted-foreground">
          We help placement cells collect verified student data and keep every
          application stage organised—without endless spreadsheets.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <a
            href="/auth/login?screen_hint=signup"
            className="px-6 py-3 rounded-md bg-primary text-primary-foreground text-sm font-semibold transition hover:bg-primary/90"
          >
            Sign up
          </a>
          <a
            href="/auth/login"
            className="px-6 py-3 rounded-md border border-border text-sm font-semibold text-foreground transition hover:bg-accent"
          >
            Login
          </a>
        </div>
      </div>
      <footer className="mt-auto flex items-center justify-center border-t border-border py-6 text-xs text-muted-foreground w-full">
        © {new Date().getFullYear()} Centralised Placement System
      </footer>
    </div>
  );
}
