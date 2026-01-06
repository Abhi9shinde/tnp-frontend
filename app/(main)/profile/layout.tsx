"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "@/components/Container";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Overview", href: "/profile/overview" },
  { label: "Profile", href: "/profile/editProfile" },
  { label: "Education", href: "/profile/editEducation" },
  { label: "Experience", href: "/profile/editExperience" },
  { label: "Projects", href: "/profile/projects" },
  { label: "Skills", href: "/profile/skills" },
  { label: "Certifications", href: "/profile/certifications" },
];

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <>
      {/* Header */}
      <div className="border-b-2 border-gray-200 pb-4 pt-16">
        <div className="flex items-start justify-between">
          <h1 className="text-3xl font-semibold">Edit your Profile</h1>
        </div>

        {/* Tabs */}
        <div className="mt-6">
          <nav className="flex gap-6">
            {tabs.map((tab) => {
              const isActive =
                pathname === tab.href ||
                (tab.href !== "/profile" && pathname.startsWith(tab.href));

              return (
                <Link
                  key={tab.label}
                  href={tab.href}
                  className={cn(
                    "relative pb-2 text-sm font-medium transition-colors",
                    isActive
                      ? "text-foreground after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Page content */}
      <Container className="mt-8 border border-gray-200 rounded-lg p-6">
        {children}
      </Container>
    </>
  );
};

export default ProfileLayout;
