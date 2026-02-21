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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "SHORTLISTED":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "SELECTED":
        return "bg-green-100 text-green-700 border-green-300";
      case "REJECTED":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold tracking-tight">
          Applications Applied
        </h2>
        <span className="text-xs text-muted-foreground">
          {applications?.length || 0} total
        </span>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
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
                className="group relative rounded-2xl border bg-background p-5 transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-xl hover:border-primary/50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors duration-200">
                      {job?.role || "Unknown Role"}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {job?.company || "Unknown Company"}
                    </p>
                  </div>

                  <span
                    className={`text-[10px] px-3 py-1 rounded-full border font-semibold uppercase tracking-wide transition-all duration-200 ${getStatusColor(
                      app.status
                    )}`}
                  >
                    {app.status}
                  </span>
                </div>

                <div className="text-[11px] text-muted-foreground mt-4">
                  Applied on{" "}
                  {new Date(app.appliedAt).toLocaleDateString()}
                </div>

                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
              </div>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground">
            No applications yet
          </p>
        )}
      </div>
    </div>
  );
}