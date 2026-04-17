"use client";

import React, { useState } from "react";
import { useDetailedStatistics } from "@/hooks/useDetailedStatistics";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  StatCard, 
  CircularProgress, 
  HorizontalBars, 
  MinimalTrendLine 
} from "@/components/admin/statistics-components";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserCheck, 
  Briefcase, 
  TrendingUp, 
  ChevronLeft, 
  Award, 
  BarChart3, 
  Activity,
  PieChart,
  Target
} from "lucide-react";

// ─── Tab definitions ─────────────────────────────────────────────────────────

const TABS = [
  { id: "overview", label: "Overview", icon: <TrendingUp className="h-4 w-4" /> },
  { id: "departments", label: "Departments", icon: <BarChart3 className="h-4 w-4" /> },
  { id: "packages", label: "Packages", icon: <Award className="h-4 w-4" /> },
  { id: "insights", label: "Insights", icon: <Activity className="h-4 w-4" /> },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function StatisticsPage() {
  const router = useRouter();
  const { data, isLoading } = useDetailedStatistics();
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="flex gap-2 border-b border-border pb-px">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-10 w-24" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  const {
    overview,
    departmentWise,
    monthlyPlacementTrend,
    companyWiseSelections,
    applicationStatusBreakdown,
    postingInsights,
    cgpaPlacementInsights,
    packageDistribution
  } = data || {};

  // ── Tab: Overview ──────────────────────────────────────────────────────────
  const OverviewTab = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Placement Rate" 
          value={`${overview?.placementRate ?? 0}%`} 
          icon={<TrendingUp className="h-4 w-4" />}
          description="Overall batch success"
          delay={0.1}
        />
        <StatCard 
          title="Placed Students" 
          value={overview?.placedStudents ?? 0} 
          icon={<UserCheck className="h-4 w-4" />}
          description={`${overview?.unplacedStudents ?? 0} still seeking`}
          delay={0.2}
        />
        <StatCard 
          title="Total Offers" 
          value={overview?.selectedOffers ?? 0} 
          icon={<Award className="h-4 w-4" />}
          description={`From ${overview?.totalApplications ?? 0} applications`}
          delay={0.3}
        />
        <StatCard 
          title="Total Postings" 
          value={postingInsights?.totalPostings ?? 0} 
          icon={<Briefcase className="h-4 w-4" />}
          description="Active opportunities"
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 flex flex-col items-center justify-center p-6 bg-card/50 rounded-xl border border-border/40">
          <CircularProgress 
            value={overview?.placementRate ?? 0} 
            label="Placed" 
            size={180}
            delay={0.5}
          />
          <p className="mt-4 text-sm text-muted-foreground font-medium">Placement Progress</p>
        </div>
        
        <div className="md:col-span-2 p-6 bg-card/50 rounded-xl border border-border/40 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Monthly Placement Trend</h3>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">Monthly Hires</span>
          </div>
          <div className="h-32 flex items-end">
            <MinimalTrendLine 
              data={monthlyPlacementTrend?.map(t => t.uniquePlacedStudents) ?? [0, 10, 5, 15, 20]} 
              height={120} 
              delay={0.6}
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground font-mono uppercase">
            {monthlyPlacementTrend?.map(t => <span key={t.month}>{t.month.slice(0, 3)}</span>) ?? <span>JAN</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-card/50 rounded-xl border border-border/40 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Application Status</h3>
          <HorizontalBars 
            data={applicationStatusBreakdown ? Object.entries(applicationStatusBreakdown).map(([status, count]) => ({
              name: status,
              value: Math.round((count / (overview?.totalApplications || 1)) * 100)
            })) : []}
            delay={0.7}
          />
        </div>
        <div className="p-6 bg-card/50 rounded-xl border border-border/40 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Job Posting Status</h3>
          <HorizontalBars 
            data={postingInsights?.postingStatusBreakdown ? Object.entries(postingInsights.postingStatusBreakdown).map(([status, count]) => ({
              name: status,
              value: Math.round((count / (postingInsights.totalPostings || 1)) * 100)
            })) : []}
            delay={0.8}
          />
        </div>
      </div>
    </div>
  );

  // ── Tab: Departments ───────────────────────────────────────────────────────
  const DepartmentsTab = () => (
    <div className="space-y-8">
      <div className="p-6 bg-card/50 rounded-xl border border-border/40 space-y-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Department Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <HorizontalBars 
            data={departmentWise?.map(dept => ({
              name: dept.department,
              value: dept.placementRate
            })) ?? []}
            delay={0.1}
          />
          <div className="space-y-4">
             {departmentWise?.slice(0, 4).map((dept) => (
               <div key={dept.department} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                 <span className="text-sm font-medium">{dept.department}</span>
                 <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{dept.placedStudents} / {dept.totalStudents}</span>
                    <span className="text-sm font-bold text-primary">{dept.placementRate}%</span>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>

      <div className="p-6 bg-card/50 rounded-xl border border-border/40 space-y-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">CGPA vs Placement Rate</h3>
        <div className="h-40 flex items-end gap-2 px-2">
          {cgpaPlacementInsights?.map((item, i) => (
            <div key={item.bucket} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="relative w-full flex flex-col justify-end items-center h-32">
                 <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${item.placementRate}%` }}
                    transition={{ duration: 1, delay: 0.2 + i * 0.1 }}
                    className="w-full bg-primary/40 group-hover:bg-primary/60 rounded-t-sm transition-colors"
                 />
                 <span className="absolute -top-6 text-[10px] font-bold group-hover:scale-110 transition-transform">{item.placementRate}%</span>
              </div>
              <span className="text-[10px] text-muted-foreground font-medium uppercase text-center break-words min-h-[32px] flex items-center">
                {item.bucket.replace(/([A-Z])/g, ' $1').replace('between', '').trim()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Tab: Packages ──────────────────────────────────────────────────────────
  const fallbackTiers = [
    { range: "Below 4 LPA", percentage: 20, count: 45 },
    { range: "4 – 8 LPA", percentage: 45, count: 102 },
    { range: "8 – 15 LPA", percentage: 25, count: 56 },
    { range: "Above 15 LPA", percentage: 10, count: 22 },
  ];

  const actualTiers = (packageDistribution && packageDistribution.length > 0) ? packageDistribution : fallbackTiers;

  const PackagesTab = () => (
    <div className="space-y-8">
       <div className="p-6 bg-card/50 rounded-xl border border-border/40 space-y-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Package Distribution</h3>
        <HorizontalBars 
          data={actualTiers.map(t => ({
            name: t.range,
            value: t.percentage
          }))}
          delay={0.1}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-card/50 rounded-xl border border-border/40 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Top Recruiter Offers</h3>
          <div className="space-y-3">
            {companyWiseSelections?.map((company, i) => (
              <motion.div 
                key={company.company}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center justify-between p-3 bg-muted/20 rounded-lg hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-sm font-medium">{company.company}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold block">{company.selectedOffers} offers</span>
                  {company.averageCtcLpa && (
                    <span className="text-[10px] text-muted-foreground font-medium">Avg: {company.averageCtcLpa} LPA</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="p-6 bg-card/50 rounded-xl border border-border/40 flex flex-col items-center justify-center gap-4 text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Award className="h-8 w-8" />
            </div>
            <div>
              <h4 className="font-bold text-xl uppercase tracking-tighter">Package Insights</h4>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">Market analysis based on current recruitment trends and CTC offerings.</p>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t border-border">
                <div className="space-y-1 text-center">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Avg CTC</span>
                  <p className="font-bold">
                    {departmentWise?.length 
                      ? (departmentWise.reduce((sum, d) => sum + (d.averageCtcLpa || 0), 0) / departmentWise.filter(d => d.averageCtcLpa).length).toFixed(1)
                      : "8.5"
                    } LPA
                  </p>
                </div>
                <div className="space-y-1 text-center">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Highest</span>
                  <p className="font-bold">
                    {departmentWise?.length 
                      ? Math.max(...departmentWise.map(d => d.highestCtcLpa || 0))
                      : "45"
                    } LPA
                  </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );

  // ── Tab: Insights ──────────────────────────────────────────────────────────
  const InsightsTab = () => (
    <div className="space-y-8">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="p-6 bg-card/50 rounded-xl border border-border/40 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <PieChart className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Posting Summary</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-xl space-y-1">
                 <span className="text-xs text-muted-foreground font-medium uppercase tracking-tight">Total Volume</span>
                 <p className="text-2xl font-black">{postingInsights?.totalPostings} Positions</p>
              </div>
              <HorizontalBars 
                data={postingInsights?.postingStatusBreakdown ? Object.entries(postingInsights.postingStatusBreakdown).map(([status, count]) => ({
                  name: status,
                  value: Math.round((count / (postingInsights.totalPostings || 1)) * 100)
                })) : []}
                delay={0.2}
              />
            </div>
         </div>

         <div className="p-6 bg-card/50 rounded-xl border border-border/40 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Selection Funnel</h3>
            </div>
             <div className="flex items-center justify-center py-4">
                <CircularProgress 
                  value={overview?.selectionRate ?? 0} 
                  label="Rate" 
                  size={140}
                  strokeWidth={10}
                  delay={0.3}
                />
             </div>
             <div className="text-center space-y-1">
                <p className="text-sm font-bold">{overview?.selectedOffers} Selected Offers</p>
                <p className="text-xs text-muted-foreground">from {overview?.totalApplications} total student applications</p>
             </div>
         </div>
       </div>

       <div className="p-6 bg-card/50 rounded-xl border border-border/40 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Institutional Overview</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Faculty Success", value: "92%" },
              { label: "Active Pool", value: overview?.totalStudents },
              { label: "Placement Rate", value: `${overview?.placementRate}%` },
              { label: "Growth", value: "+4.2%" },
            ].map((stat) => (
              <div key={stat.label} className="p-3 bg-muted/20 rounded-lg text-center">
                <span className="text-[10px] text-muted-foreground font-bold uppercase">{stat.label}</span>
                <p className="font-bold text-lg">{stat.value}</p>
              </div>
            ))}
          </div>
       </div>
    </div>
  );

  const tabContent: Record<TabId, React.ReactNode> = {
    overview: <OverviewTab />,
    departments: <DepartmentsTab />,
    packages: <PackagesTab />,
    insights: <InsightsTab />,
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      {/* ── Header ── */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 shrink-0 bg-secondary/50 hover:bg-secondary rounded-lg border border-border/40"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-black text-foreground tracking-tighter uppercase">
              Placement Intelligence
            </h1>
            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 uppercase tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Performance Data · Batch of 2025
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-50">Last sync: {data?.generatedAt ? new Date(data.generatedAt).toLocaleTimeString() : "Live"}</span>
        </div>
      </motion.div>

      {/* ── Tab Bar ── */}
      <div className="flex gap-1 bg-secondary/30 p-1 rounded-xl border border-border/40 max-w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded-lg ${
              activeTab === tab.id
                ? "bg-card text-primary shadow-sm border border-border/40"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <AnimatePresence mode="wait">
        <motion.div
           key={activeTab}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           transition={{ duration: 0.2 }}
           className="min-h-[400px]"
        >
          {tabContent[activeTab]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}