"use client";

import { PostingCard } from "@/components/posting-card";
import { Skeleton } from "@/components/ui/skeleton";
import { PostingDetailsDialog } from "@/components/posting-details-dialog";
import { useState } from "react";
import { Posting } from "@/lib/types";
import { useStudentJobPostings } from "@/hooks/useStudentJobPostings";

export default function PostingsPage() {
  const { data: postings, isLoading, error } = useStudentJobPostings();
  const [selectedPosting, setSelectedPosting] = useState<Posting | null>(null);

  return (
    <div className="container mx-auto py-8 space-y-8 p-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Current Job Openings
        </h1>
        <p className="text-muted-foreground">
          Explore the latest opportunities tailored for you.
        </p>
      </div>

      {error && (
        <div className="p-4 text-red-500 bg-red-50 rounded-md">
          Failed to load job postings.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="space-y-4 rounded-xl border p-4 shadow-sm"
            >
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ))
        ) : postings && postings.length > 0 ? (
          postings.map((posting, index) => (
            <PostingCard
              key={posting.id}
              posting={posting}
              index={index}
              onViewDetails={setSelectedPosting}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground py-10">
            No job postings available at the moment.
          </p>
        )}
      </div>

      <PostingDetailsDialog
        posting={selectedPosting}
        isOpen={!!selectedPosting}
        onClose={() => setSelectedPosting(null)}
      />
    </div>
  );
}
