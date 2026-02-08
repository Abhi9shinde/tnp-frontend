"use client";

import { useAdminJobPostings } from "@/hooks/useAdminJobPostings";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarIcon, BuildingIcon, BanknoteIcon } from "lucide-react";

export default function AdminDrivesPage() {
  const { data: postings, isLoading } = useAdminJobPostings();

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-primary">
            All Drives
          </h1>
          <p className="text-muted-foreground">
            Manage and view all placement drives.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          postings?.map((posting) => (
            <Card key={posting.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-semibold">{posting.role}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <BuildingIcon className="h-3 w-3" />
                      {posting.company}
                    </CardDescription>
                  </div>
                  <Badge variant={new Date(posting.deadline) > new Date() ? "secondary" : "destructive"}>
                    {new Date(posting.deadline) > new Date() ? "Active" : "Closed"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <BanknoteIcon className="h-4 w-4" />
                    <span>{posting.ctc}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    <span>Deadline: {new Date(posting.deadline).toLocaleDateString()}</span>
                  </div>
                  {posting.description && (
                    <p className="mt-2 line-clamp-2 text-xs">
                      {posting.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
        
        {!isLoading && postings?.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No drives found.
          </div>
        )}
      </div>
    </div>
  );
}
