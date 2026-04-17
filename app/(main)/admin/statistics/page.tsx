"use client";

import React, { useState } from "react";
import { usePlacementOverview } from "@/hooks/usePlacementOverview";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconArrowLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5" /><polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function IconTrendingUp() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

function IconUserCheck() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconBriefcase() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function IconAward() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  );
}

function IconBarChart() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function IconActivity() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

// ─── Shared UI Primitives ────────────────────────────────────────────────────

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-1 rounded-full bg-border overflow-hidden">
      <div
        className="h-full rounded-full bg-primary transition-all duration-700"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
}

function RadialRing({ value }: { value: number }) {
  const size = 160;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = Math.min(value / 100, 1) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="var(--primary)" strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dasharray 0.9s ease" }}
      />
    </svg>
  );
}

// ─── Tab definitions ─────────────────────────────────────────────────────────

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "departments", label: "Departments" },
  { id: "packages", label: "Packages" },
  { id: "highlights", label: "Highlights" },
] as const;
type TabId = (typeof TABS)[number]["id"];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function StatisticsPage() {
  const router = useRouter();
  const { data: overview, isLoading } = usePlacementOverview();
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const departments: { name: string; percentage: number; placed?: number }[] =
    overview?.departments ?? [];

  // ── Tab: Overview ──────────────────────────────────────────────────────────
  const OverviewTab = () => (
    <div className="space-y-8">
      {/* Radial */}
      <div className="flex flex-col items-center gap-3">
        {isLoading ? (
          <Skeleton className="h-40 w-40 rounded-full" />
        ) : (
          <div className="relative flex items-center justify-center">
            <RadialRing value={overview?.placementRate ?? 0} />
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-bold text-foreground tabular-nums">
                {overview?.placementRate ?? 0}%
              </span>
              <span className="text-xs text-muted-foreground">placed</span>
            </div>
          </div>
        )}
        <p className="text-sm text-muted-foreground">Overall Placement Rate</p>
      </div>

      {/* 4 stat rows */}
      <div className="divide-y divide-border">
        {[
          {
            label: "Placed Students",
            value: overview?.placedCount ?? 0,
            Icon: IconUserCheck,
          },
          {
            label: "Total Students",
            value: overview?.totalStudents ?? 0,
            Icon: IconUsers,
          },
          {
            label: "Placement Drives",
            value: overview?.totalPostings ?? 0,
            Icon: IconBriefcase,
          },
          {
            label: "Placement Rate",
            value: `${overview?.placementRate ?? 0}%`,
            Icon: IconTrendingUp,
          },
        ].map(({ label, value, Icon }) => (
          <div
            key={label}
            className="flex items-center justify-between py-3"
          >
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Icon />
              {label}
            </div>
            {isLoading ? (
              <Skeleton className="h-5 w-12" />
            ) : (
              <span className="text-sm font-semibold text-foreground tabular-nums">
                {value}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // ── Tab: Departments ───────────────────────────────────────────────────────
  const DepartmentsTab = () => (
    <div className="space-y-1">
      {isLoading ? (
        <div className="space-y-5 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-1 w-full" />
            </div>
          ))}
        </div>
      ) : departments.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
          No department data available.
        </div>
      ) : (
        <div className="divide-y divide-border">
          {departments.map((dept) => (
            <div key={dept.name} className="py-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{dept.name}</span>
                <div className="flex items-center gap-3 text-muted-foreground">
                  {dept.placed !== undefined && (
                    <span className="tabular-nums">{dept.placed} placed</span>
                  )}
                  <span className="font-semibold text-foreground tabular-nums">
                    {dept.percentage}%
                  </span>
                </div>
              </div>
              <ProgressBar value={dept.percentage} />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ── Tab: Packages ──────────────────────────────────────────────────────────
  const fallbackTiers = [
    { range: "Below 4 LPA", pct: 20 },
    { range: "4 – 8 LPA", pct: 45 },
    { range: "8 – 15 LPA", pct: 25 },
    { range: "Above 15 LPA", pct: 10 },
  ];

  const hasRealPackageData =
    overview?.packageDistribution && overview.packageDistribution.length > 0;

  const PackagesTab = () => (
    <div>
      {isLoading ? (
        <div className="space-y-5 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-1 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="divide-y divide-border">
            {hasRealPackageData
              ? overview!.packageDistribution.map(
                  (
                    tier: { range: string; count: number; percentage: number },
                  ) => (
                    <div key={tier.range} className="py-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">
                          {tier.range}
                        </span>
                        <span className="text-muted-foreground tabular-nums">
                          {tier.count} students &middot; {tier.percentage}%
                        </span>
                      </div>
                      <ProgressBar value={tier.percentage} />
                    </div>
                  )
                )
              : fallbackTiers.map((t) => (
                  <div key={t.range} className="py-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">
                        {t.range}
                      </span>
                      <span className="text-muted-foreground tabular-nums">
                        {t.pct}%
                      </span>
                    </div>
                    <ProgressBar value={t.pct} />
                  </div>
                ))}
          </div>
          {!hasRealPackageData && (
            <p className="mt-4 text-xs text-muted-foreground border-t border-border pt-4">
              Package distribution data is not yet available from the server.
              The values above are illustrative only.
            </p>
          )}
        </>
      )}
    </div>
  );

  // ── Tab: Highlights ────────────────────────────────────────────────────────
  const HighlightsTab = () => (
    <div className="divide-y divide-border">
      {[
        {
          label: "Highest Package",
          value: overview?.highestPackage ?? "N/A",
          Icon: IconAward,
        },
        {
          label: "Average Package",
          value: overview?.averagePackage ?? "N/A",
          Icon: IconBarChart,
        },
        {
          label: "Median Package",
          value: overview?.medianPackage ?? "N/A",
          Icon: IconActivity,
        },
        {
          label: "Companies Visited",
          value: overview?.totalPostings ?? 0,
          Icon: IconBriefcase,
        },
      ].map(({ label, value, Icon }) => (
        <div key={label} className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon />
            {label}
          </div>
          {isLoading ? (
            <Skeleton className="h-5 w-16" />
          ) : (
            <span className="text-sm font-semibold text-foreground tabular-nums">
              {value}
            </span>
          )}
        </div>
      ))}
    </div>
  );

  const tabContent: Record<TabId, React.ReactNode> = {
    overview: <OverviewTab />,
    departments: <DepartmentsTab />,
    packages: <PackagesTab />,
    highlights: <HighlightsTab />,
  };

  return (
    <div className="max-w-xl mx-auto p-4 md:p-8 space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => router.back()}
        >
          <IconArrowLeft />
        </Button>
        <div>
          <h1 className="text-lg font-semibold text-foreground tracking-tight">
            Placement Statistics
          </h1>
          <p className="text-xs text-muted-foreground">
            Current batch · Live data
          </p>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div className="flex gap-1 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <div className="min-h-[320px]">{tabContent[activeTab]}</div>
    </div>
  );
}
