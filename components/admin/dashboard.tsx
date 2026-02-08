"use client";

import React from "react";

import { useAdminJobPostings } from "@/hooks/useAdminJobPostings";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function AdminDashboardComponent() {
  const { data: postings, isLoading } = useAdminJobPostings();
  const router = useRouter();

  // Placeholder stats - in a real app these would likely come from an API
  const stats = [
    {
      title: "Placed Students",
      value: "142",
      label: "Total Placed",
      change: "+12% from last year",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      title: "Total Students",
      value: "520",
      label: "Registered",
      change: "Active batch",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground"
        >
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
    },
    {
      title: "Companies",
      value: "24",
      label: "Visited",
      change: "+4 this month",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground"
        >
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <path d="M2 10h20" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-primary">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Overview of placement activities and student progress.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Additional actions can go here */}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Post New Application - Hero Card */}
        <Card className="col-span-1 md:col-span-2 row-span-1 lg:row-span-1 bg-gradient-to-br from-primary to-purple-900 text-primary-foreground border-none overflow-hidden relative group">
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <CardHeader>
            <CardTitle className="text-xl">Create New Job Posting</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Launch a new drive for students.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="secondary"
              className="w-full sm:w-auto font-semibold hover:bg-white/90"
              onClick={() => router.push("/admin/posting")}
            >
              Post Application
            </Button>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        {stats.map((stat, i) => (
          <Card
            key={i}
            className="hover:shadow-lg transition-shadow duration-300 border-border/50"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Open Applications List */}
        <Card 
          className="col-span-1 md:col-span-2 lg:col-span-4 border-border/50 cursor-pointer hover:shadow-md transition-all duration-200"
          onClick={() => router.push("/admin/jobs")}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Job Postings</CardTitle>
                <CardDescription>
                  Currently active and recently closed applications.
                </CardDescription>
              </div>
              <Badge variant="outline" className="hidden sm:inline-flex">View All</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {postings?.slice(0, 5).map((posting, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="flex flex-col gap-1">
                      <p className="font-semibold leading-none">
                        {posting.role}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {posting.company}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:flex flex-col items-end gap-1 text-sm text-muted-foreground">
                        <span>CTC: {posting.ctc}</span>
                        <span>
                          Deadline:{" "}
                          {new Date(posting.deadline).toLocaleDateString()}
                        </span>
                      </div>
                      <Badge variant="success" className="ml-auto">
                        Active
                      </Badge>
                    </div>
                  </div>
                ))}
                {!postings?.length && (
                  <div className="text-center py-8 text-muted-foreground">
                    No recent postings found.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analytics / Charts Placeholder */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-3 border-border/50">
          <CardHeader>
            <CardTitle>Placement Overview</CardTitle>
            <CardDescription>
              Department wise placement statistics.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center min-h-[300px]">
            <div className="text-center space-y-4">
              <div className="relative flex h-32 w-32 mx-auto items-center justify-center rounded-full border-4 border-primary/20">
                <span className="text-3xl font-bold text-primary">68%</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Total Placement Rate
              </p>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="flex flex-col">
                  <span className="font-medium">CSE</span>
                  <span className="text-muted-foreground">85% Placed</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">ENTC</span>
                  <span className="text-muted-foreground">62% Placed</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
