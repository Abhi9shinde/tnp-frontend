"use client";

import { Posting } from "@/lib/types";
import { PostingCard } from "@/components/posting-card";

// Mock data as provided in the requirements
const MOCK_POSTINGS: Posting[] = [
  {
    id: "37dac1a3-a615-42b7-9d6b-a2a85c6ecfd1",
    postedById: "2e2754ec-24bc-407c-a626-ab6d5d28cf83",
    role: "Programmer analyst trainee",
    company: "abc",
    companyInfo: "a def c 9",
    description: "qwertyuisdfghjxcv",
    ctc: "6lpa",
    deadline: "2030-11-23T09:38:28.710Z",
  },
  {
    id: "4469208e-4748-425f-ba03-7fb96899cf4d",
    postedById: "2e2754ec-24bc-407c-a626-ab6d5d28cf83",
    role: "Backend engineer",
    company: "abhinavDCS",
    companyInfo: "s afeibwc s",
    description: "A not so good job",
    ctc: "4lpa",
    deadline: "2030-11-23T09:38:28.710Z",
  },
];

export default function PostingsPage() {
  return (
    <div className="container mx-auto py-8 space-y-8 p-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Current Job Openings</h1>
        <p className="text-muted-foreground">
          Explore the latest opportunities tailored for you.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_POSTINGS.map((posting, index) => (
          <PostingCard key={posting.id} posting={posting} index={index} />
        ))}
      </div>
    </div>
  );
}
