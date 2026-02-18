"use client";

import React from "react";
import { SpotlightSearchBar } from "@/components/search/SpotlightSearchBar";
import { SuggestedProfiles } from "@/components/search/SuggestedProfiles";
import { motion } from "framer-motion";

export default function SearchPage() {
  return (
    <div className="relative min-h-[calc(100vh-80px)] py-10 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-primary/5 to-transparent blur-3xl -z-10" />
      
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight"
          >
            Find your <span className="text-primary">Network</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Search for fellow students, alumni, and potential team members across the institution.
          </motion.p>
        </div>

        {/* Search Bar Section */}
        <section className="relative z-50">
          <SpotlightSearchBar />
        </section>

        {/* Suggested Profiles Section */}
        <section className="space-y-8 relative z-0">
          <SuggestedProfiles />
        </section>
      </div>

      {/* Subtle Bottom Pattern */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none -z-10 opacity-60" />
    </div>
  );
}