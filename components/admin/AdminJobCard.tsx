"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Posting } from "@/lib/types";
import { useRouter } from "next/navigation";

export function AdminJobCard({ job }: { job: Posting }) {
  const router = useRouter();

  const statusVariant: any = {
    DRAFT: "secondary",
    OPEN: "success",
    CLOSED: "warning",
    ARCHIVED: "outline",
  } as const;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{job.role}</h3>
            <p className="text-sm text-muted-foreground">{job.company}</p>
          </div>

          <Badge variant={statusVariant[job.status]}>{job.status}</Badge>
        </div>

        {/* Meta */}
        <div className="text-sm text-muted-foreground space-y-1">
          <p>CTC: {job.ctc}</p>
          <p>Deadline: {new Date(job.deadline).toLocaleDateString()}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => router.push(`/admin/jobs/${job.id}`)}
          >
            View
          </Button>

          <Button
            size="sm"
            variant="default"
            onClick={() => router.push(`/admin/jobs/${job.id}/edit`)}
          >
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
