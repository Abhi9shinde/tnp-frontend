"use client";

import { useEffect, useState } from "react";
import axios, { isAxiosError } from "axios";
import { Posting } from "@/lib/types";
import { PostingCard } from "@/components/posting-card";
import { Skeleton } from "@/components/ui/skeleton";
import { PostingDetailsDialog } from "@/components/posting-details-dialog";

export default function PostingsPage() {
  const [postings, setPostings] = useState<Posting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPosting, setSelectedPosting] = useState<Posting | null>(null);

  useEffect(() => {
    const fetchPostings = async () => {
      try {
        setLoading(true);
        const response = await axios.get<any>("/api/my-proxy/api/v1/postings");
        console.log("API Response:", response.data);

        // Handle potentially wrapped response
        let data: Posting[] = [];
        if (response.data?.postings && Array.isArray(response.data.postings)) {
          data = response.data.postings;
        } else if (Array.isArray(response.data)) {
          data = response.data;
        }

        console.log("Extracted Data:", data);
        setPostings(data);

        setError(null);
      } catch (err: any) {
        console.error("Error fetching postings:", err);
        // Fallback or specific error handling
        if (isAxiosError(err) && err.response?.status === 404) {
          setError("Failed to load postings. Resource not found.");
        } else {
          setError("Something went wrong. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPostings();
  }, []);

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
        <div className="p-4 text-red-500 bg-red-50 rounded-md">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? // Skeleton loaders
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="space-y-4 rounded-xl border p-4 shadow-sm"
              >
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))
          : postings.length > 0
            ? postings.map((posting, index) => (
                <PostingCard
                  key={posting.id}
                  posting={posting}
                  index={index}
                  onViewDetails={setSelectedPosting}
                />
              ))
            : !loading &&
              !error && (
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
