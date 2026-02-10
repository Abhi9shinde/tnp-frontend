"use client";

import React from "react";
import { useStudentApplications } from "@/hooks/useStudentApplications";
import { useStudentJobPostings } from "@/hooks/useStudentJobPostings";

export function ApplicationsSection() {
  const { data: applications, isLoading: appsLoading } =
    useStudentApplications();
  const { data: postings, isLoading: postingsLoading } =
    useStudentJobPostings();

  const loading = appsLoading || postingsLoading;

  const getJobDetails = (jobPostId: string) => {
    return postings?.find((p) => p.id === jobPostId);
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Applications Applied</h2>
      <div className="space-y-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">
            Loading applications...
          </p>
        ) : applications && applications.length > 0 ? (
          applications.map((app) => {
            const job = getJobDetails(app.jobPostId);
            return (
              <div
                key={app.id}
                className="flex flex-col gap-1 p-3 rounded-md border border-border bg-muted/40"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-sm">
                      {job?.role || "Unknown Role"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {job?.company || "Unknown Company"}
                    </p>
                  </div>
                  <span
                    className={
                      `text-[10px] px-2 py-0.5 rounded-full bg-yellow-400 text-black uppercase font-bold tracking-wider` +
                        app.status ===
                      "APPLIED"
                        ? "bg-yellow-400"
                        : app.status === "INTERVIEW"
                          ? "bg-blue-400"
                          : app.status === "SELECTED"
                            ? "bg-green-400"
                            : app.status === "REJECTED"
                              ? "bg-red-400"
                              : "bg-gray-400"
                    }
                  >
                    {app.status}
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  Applied: {new Date(app.appliedAt).toLocaleDateString()}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground">No applications yet</p>
        )}
      </div>
    </div>
  );
}
