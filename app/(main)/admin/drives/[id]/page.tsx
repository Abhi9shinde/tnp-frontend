"use client";

import { use } from "react";
import { useAdminJob } from "@/hooks/useAdminJob";
import { useJobApplications } from "@/hooks/useJobApplications";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ApplicationsTable } from "@/components/admin/ApplicationsTable";
import { ArrowLeftIcon, BuildingIcon, CalendarIcon, BanknoteIcon, UsersIcon, CheckCircleIcon, XCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

export default function DriveDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const { data: job, isLoading: isJobLoading } = useAdminJob(id);
  const { data: applications, isLoading: isAppsLoading, refetch: refetchApps } = useJobApplications(id);

  const stats = useMemo(() => {
    if (!applications) return null;
    return {
      total: applications.length,
      selected: applications.filter((app: any) => app.status === "SELECTED").length,
      shortlisted: applications.filter((app: any) => app.status === "SHORTLISTED").length,
      rejected: applications.filter((app: any) => app.status === "REJECTED").length,
      pending: applications.filter((app: any) => app.status === "APPLIED").length,
    };
  }, [applications]);

  if (isJobLoading) {
    return <div className="p-8 space-y-4">
      <Skeleton className="h-8 w-1/3" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24" />)}
      </div>
      <Skeleton className="h-64" />
    </div>;
  }

  if (!job) {
    return (
        <div className="p-8 flex flex-col items-center justify-center space-y-4">
            <h1 className="text-2xl font-bold">Drive Not Found</h1>
            <Button onClick={() => router.back()}>Go Back</Button>
        </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header & Navigation */}
      <div className="flex flex-col gap-2">
        <Button 
            variant="ghost" 
            className="w-fit -ml-2 text-muted-foreground hover:text-foreground"
            onClick={() => router.back()}
        >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Drives
        </Button>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{job.job.role}</h1>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <BuildingIcon className="w-4 h-4" />
                    <span className="font-medium">{job.job.company}</span>
                    <span>•</span>
                    <span className="text-sm">{job.job.companyInfo}</span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                 <Badge variant={new Date(job.job.deadline) > new Date() ? "default" : "secondary"}>
                    {new Date(job.job.deadline) > new Date() ? "Active" : "Closed"}
                 </Badge>
                 <span className="text-sm text-muted-foreground flex items-center gap-1 bg-secondary/50 px-3 py-1 rounded-full">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    Deadline: {new Date(job.job.deadline).toLocaleDateString()}
                 </span>
            </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
            title="Total Applied" 
            value={stats?.total ?? 0} 
            icon={<UsersIcon className="w-4 h-4 flex-shrink-0" />}
            loading={isAppsLoading}
        />
        <StatsCard 
            title="Shortlisted" 
            value={stats?.shortlisted ?? 0} 
            icon={<CheckCircleIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />}
            loading={isAppsLoading}
        />
         <StatsCard 
            title="Selected" 
            value={stats?.selected ?? 0} 
            icon={<CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />}
            loading={isAppsLoading}
        />
        <StatsCard 
            title="Rejected" 
            value={stats?.rejected ?? 0} 
            icon={<XCircleIcon className="w-4 h-4 text-red-500 flex-shrink-0" />}
            loading={isAppsLoading}
        />
      </div>

      {/* Main Content Area */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Description & Details */}
        <div className="lg:col-span-1 space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Job Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                        <span className="text-sm font-medium text-muted-foreground">CTC</span>
                        <span className="font-bold flex items-center gap-1">
                            <BanknoteIcon className="w-4 h-4 text-green-600" />
                            {job.job.ctc}
                        </span>
                    </div>
                     <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {job.job.description}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Right Column: Applicants Table */}
        <div className="lg:col-span-2 min-w-0">
            <Card className="h-full flex flex-col">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Applicants</span>
                        <Badge variant="outline">{stats?.total ?? 0} Students</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-0 overflow-hidden">
                    {isAppsLoading ? (
                        <div className="p-8 space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ) : (
                         <div className="relative w-full overflow-x-auto">
                            <ApplicationsTable 
                                applications={applications ?? []} 
                                onUpdated={refetchApps}
                                className="border-0 rounded-none"
                            />
                         </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, loading }: { title: string, value: number, icon: React.ReactNode, loading: boolean }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                {loading ? (
                    <Skeleton className="h-8 w-16" />
                ) : (
                    <div className="text-2xl font-bold">{value}</div>
                )}
            </CardContent>
        </Card>
    )
}
