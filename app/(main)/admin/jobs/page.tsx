"use client";

import { useAdminJobPostings } from "@/hooks/useAdminJobPostings";
import { AdminJobCard } from "@/components/admin/AdminJobCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function AdminJobsPage() {
  const { data: jobs, isLoading } = useAdminJobPostings();

  const [statusFilter, setStatusFilter] = useState("ALL");
  const filteredJobs = useMemo(() => {
    if (!jobs) return [];

    if (statusFilter === "ALL") return jobs;

    return jobs.filter((job) => job.status === statusFilter);
  }, [jobs, statusFilter]);
  const router = useRouter();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Job Postings</h1>
          <p className="text-muted-foreground">Manage all placement drives</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-42.5">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">All Jobs</SelectItem>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="CLOSED">Closed</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={() => router.push("/admin/posting")}>
            + Create Job
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))
          : filteredJobs?.map((job) => <AdminJobCard key={job.id} job={job} />)}
      </div>

      {!isLoading && filteredJobs?.length === 0 && (
        <p className="text-center text-muted-foreground py-10">
          No job postings yet.
        </p>
      )}
    </div>
  );
}
