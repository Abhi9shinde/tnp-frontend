"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

import { useAdminJob } from "@/hooks/useAdminJob";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textArea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const STATUS_FLOW = ["DRAFT", "OPEN", "CLOSED", "ARCHIVED"] as const;

export default function EditJobPage() {
  const router = useRouter();
  const { jobId } = useParams<{ jobId: string }>();
  const { data, isLoading } = useAdminJob(jobId);

  const [saving, setSaving] = useState(false);

  const [job, setJob] = useState<any>(null);
  const [eligibility, setEligibility] = useState<any>(null);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    if (data?.job) {
      setJob(data.job);
      setEligibility(data.job.eligibility);
      setStatus(data.job.status);
    }
  }, [data]);

  if (isLoading) return <div className="p-8">Loading job…</div>;
  if (!job) return <div className="p-8 text-red-500">Job not found</div>;

  const allowedNextStatuses = STATUS_FLOW.slice(
    STATUS_FLOW.indexOf(job.status),
  );

  const saveChanges = async () => {
    try {
      setSaving(true);

      await axios.put("/api/my-proxy/api/v1/admin/editPostingDetails", {
        id: job.id,
        role: job.role,
        company: job.company,
        companyInfo: job.companyInfo,
        description: job.description,
        ctc: job.ctc,
        deadline: job.deadline,
      });

      await axios.put("/api/my-proxy/api/v1/admin/editEligibilityCriteria", {
        jobPostId: job.id,
        ...eligibility,
      });

      if (status !== job.status) {
        await axios.patch("/api/my-proxy/api/v1/admin/job/status", {
          jobPostId: job.id,
          status,
        });
      }

      toast.success("Job updated successfully");
      router.push(`/admin/jobs/${job.id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update job");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Edit Job</h1>
          <p className="text-muted-foreground">
            {job.role} · {job.company}
          </p>
        </div>

        <Badge variant="outline">{job.status}</Badge>
      </div>

      <Separator />

      {/* Job Details */}
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>Basic information</CardDescription>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            value={job.role}
            onChange={(e) => setJob({ ...job, role: e.target.value })}
            placeholder="Job Role"
          />
          <Input
            value={job.company}
            onChange={(e) => setJob({ ...job, company: e.target.value })}
            placeholder="Company"
          />
          <Input
            value={job.ctc}
            onChange={(e) => setJob({ ...job, ctc: e.target.value })}
            placeholder="CTC (LPA)"
          />
          <Input
            type="date"
            value={job.deadline.slice(0, 10)}
            onChange={(e) => setJob({ ...job, deadline: e.target.value })}
          />

          <Textarea
            value={job.companyInfo ?? ""}
            onChange={(e) => setJob({ ...job, companyInfo: e.target.value })}
            className="md:col-span-2"
            placeholder="Company Information"
          />

          <Textarea
            value={job.description}
            onChange={(e) => setJob({ ...job, description: e.target.value })}
            className="md:col-span-2 min-h-[150px]"
            placeholder="Job Description"
          />
        </CardContent>
      </Card>

      {/* Eligibility */}
      <Card>
        <CardHeader>
          <CardTitle>Eligibility Criteria</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            type="number"
            value={eligibility.minCGPA ?? ""}
            onChange={(e) =>
              setEligibility({ ...eligibility, minCGPA: +e.target.value })
            }
            placeholder="Min CGPA"
          />
          <Input
            type="number"
            value={eligibility.minTenth ?? ""}
            onChange={(e) =>
              setEligibility({ ...eligibility, minTenth: +e.target.value })
            }
            placeholder="Min 10th %"
          />
          <Input
            type="number"
            value={eligibility.minTwelfth ?? ""}
            onChange={(e) =>
              setEligibility({ ...eligibility, minTwelfth: +e.target.value })
            }
            placeholder="Min 12th %"
          />
          <Input
            type="number"
            value={eligibility.minDiploma ?? ""}
            onChange={(e) =>
              setEligibility({ ...eligibility, minDiploma: +e.target.value })
            }
            placeholder="Min Diploma %"
          />
          <Input
            type="number"
            value={eligibility.maxBacklogs ?? ""}
            onChange={(e) =>
              setEligibility({
                ...eligibility,
                maxBacklogs: +e.target.value,
              })
            }
            placeholder="Max Backlogs"
          />
          <Input
            type="number"
            value={eligibility.passingYear ?? ""}
            onChange={(e) =>
              setEligibility({
                ...eligibility,
                passingYear: +e.target.value,
              })
            }
            placeholder="Passing Year"
          />
        </CardContent>
      </Card>

      {/* Job Status */}
      <Card>
        <CardHeader>
          <CardTitle>Job Status</CardTitle>
          <CardDescription>Lifecycle control</CardDescription>
        </CardHeader>

        <CardContent>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[250px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {allowedNextStatuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
        {/* <Button
          variant="destructive"
          disabled={job.status === "ARCHIVED" || saving}
          onClick={async () => {
            try {
              setSaving(true);

              await axios.patch("/api/my-proxy/api/v1/admin/job/status", {
                jobPostId: job.id,
                status: "ARCHIVED",
              });

              toast.success("Job archived");
              router.push("/admin/jobs");
            } catch (err: any) {
              toast.error("Failed to archive job");
            } finally {
              setSaving(false);
            }
          }}
        >
          Archive Job
        </Button> */}
        <Button onClick={saveChanges} disabled={saving}>
          {saving ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
