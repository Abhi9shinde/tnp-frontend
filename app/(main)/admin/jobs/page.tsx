"use client";

import { useAdminJobPostings } from "@/hooks/useAdminJobPostings";
import { AdminJobCard } from "@/components/admin/AdminJobCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

export default function AdminJobsPage() {
  const { data: jobs, isLoading } = useAdminJobPostings();
  const router = useRouter();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Job Postings</h1>
          <p className="text-muted-foreground">Manage all placement drives</p>
        </div>

        <Button onClick={() => router.push("/admin/posting")}>
          + Create Job
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))
          : jobs?.map((job) => <AdminJobCard key={job.id} job={job} />)}
      </div>

      {!isLoading && jobs?.length === 0 && (
        <p className="text-center text-muted-foreground py-10">
          No job postings yet.
        </p>
      )}
    </div>
  );
}
