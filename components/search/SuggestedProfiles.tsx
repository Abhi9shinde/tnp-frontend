"use client";

import React from "react";
import Image from "next/image";
import { ExternalLink, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { motion } from "framer-motion";

interface SuggestedProfile {
  id: string;
  name: string;
  branch: string;
  userId: string; // Changed from username to userId
  avatar?: string;
  mutualFriends?: number;
}

const mockSuggestions: SuggestedProfile[] = [
  { id: "1", name: "Anish Patil", branch: "Information Technology", userId: "anish_p_id", mutualFriends: 12 },
  { id: "2", name: "Siddharth Jain", branch: "Computer Engineering", userId: "sid_j_id", mutualFriends: 5 },
  { id: "3", name: "Priya Sharma", branch: "Electronics & TC", userId: "priya_s_id", mutualFriends: 8 },
  { id: "4", name: "Rohit Deshmukh", branch: "Civil Engineering", userId: "rohit_d_id", mutualFriends: 3 },
  { id: "5", name: "Sneha Kulkarni", branch: "Mechanical Engineering", userId: "sneha_k_id", mutualFriends: 10 },
  { id: "6", name: "Varun Verma", branch: "Computer Engineering", userId: "varun_v_id", mutualFriends: 7 },
];

export function SuggestedProfiles() {
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
        {mockSuggestions.map((profile, index) => (
          <motion.div
            key={profile.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="group hover:border-primary/50 transition-all duration-300 overflow-hidden bg-card/50 backdrop-blur-sm shadow-md hover:shadow-xl">
              <CardContent className="p-5 flex flex-col items-center text-center">
                <div className="relative mb-4 group-hover:scale-105 transition-transform duration-300">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-secondary/40 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative h-20 w-20 rounded-full bg-muted border-2 border-background flex items-center justify-center text-2xl font-bold text-primary overflow-hidden">
                    {profile.avatar ? (
                        <Image src={profile.avatar} alt={profile.name} fill className="object-cover" />
                    ) : (
                        profile.name.charAt(0)
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

                <div className="flex gap-2 w-full">
                  <Button variant="default" size="sm" className="flex-1 font-semibold h-9 rounded-xl shadow-sm hover:shadow-primary/20">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Connect
                  </Button>
                  <Button variant="secondary" size="icon" className="h-9 w-9 rounded-xl shadow-sm" asChild>
                    <Link href={`/profile/${profile.userId}`}>
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
