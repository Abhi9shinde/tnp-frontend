"use client";

import React from "react";
import Image from "next/image";
import { ExternalLink, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSuggestedProfiles } from "@/hooks/useSuggestedProfiles";

interface SuggestedProfile {
  id: string;
  name: string;
  branch: string;
  userId: string; 
  avatar?: string;
  mutualFriends?: number;
}

export function SuggestedProfiles() {
  const { data: suggestions, isLoading, isError } = useSuggestedProfiles();

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between px-2">
            <div className="h-6 w-40 bg-muted animate-pulse rounded-md" />
            <div className="h-4 w-12 bg-muted animate-pulse rounded-md" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-card/50 backdrop-blur-sm shadow-md h-[250px] animate-pulse">
                <CardContent className="p-5 flex flex-col items-center">
                    <div className="h-20 w-20 rounded-full bg-muted mb-4" />
                    <div className="h-4 w-3/4 bg-muted mb-2 rounded" />
                    <div className="h-3 w-1/2 bg-muted mb-6 rounded" />
                    <div className="flex gap-2 w-full mt-auto">
                        <div className="h-9 flex-1 bg-muted rounded-xl" />
                        <div className="h-9 w-9 bg-muted rounded-xl" />
                    </div>
                </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !suggestions || suggestions.length === 0) {
    return null; // Don't show suggested profiles if there's an error or no suggestions
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Suggested for you
        </h3>
        <Link href="#" className="text-sm font-semibold text-primary hover:underline">
          See All
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggestions.map((profile, index) => (
          <motion.div
            key={profile.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="group hover:border-primary/50 transition-all duration-300 overflow-hidden bg-card/50 backdrop-blur-sm shadow-md hover:shadow-xl h-full">
              <CardContent className="p-5 flex flex-col items-center text-center h-full">
                <div className="relative mb-4 group-hover:scale-105 transition-transform duration-300">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-secondary/40 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative h-20 w-20 rounded-full bg-muted border-2 border-background flex items-center justify-center text-2xl font-bold text-primary overflow-hidden">
                    {profile.avatar ? (
                        <Image src={profile.avatar} alt={profile.name} fill className="object-cover" />
                    ) : (
                        profile.name?.charAt(0) || "U"
                    )}
                  </div>
                </div>

                <div className="space-y-1 mb-6 w-full px-2">
                  <p className="font-bold text-base truncate">{profile.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{profile.branch}</p>
                  {profile.mutualFriends && (
                      <p className="text-[10px] font-medium text-muted-foreground/60 flex items-center justify-center gap-1 mt-1">
                          <Users className="h-3 w-3" />
                          {profile.mutualFriends} mutual connections
                      </p>
                  )}
                </div>

                <div className="flex gap-2 w-full mt-auto">
                  <Button variant="default" size="sm" className="flex-1 font-semibold h-9 rounded-xl shadow-sm hover:shadow-primary/20" asChild>
                    <Link href={`/student/u/${profile.userId}`}>
                      View Profile
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
