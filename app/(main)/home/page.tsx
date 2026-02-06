"use client";

import { useSession } from "@/providers/session-provider";
import LandingPage from "@/components/landing/landing-page";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const session = useSession();
  const router = useRouter();

  const [checkingUser, setCheckingUser] = useState(true);

  useEffect(() => {
    if (!session) {
      setCheckingUser(false);
      return;
    }

    const checkUserFlow = async () => {
      try {
        const res = await fetch("/api/my-proxy/api/v1/user/me");

        if (!res.ok) {
          setCheckingUser(false);
          return;
        }

        const data = await res.json();

        const role = data.user.role;
        const step = data.user.onboardingStep;

        /* ---------------- STUDENT FLOW ---------------- */
        if (role === "STUDENT") {
          if (step !== "COMPLETED") {
            router.replace(`/student/onboarding/${step.toLowerCase()}`);
            return;
          }

          // onboarding done → student home
          router.replace("/student/home");
          return;
        }

        /* ---------------- ADMIN / TNP FLOW ---------------- */
        if (role === "ADMIN" || role === "TNP_OFFICER") {
          router.replace("/admin/dashboard");
          return;
        }

        setCheckingUser(false);
      } catch (err) {
        setCheckingUser(false);
      }
    };

    checkUserFlow();
  }, [session, router]);

  /* ---------------- LOADING ---------------- */
  if (session && checkingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground animate-pulse">
          Preparing your dashboard…
        </p>
      </div>
    );
  }

  /* ---------------- LOGGED OUT UI ---------------- */
  if (!session) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50 via-white to-white dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-950" />

        <section className="mx-auto max-w-3xl px-6 text-center space-y-8">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-600">
            Centralised Placement System
          </p>

          <h1 className="text-4xl sm:text-5xl font-semibold leading-tight">
            One platform for students,
            <br />
            placement officers & recruiters
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground">
            Collect verified student data, manage eligibility automatically, and
            track placements without spreadsheets.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="/auth/login?screen_hint=signup"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Get started
            </a>

            <a
              href="/auth/login"
              className="rounded-lg border border-border px-6 py-3 text-sm font-semibold transition hover:bg-accent"
            >
              Login
            </a>
          </div>
        </section>

        <footer className="absolute bottom-0 w-full border-t border-border py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Centralised Placement System
        </footer>
      </main>
    );
  }

  /* ---------------- FALLBACK (won’t render often) ---------------- */
  return <LandingPage />;
}
