"use client";

import { useParams, useRouter } from "next/navigation";
import { useInterviewExperienceById } from "@/hooks/useInterviewExperienceById";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useStudentProfile } from "@/hooks/useStudentProfile";

export default function ExperienceDetailPage() {
  const { experienceId } = useParams<{ experienceId: string }>();

  const { data, isLoading } = useInterviewExperienceById(experienceId);
  const { data: userData } = useStudentProfile();
  console.log("studentProfile:", userData?.profile);

  const router = useRouter();

  if (isLoading) return <div className="p-8">Loading…</div>;
  if (!data)
    return <div className="p-8 text-red-500">Experience not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{data.title}</h1>
          <Badge variant="secondary">{data.difficulty}</Badge>
        </div>

        <p className="text-muted-foreground">
          {data.company} • {data.role}
        </p>

        <p className="text-sm text-muted-foreground">
          By {data.author.firstName} {data.author.lastName} •{" "}
          {new Date(data.createdAt).toLocaleDateString()}
        </p>
      </div>

      <Separator />

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Experience Overview</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="whitespace-pre-wrap leading-relaxed">{data.content}</p>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          Back
        </Button>

        {/* Only show if author */}
        {userData?.profile.id === data.author.id && (
          <Button
            variant="secondary"
            onClick={() => router.push(`/student/experiences/${data.id}/edit`)}
          >
            Edit
          </Button>
        )}
      </div>
    </div>
  );
}
