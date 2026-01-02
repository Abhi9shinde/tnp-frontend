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
import { useEffect, useState } from "react";

const sidebarPlaceholders = ["Option 1", "Option 2", "Option 3", "Option 4"];

export default function LandingPage() {
  const session = useSession();
  const userName =
    session?.user?.name ||
    session?.user?.nickname ||
    session?.user?.email ||
    "Guest";
  const loggedIn = Boolean(session);

  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!loggedIn) return;

    async function loadProfile() {
      try {
        const res = await fetch("/api/my-proxy/api/v1/student/profile");
        const data = await res.json();
        setStudentProfile(data.profile);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoadingProfile(false);
      }
    }

    loadProfile();
  }, [loggedIn]);

  if (!loggedIn) {
    return (
      <section className="min-h-screen bg-background text-foreground">
        <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center">
          <div className="mb-8 inline-flex items-center rounded-full border border-border bg-background/50 px-3 py-1 backdrop-blur-sm">
            <span className="mr-2 flex h-2 w-2">
              <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              v2.0 is now live
            </span>
          </div>
          <h1 className="max-w-4xl bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-7xl">
            Streamline your placement journey.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            A centralized platform for students and placement cells to manage
            applications, track progress, and secure dream careers.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/auth/login?screen_hint=signup"
              className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Sign up
            </Link>
            <Link
              href="/auth/login"
              className="rounded-md border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-accent"
            >
              Login
            </Link>
          </div>
        </div>

        <p className="pb-6 text-center text-xs text-muted-foreground">
          Session status checked securely on the server with Auth0.
        </p>
      </section>
    );
  }

  return (
    <SidebarProvider
      defaultOpen={false}
      className="min-h-screen bg-background text-foreground"
    >
      <Sidebar
        className="border-r border-border bg-sidebar/95 z-50"
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
      <SidebarInset className="relative flex min-h-screen flex-1 flex-col bg-background text-foreground">
        <div className="flex flex-1 flex-col px-6 py-8">
          <div className="w-full max-w-6xl space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold leading-tight">
                Welcome,{" "}
                {loadingProfile
                  ? userName
                  : studentProfile?.firstName || userName}
              </h1>

              <p className="text-sm text-muted-foreground mt-2">
                Pick up right where you left off—profile, academics, or
                internships—and keep recruiters informed.
              </p>

              {/* Profile Info Display */}
              {loadingProfile ? (
                <div className="mt-4 p-4 rounded-lg border border-border bg-card">
                  <p className="text-sm text-muted-foreground">
                    Loading profile...
                  </p>
                </div>
              ) : studentProfile ? (
                <div className="mt-4 p-4 rounded-lg border border-border bg-card">
                  <h3 className="text-sm font-semibold mb-2">
                    Profile Information
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>{" "}
                      <span className="font-medium">
                        {studentProfile.firstName} {studentProfile.middleName}{" "}
                        {studentProfile.lastName}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email:</span>{" "}
                      <span className="font-medium">
                        {studentProfile.personalEmail}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span>{" "}
                      <span className="font-medium">
                        {studentProfile.phoneNo}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Skills:</span>{" "}
                      <span className="font-medium">
                        {studentProfile.skills.length > 0
                          ? studentProfile.skills.join(", ")
                          : "None added"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Notifications</h2>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    No new notifications
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">
                  Applications Applied
                </h2>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    No applications yet
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="pb-6 text-center text-xs text-muted-foreground">
          Session status checked securely on the server with Auth0.
        </p>
      </SidebarInset>
    </SidebarProvider>
  );
}
