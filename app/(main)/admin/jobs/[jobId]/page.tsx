"use client";

import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ApplicationsTable } from "@/components/admin/ApplicationsTable";
import { useAdminJob } from "@/hooks/useAdminJob";
import { useJobApplications } from "@/hooks/useJobApplications";

export default function AdminJobDetailPage() {
  const statusVariant: any = {
    DRAFT: "secondary",
    OPEN: "success",
    CLOSED: "warning",
    ARCHIVED: "outline",
  } as const;
  const router = useRouter();
  const { jobId } = useParams<{ jobId: string }>();

  const { data, isLoading } = useAdminJob(jobId);
  const {
    data: applications,
    isLoading: isApplicationsLoading,
    refetch,
  } = useJobApplications(jobId);

  if (isLoading) return <div className="p-8">Loading…</div>;
  if (!data) return <div className="p-8 text-red-500">Job not found</div>;

  const { job, stats } = data;

  return (
    <div className="space-y-8 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{job.role}</h1>
          <p className="text-muted-foreground">{job.company}</p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant={statusVariant[job.status]}>{job.status}</Badge>
          <Button onClick={() => router.push(`/admin/jobs/${job.id}/edit`)}>
            Edit Job
          </Button>
        </div>
      </div>

      <Separator />

      {/* Job Info */}
      <Card>
        <CardHeader>
          <CardTitle>Job Information</CardTitle>
          <CardDescription>Basic job details</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Info label="CTC" value={`${job.ctc} LPA`} />
          <Info
            label="Deadline"
            value={new Date(job.deadline).toLocaleDateString()}
          />
          <Info
            label="Created On"
            value={new Date(job.createdAt).toLocaleDateString()}
          />
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Job Description</CardTitle>
          <CardDescription>Role details and responsibilities</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Company Info */}
          {job.companyInfo && (
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                About the Company
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {job.companyInfo}
              </p>
            </div>
          )}

          {/* Job Description */}
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
              Role Description
            </p>
            <p className="whitespace-pre-wrap leading-relaxed">
              {job.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Eligibility */}
      <Card>
        <CardHeader>
          <CardTitle>Eligibility Criteria</CardTitle>
          <CardDescription>Auto-evaluated for students</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Info label="Min CGPA" value={job.eligibility.minCGPA} />
          <Info label="Min 10th Percent" value={job.eligibility.minTenth} />
          <Info label="Min 12th Percent" value={job.eligibility.minTwelfth} />
          <Info
            label="Min Diploma Percent"
            value={job.eligibility.minDiploma}
          />
          <Info label="Max Backlogs" value={job.eligibility.maxBacklogs} />
          <Info label="Passing Year" value={job.eligibility.passingYear} />
          <Info
            label="Allowed Branches"
            value={job.eligibility.allowedBranches.join(", ")}
          />
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat title="Eligible" value={stats.eligible} />
        <Stat title="Applied" value={stats.applied} />
        <Stat title="Shortlisted" value={stats.shortlisted} />
        <Stat title="Selected" value={stats.selected} />
      </div>
      {/* Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
          <CardDescription>Students who applied for this job</CardDescription>
        </CardHeader>

        <CardContent>
          {isApplicationsLoading ? (
            <p className="text-sm text-muted-foreground">
              Loading applications…
            </p>
          ) : applications?.length === 0 ? (
            <p className="text-sm text-muted-foreground">No applications yet</p>
          ) : (
            <ApplicationsTable
              applications={applications}
              onUpdated={refetch}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* helpers */

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value ?? "—"}</p>
    </div>
  );
}

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
