"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  education?: {
    branch: string;
    passingYear?: number;
  };
  avatar?: string;
}

export function SpotlightSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        setQuery("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/my-proxy/api/v1/student/search?query=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data.students || []);
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative w-full max-w-2xl mx-auto z-50">
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground mr-2">
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          ) : (
            <Search className="h-5 w-5" />
          )}
        </div>
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search students..."
          className="w-full h-14 pl-12 pr-12 text-lg rounded-2xl border-2 border-primary/20 bg-background/50 backdrop-blur-xl transition-all focus-visible:ring-primary focus-visible:border-primary shadow-lg"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-50 pointer-events-none">
          <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setIsOpen(false);
              }}
              className="pointer-events-auto hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full mt-3 w-full bg-background/95 backdrop-blur-2xl border border-border rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            <div className="p-2">
              {results.length > 0 ? (
                <div className="space-y-1">
                  <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Results
                  </p>
                  {results.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => router.push(`/profile/${student.userId}`)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/5 text-left transition-colors group"
                    >
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {student.firstName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {student.education?.branch || "Student"} {student.education?.passingYear ? `• Batch ${student.education.passingYear}` : ""}
                        </p>
                      </div>
                      <Command className="h-4 w-4 opacity-0 group-hover:opacity-30 transition-opacity" />
                    </button>
                  ))}
                </div>
              ) : !isLoading && query && (
                <div className="py-12 text-center text-muted-foreground">
                  <Search className="mx-auto h-8 w-8 mb-2 opacity-20" />
                  <p className="text-sm">No students found matching "{query}"</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
