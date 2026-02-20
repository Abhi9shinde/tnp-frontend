"use client";

import { useInterviewExperiences } from "@/hooks/useInterviewExperiences";
import { ExperienceCard } from "@/components/ExperienceCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type ExperienceFilter = "ALL" | "MINE";

export default function ExperiencesPage() {
  const { data, isLoading } = useInterviewExperiences();
  const { data: userData } = useStudentProfile();
  const [filter, setFilter] = useState<ExperienceFilter>("ALL");

  const filteredData = useMemo(() => {
    if (filter === "ALL") return data;
    return data?.filter((exp: any) => exp.authorId === userData?.profile.id);
  }, [data, filter, userData]);

  const router = useRouter();

  return (
    <div className="space-y-8 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Interview Experiences</h1>
          <p className="text-muted-foreground">
            Learn from seniors and share your journey
          </p>
        </div>
        <Select
          value={filter}
          onValueChange={(value) => setFilter(value as ExperienceFilter)}
        >
          <SelectTrigger className="w-42.5">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="MINE">My Experiences</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={() => router.push("/student/experiences/create")}>
          + Share Experience
        </Button>
      </div>

      {/* Feed */}
      <div className="space-y-6">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))
          : filteredData?.map((exp: any) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}

        {!isLoading && data?.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            No experiences yet. Be the first to share!
          </p>
        )}
      </div>
    </div>
  );
}
