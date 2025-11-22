"use client";
import React from "react";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { SidebarBackdrop } from "@/components/sidebar-backdrop";
import { useSession } from "@/providers/session-provider";

const fontClass = "font-['Nunito_Sans',_'Inter',_system-ui,_sans-serif]";

const sidebarPlaceholders = ["Option 1", "Option 2", "Option 3", "Option 4"];

export default function LandingPage() {
  const session = useSession();
  const userName =
    session?.user?.name ||
    session?.user?.nickname ||
    session?.user?.email ||
    "Guest";
  const loggedIn = Boolean(session);

  if (!loggedIn) {
    return (
      <section
        className={`min-h-screen bg-white text-zinc-900 dark:bg-black dark:text-white ${fontClass}`}
      >
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <div className="w-full max-w-3xl space-y-6 py-16">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-500">
              Centralised Placement System
            </p>

            <h1 className="text-3xl sm:text-4xl font-semibold leading-tight">
              Welcome to a calmer workflow.
            </h1>

            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Profiles, education history, and experiences stay in sync so
              recruiters always see the latest data.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/auth/login?screen_hint=signup"
                className="rounded-md bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black"
              >
                Sign up
              </Link>
              <Link
                href="/auth/login"
                className="rounded-md border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:border-zinc-400 dark:border-zinc-700 dark:text-white"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
        <p className="pb-6 text-center text-xs text-zinc-500 dark:text-zinc-500">
          Session status checked securely on the server with Auth0.
        </p>
      </section>
    );
  }

  return (
    <SidebarProvider
      defaultOpen={false}
      className={`min-h-screen bg-white text-zinc-900 dark:bg-black dark:text-white ${fontClass}`}
    >
      <Sidebar
        className="border-r border-zinc-200 bg-white/95 dark:border-zinc-800 dark:bg-zinc-950/95 z-50"
        collapsible="offcanvas"
        variant="floating"
      >
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Quick Access</SidebarGroupLabel>
            <SidebarMenu>
              {sidebarPlaceholders.map((label) => (
                <SidebarMenuItem key={label}>
                  <SidebarMenuButton asChild>
                    <button type="button" className="w-full justify-start">
                      {label}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarBackdrop />
      <SidebarInset className="relative flex min-h-screen flex-1 flex-col bg-white text-zinc-900 dark:bg-black dark:text-white">
        {/* Main Content */}
        <div className="flex flex-1 flex-col px-6 py-8">
          <div className="w-full max-w-6xl space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold leading-tight">
                Welcome, {userName}
              </h1>

              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                Pick up right where you left off—profile, academics, or
                internships—and keep recruiters informed.
              </p>
            </div>

            {/* Two boxes side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* Notifications Box */}
              <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
                <h2 className="text-lg font-semibold mb-4">Notifications</h2>
                <div className="space-y-2">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    No new notifications
                  </p>
                </div>
              </div>

              {/* Applications Applied Box */}
              <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
                <h2 className="text-lg font-semibold mb-4">
                  Applications Applied
                </h2>
                <div className="space-y-2">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    No applications yet
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="pb-6 text-center text-xs text-zinc-500 dark:text-zinc-500">
          Session status checked securely on the server with Auth0.
        </p>
      </SidebarInset>
    </SidebarProvider>
  );
}

