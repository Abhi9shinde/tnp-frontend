"use client";
import React from "react";
import { useSession } from "@/providers/session-provider";
// Server component: fetches session on the server and greets the user. no need of prop drilling.
export default function LandingPage() {
  const session = useSession();
  const name = session?.user?.name || session?.user?.nickname || "Guest";

  return (
    <section className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center py-20">
        <h1 className="text-4xl md:text-5xl font-semibold mb-4">
          Welcome{session ? `, ${name}` : ""}.
        </h1>
        <p className="text-muted-foreground mb-8 text-lg">
          A clean, minimalist experience to get you started.
        </p>

        <div className="flex items-center justify-center gap-4">
          {session ? (
            <>
              <a
                href="/profile"
                className="px-5 py-2 rounded-md border border-transparent bg-black text-white text-sm"
              >
                Profile
              </a>
              <a href="/auth/logout" className="px-5 py-2 rounded-md text-sm">
                Sign out
              </a>
            </>
          ) : (
            <a
              href="/auth/login"
              className="px-6 py-3 rounded-md bg-black text-white text-sm"
            >
              Get started
            </a>
          )}
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Logged in state is read server-side via Auth0 sessions (secure
          cookie).
        </p>
      </div>
    </section>
  );
}
