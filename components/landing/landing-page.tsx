"use client";

import React from "react";
import { useStudentNotifications } from "@/hooks/useStudentNotification";
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
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { ApplicationsSection } from "./applications-section";

const sidebarPlaceholders = [
  "Dashboard",
  "My Applications",
  "Eligible Jobs",
  "Profile",
];

export default function LandingPage() {
  const { data, isLoading } = useStudentProfile();
  const profile = data?.profile;
  const session = useSession();
  const loggedIn = Boolean(session);

  const userName =
    session?.user?.name ||
    session?.user?.nickname ||
    session?.user?.email ||
    "Guest";

  const {
  data: notifications = [],
  isLoading: loadingNotifications,
} = useStudentNotifications();

  

  function timeAgo(dateString: string) {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count > 0) {
        return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
      }
    }

    return "Just now";
  }

  if (!loggedIn) {
    return (
      <section className="min-h-screen bg-background text-foreground">
        <div className="flex flex-col items-center justify-center px-4 text-center min-h-screen">
          <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-7xl">
            Streamline your placement journey.
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            A centralized platform for students and placement cells to manage
            applications, track progress, and secure dream careers.
          </p>

          <div className="flex gap-4 pt-6">
            <Link
              href="/auth/login?screen_hint=signup"
              className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Sign up
            </Link>
            <Link
              href="/auth/login"
              className="rounded-md border border-border px-6 py-3 text-sm font-semibold hover:bg-accent"
            >
              Login
            </Link>
          </div>
        </div>
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

      <SidebarInset className="flex min-h-screen flex-1 flex-col">
        <div className="flex flex-1 flex-col px-6 py-8">
          <div className="w-full max-w-6xl space-y-8">

            <div>
              <h1 className="text-xl sm:text-2xl font-semibold">
                Welcome, {isLoading ? userName : profile?.firstName || userName}
              </h1>

              <p className="text-sm text-muted-foreground mt-2">
                Track your placement journey and stay updated with new job postings.
              </p>

              {!isLoading && profile && (
                <div className="mt-4 p-4 rounded-lg border border-border bg-card">
                  <h3 className="text-sm font-semibold mb-2">
                    Profile Information
                  </h3>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>{" "}
                      <span className="font-medium">
                        {profile.firstName} {profile.lastName}
                      </span>
                    </div>

                    <div>
                      <span className="text-muted-foreground">Email:</span>{" "}
                      <span className="font-medium">
                        {profile.personalEmail}
                      </span>
                    </div>

                    <div>
                      <span className="text-muted-foreground">Phone:</span>{" "}
                      <span className="font-medium">
                        {profile.phoneNo}
                      </span>
                    </div>

                    <div>
                      <span className="text-muted-foreground">Skills:</span>{" "}
                      <span className="font-medium">
                        {profile.skills?.length > 0
                          ? profile.skills.join(", ")
                          : "None added"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-md">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold">
                  Recent Job Updates
                </h2>

                <span className="text-xs text-muted-foreground">
                  Latest 5
                </span>
              </div>

              {loadingNotifications ? (
                <p className="text-sm text-muted-foreground">
                  Loading...
                </p>
              ) : notifications.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No notifications yet.
                </p>
              ) : (
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2">
                  {notifications.slice(0, 5).map((job) => {
                    const isNew =
                      new Date().getTime() - new Date(job.createdAt).getTime() <
                      24 * 60 * 60 * 1000;

                    return (
                      <div
                        key={job.id}
                        className="group relative rounded-xl border bg-background p-4 transition-all duration-200 hover:shadow-md hover:border-primary/40"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-sm">
                              {job.company}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {job.role}
                            </p>
                          </div>

                          {isNew && (
                            <span className="text-[10px] px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                              NEW
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-3 text-[11px] text-muted-foreground">
                          <span>{timeAgo(job.createdAt)}</span>
                          <span>
                            Deadline:{" "}
                            {new Date(job.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>           

              <ApplicationsSection />
            </div>

          </div>
        </div>

        <p className="pb-6 text-center text-xs text-muted-foreground">
          Centralized Placement System • Auth secured via Auth0
        </p>
      </SidebarInset>
    </SidebarProvider>
  );
}